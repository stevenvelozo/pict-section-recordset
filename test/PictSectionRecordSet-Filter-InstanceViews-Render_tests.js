/*
	Unit tests for Pict-Template-FilterInstanceViews.renderAsync.

	Exercises the parallel filter fan-out, per-filter transaction isolation,
	deferred post-render drain, render-epoch guard, and transaction-map cleanup
	added for the filter render performance refactor.
*/

const libBrowserEnv = require('browser-env');
libBrowserEnv({ url: 'http://localhost/' });

const Chai = require('chai');
const Expect = Chai.expect;

const libPict = require('pict');
const libPictView = require('pict-view');
const libPictTemplateFilterInstanceViews = require('../source/templates/Pict-Template-FilterInstanceViews.js');

/**
 * Minimal stub filter view that records every interaction and lets each test
 * control when the render and drain callbacks fire. The stub never touches
 * the DOM and never spawns sub-renders - everything is recorded so the tests
 * can inspect ordering.
 */
class StubFilterView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.recordedCalls = [];
		this.pendingRenderCallbacks = [];
		this.pendingDrainCallbacks = [];
		this._fakeOutput = pOptions && pOptions.fakeOutput ? pOptions.fakeOutput : '<stub/>';
	}

	prepareRecord(pRecord)
	{
		this.recordedCalls.push({ type: 'prepareRecord', hash: pRecord && pRecord.Hash });
	}

	renderWithScopeAsync(pScope, pRenderableHash, pDestinationAddress, pRecord, pRootRenderable, fCallback)
	{
		this.recordedCalls.push({
			type: 'renderWithScopeAsync',
			rootRenderable: pRootRenderable,
			destinationAddress: pDestinationAddress,
			clauseHash: pRecord && pRecord.Hash,
		});
		// Simulate a real render writing into the pict template output cache.
		const tmpCacheKey = pDestinationAddress.split('.')[1];
		const tmpIndex = this.pendingRenderCallbacks.length;
		this.pict.__TemplateOutputCache[tmpCacheKey] = `${this._fakeOutput}-${tmpIndex}`;
		// Defer the callback until the test fires it manually.
		this.pendingRenderCallbacks.push(() => fCallback());
	}

	onAfterRenderAsync(fCallback, pRenderable)
	{
		this.recordedCalls.push({
			type: 'onAfterRenderAsync',
			rootRenderable: pRenderable,
		});
		// Defer the drain callback until the test fires it manually.
		this.pendingDrainCallbacks.push(() => fCallback());
	}

	fireAllRenderCallbacks()
	{
		while (this.pendingRenderCallbacks.length > 0)
		{
			this.pendingRenderCallbacks.shift()();
		}
	}

	fireAllDrainCallbacks()
	{
		while (this.pendingDrainCallbacks.length > 0)
		{
			this.pendingDrainCallbacks.shift()();
		}
	}
}

/**
 * Stand up a pict instance with just enough wiring for the FilterInstanceViews
 * template to run. Returns the pict instance, the template instance, and the
 * stub filter view.
 *
 * @param {Array<object>} pFilterClauses - Filter clauses to populate into Bundle._ActiveFilterState.
 */
function buildHarness(pFilterClauses)
{
	const _Pict = new libPict();
	_Pict.LogNoisiness = 0;

	// FilterInstanceViews.renderAsync expects pict.PictSectionRecordSet.recordSetProviderConfigurations
	// to resolve the record set. Stub the minimum shape.
	_Pict.PictSectionRecordSet = {
		recordSetProviderConfigurations: {
			TestRS: { RecordSet: 'TestRS' },
		},
	};

	// Register a stub filter view so _getViewForFilterClause returns it for
	// clauses of type 'StubFilterType'. Doing this BEFORE adding the
	// 'PRSP-Filters' fake entry below, because addView creates a real view
	// in the pict.views map and we need the hash to match what
	// _getViewForFilterClause looks up.
	_Pict.addView('PRSP-FilterType-StubFilterType', {}, StubFilterView);

	// FilterInstanceViews expects pict.views['PRSP-Filters'] to have a
	// _renderEpoch field so the deferred drain can snapshot + compare it.
	// Direct assignment on the views map is fine for a stub.
	_Pict.views['PRSP-Filters'] = { _renderEpoch: 0 };

	// Populate the active filter state that renderAsync reads.
	_Pict.Bundle._ActiveFilterState = {
		TestRS: { FilterClauses: pFilterClauses },
	};

	// Register the template instance we want to test and capture it.
	const tmpInstruction = _Pict.addTemplate(libPictTemplateFilterInstanceViews);

	return {
		pict: _Pict,
		instruction: tmpInstruction,
		stubView: _Pict.views['PRSP-FilterType-StubFilterType'],
	};
}

suite('PictSectionRecordSet FilterInstanceViews Render', () =>
{
	suite('renderAsync', () =>
	{
		test('is a no-op when there are zero clauses', (fDone) =>
		{
			const tmpHarness = buildHarness([]);
			tmpHarness.instruction.renderAsync('', { RecordSet: 'TestRS' }, (pError, pResult) =>
			{
				Expect(pError).to.be.null;
				Expect(pResult).to.equal('');
				Expect(tmpHarness.stubView.recordedCalls).to.deep.equal([]);
				return fDone();
			});
		});

		test('fans out all filter renders in parallel before any callback fires', (fDone) =>
		{
			const tmpClauses = [
				{ Type: 'StubFilterType', Hash: 'clauseA', FilterByColumn: 'A' },
				{ Type: 'StubFilterType', Hash: 'clauseB', FilterByColumn: 'B' },
				{ Type: 'StubFilterType', Hash: 'clauseC', FilterByColumn: 'C' },
			];
			const tmpHarness = buildHarness(tmpClauses);

			let tmpFinalCallbackFired = false;
			tmpHarness.instruction.renderAsync('', { RecordSet: 'TestRS' }, () =>
			{
				tmpFinalCallbackFired = true;
			});

			// At this point every filter should have had renderWithScopeAsync
			// called, even though zero render callbacks have fired yet. A
			// sequential version would have only called renderWithScopeAsync
			// on the first filter at this point.
			const tmpRenderStarts = tmpHarness.stubView.recordedCalls.filter((c) => c.type === 'renderWithScopeAsync');
			Expect(tmpRenderStarts.length).to.equal(3, 'all three filter renders should have started in parallel');
			Expect(tmpFinalCallbackFired).to.equal(false, 'final callback must not fire until every render completes');

			// Fire all render callbacks, then finalize runs synchronously.
			tmpHarness.stubView.fireAllRenderCallbacks();
			Expect(tmpFinalCallbackFired).to.equal(true, 'final callback should fire once every render completes');
			return fDone();
		});

		test('concatenates per-filter output in clause order', (fDone) =>
		{
			const tmpClauses = [
				{ Type: 'StubFilterType', Hash: 'clauseA', FilterByColumn: 'A' },
				{ Type: 'StubFilterType', Hash: 'clauseB', FilterByColumn: 'B' },
				{ Type: 'StubFilterType', Hash: 'clauseC', FilterByColumn: 'C' },
			];
			const tmpHarness = buildHarness(tmpClauses);

			tmpHarness.instruction.renderAsync('', { RecordSet: 'TestRS' }, (pError, pResult) =>
			{
				Expect(pError).to.be.null;
				// Stub output is `<stub/>-N` where N is the render start index.
				// Since all three are started in order, the outputs are 0, 1, 2.
				Expect(pResult).to.equal('<stub/>-0<stub/>-1<stub/>-2');
				return fDone();
			});
			tmpHarness.stubView.fireAllRenderCallbacks();
		});

		test('each filter render gets its own transaction hash (not the dashboard root)', (fDone) =>
		{
			const tmpClauses = [
				{ Type: 'StubFilterType', Hash: 'clauseA', FilterByColumn: 'A' },
				{ Type: 'StubFilterType', Hash: 'clauseB', FilterByColumn: 'B' },
			];
			const tmpHarness = buildHarness(tmpClauses);

			// Pass a fake dashboard root as pState.RootRenderable. The template
			// must NOT propagate this transaction hash into the per-filter
			// renders - each should have its own.
			const tmpFakeDashboardRoot =
			{
				TransactionHash: 'DashboardTx-shouldNotLeak',
				RootRenderableViewHash: 'PRSP-Dashboard-Stub',
			};

			tmpHarness.instruction.renderAsync('', { RecordSet: 'TestRS' }, () =>
			{
				const tmpRenderStarts = tmpHarness.stubView.recordedCalls.filter((c) => c.type === 'renderWithScopeAsync');
				const tmpTransactionHashes = tmpRenderStarts.map((c) => c.rootRenderable.TransactionHash);

				Expect(tmpTransactionHashes).to.have.lengthOf(2);
				Expect(tmpTransactionHashes[0]).to.not.equal('DashboardTx-shouldNotLeak');
				Expect(tmpTransactionHashes[1]).to.not.equal('DashboardTx-shouldNotLeak');
				Expect(tmpTransactionHashes[0]).to.not.equal(tmpTransactionHashes[1]);
				Expect(tmpTransactionHashes[0]).to.match(/^FilterInstance-/);
				Expect(tmpTransactionHashes[1]).to.match(/^FilterInstance-/);
				return fDone();
			}, null, null, { RootRenderable: tmpFakeDashboardRoot });

			tmpHarness.stubView.fireAllRenderCallbacks();
		});

		test('fires fCallback BEFORE draining deferred post-render work', (fDone) =>
		{
			const tmpClauses = [
				{ Type: 'StubFilterType', Hash: 'clauseA', FilterByColumn: 'A' },
				{ Type: 'StubFilterType', Hash: 'clauseB', FilterByColumn: 'B' },
			];
			const tmpHarness = buildHarness(tmpClauses);

			let tmpFinalCallbackFired = false;
			tmpHarness.instruction.renderAsync('', { RecordSet: 'TestRS' }, () =>
			{
				tmpFinalCallbackFired = true;
			});

			// Complete all filter renders synchronously.
			tmpHarness.stubView.fireAllRenderCallbacks();
			Expect(tmpFinalCallbackFired).to.equal(true, 'fCallback should have fired once every render completed');

			// At this exact moment no drain has run yet: the drain is queued
			// behind a setTimeout(0) macrotask.
			const tmpDrainsBeforeTick = tmpHarness.stubView.recordedCalls.filter((c) => c.type === 'onAfterRenderAsync').length;
			Expect(tmpDrainsBeforeTick).to.equal(0, 'no drain should have run yet - it is scheduled on the next macrotask');

			// Let the setTimeout(0) fire.
			setTimeout(() =>
			{
				const tmpDrainsAfterTick = tmpHarness.stubView.recordedCalls.filter((c) => c.type === 'onAfterRenderAsync').length;
				Expect(tmpDrainsAfterTick).to.equal(2, 'both filter drains should have run on the next macrotask');
				return fDone();
			}, 5);
		});

		test('epoch guard: a drain scheduled before a filter re-render is skipped', (fDone) =>
		{
			const tmpClauses = [
				{ Type: 'StubFilterType', Hash: 'clauseA', FilterByColumn: 'A' },
			];
			const tmpHarness = buildHarness(tmpClauses);
			const tmpFiltersView = tmpHarness.pict.views['PRSP-Filters'];

			tmpHarness.instruction.renderAsync('', { RecordSet: 'TestRS' }, () => {});
			tmpHarness.stubView.fireAllRenderCallbacks();

			// Simulate a filter mutation that bumps the epoch between the
			// dashboard callback firing and the setTimeout drain running.
			tmpFiltersView._renderEpoch = tmpFiltersView._renderEpoch + 1;

			setTimeout(() =>
			{
				const tmpDrainCalls = tmpHarness.stubView.recordedCalls.filter((c) => c.type === 'onAfterRenderAsync').length;
				Expect(tmpDrainCalls).to.equal(0, 'drain should have been skipped because the epoch changed');
				return fDone();
			}, 5);
		});

		test('transaction map entries for filter renders are cleaned up after the drain', (fDone) =>
		{
			const tmpClauses = [
				{ Type: 'StubFilterType', Hash: 'clauseA', FilterByColumn: 'A' },
				{ Type: 'StubFilterType', Hash: 'clauseB', FilterByColumn: 'B' },
			];
			const tmpHarness = buildHarness(tmpClauses);

			tmpHarness.instruction.renderAsync('', { RecordSet: 'TestRS' }, () => {});
			tmpHarness.stubView.fireAllRenderCallbacks();

			// Right after fCallback fires, both filter transactions are
			// registered in the map (the drain has not run yet).
			const tmpFilterKeysBefore = Object.keys(tmpHarness.pict.TransactionTracking.transactionMap)
				.filter((k) => k.startsWith('FilterInstance-'));
			Expect(tmpFilterKeysBefore.length).to.equal(2, 'both filter transactions should be registered before the drain runs');

			setTimeout(() =>
			{
				// The drain kicks off both filters' onAfterRenderAsync calls.
				// Fire their drain completion callbacks so the cleanup runs.
				tmpHarness.stubView.fireAllDrainCallbacks();

				const tmpFilterKeysAfter = Object.keys(tmpHarness.pict.TransactionTracking.transactionMap)
					.filter((k) => k.startsWith('FilterInstance-'));
				Expect(tmpFilterKeysAfter.length).to.equal(0, 'transaction map should be cleaned up after the drain completes');
				return fDone();
			}, 5);
		});

		test('bails early with empty result when the record set is not configured', (fDone) =>
		{
			const tmpHarness = buildHarness([
				{ Type: 'StubFilterType', Hash: 'clauseA', FilterByColumn: 'A' },
			]);
			tmpHarness.instruction.renderAsync('', { RecordSet: 'NotConfigured' }, (pError, pResult) =>
			{
				Expect(pError).to.be.null;
				Expect(pResult).to.equal('');
				return fDone();
			});
		});
	});
});
