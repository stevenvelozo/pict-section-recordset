const libPictTemplate = require('pict-template');
const libFilterViews = require('../views/filters/index.js');

/**
 * Specialized instruction for rendering the filter view and plumbing in required context.
 *
 * Based on the Pict base {~V:...~} template instruction.
 */
class PictTemplateFilterInstanceViewInstruction extends libPictTemplate
{
	/**
	 * @param {Object} pFable - The Fable Framework instance
	 * @param {Object} pOptions - The options for the service
	 * @param {String} pServiceHash - The hash of the service
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		/** @type {any} */
		this.log;

		this.addPattern('{~FIV:', '~}');
		this.addPattern('{~FilterInstanceViews:', '~}');


		if (!('__TemplateOutputCache' in this.pict))
		{
			this.pict.__TemplateOutputCache = {};
		}
	}

	_getViewForFilterClause(pClause)
	{
		let tmpViewHash = `PRSP-FilterType-${pClause.Type}`;
		const tmpCustomViewHash = `${tmpViewHash}-${pClause.CustomFilterViewHash}`;
		if (tmpCustomViewHash in this.pict.views)
		{
			tmpViewHash = tmpCustomViewHash;
		}
		/** @type {import('../views/filters/RecordSet-Filter-Base.js')} */
		let tmpView = this.pict.views[tmpViewHash];
		if (!tmpView)
		{
			const tmpViewPrototype = libFilterViews[pClause.Type] || libFilterViews.Base;
			if (!tmpViewPrototype)
			{
				this.pict.log.error(`Pict: Filter Instance Views Template Render: No view prototype found for filter type [${pClause.Type}]`);
				return null;
			}
			//FIXME: is this safe? will this view get rendered at other times?
			tmpView = this.pict.addView(tmpViewHash, { }, tmpViewPrototype);
		}
		return tmpView;
	}

	/**
	 * Render a template expression, returning a string with the resulting content.
	 *
	 * @param {string} pTemplateHash - The hash contents of the template (what's between the template start and stop tags)
	 * @param {any} pRecord - The json object to be used as the Record for the template render
	 * @param {Array<any>} pContextArray - An array of context objects accessible from the template; safe to leave empty
	 * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
	 * @param {any} [pState] - A catchall state object for plumbing data through template processing.
	 *
	 * @return {string} The rendered template
	 */
	render(pTemplateHash, pRecord, pContextArray, pScope, pState)
	{
		const tmpRecordSet = pRecord.RecordSet || '';
		if (!tmpRecordSet)
		{
			this.pict.log.error(`Pict: Filter Instance Views Template Render: No record set specified in record`);
			return '';
		}
		const tmpRecordSetConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations?.[tmpRecordSet];
		if (!tmpRecordSetConfiguration)
		{
			this.pict.log.error(`Pict: Filter Instance Views Template Render: No record set configuration found for [${tmpRecordSet}]`);
			return '';
		}
		let tmpViewContext = pRecord.ViewContext;
		if (tmpViewContext)
		{
			tmpViewContext = tmpViewContext.trim();
		}
		else
		{
			tmpViewContext = 'Default';
		}
		pRecord = pRecord || {};
		if (!pRecord.RecordSet)
		{
			pRecord.RecordSet = tmpRecordSet;
		}
		if (!pRecord.RecordSetConfiguration)
		{
			pRecord.RecordSetConfiguration = tmpRecordSetConfiguration;
		}
		if (!pRecord.ViewContext)
		{
			pRecord.ViewContext = pRecord.DashboardHash ? `${tmpViewContext}-${pRecord.DashboardHash}` : tmpViewContext;
		}

		let tmpRenderGUID = this.pict.getUUID();
		let tmpResult = '';

		const tmpClauses = this.pict.Bundle._ActiveFilterState?.[pRecord.RecordSet]?.FilterClauses || [];
		//FIXME: lookup by hash instead?
		for (let i = 0; i < tmpClauses.length; i++)
		{
			const tmpClause = tmpClauses[i];
			/** @type {import('../views/filters/RecordSet-Filter-Base.js')} */
			const tmpView = this._getViewForFilterClause(tmpClause);
			if (!tmpView)
			{
				continue;
			}

			const tmpRecord = Object.assign({}, pRecord, tmpClause);
			//tmpRecord.ClauseAddress = `Bundle._ActiveFilterState['${pRecord.RecordSet}'].FilterClauses[${i}]`;
			tmpRecord.ClauseAddress = `_ActiveFilterState[\`${pRecord.RecordSet}\`].FilterClauses[${i}]`;
			tmpView.prepareRecord(tmpRecord);
			tmpView.renderWithScope(tmpClause, '__Virtual', `__TemplateOutputCache.${tmpRenderGUID}`, tmpRecord, pState && pState.RootRenderable);

			tmpResult += this.pict.__TemplateOutputCache[tmpRenderGUID];
			// TODO: Uncomment this when we like how it's working
			//delete this.pict.__TemplateOutputCache[tmpRenderGUID];

		}
		return tmpResult;
	}

	/**
	 * @param {string} pTemplateHash - The hash contents of the template (what's between the template start and stop tags)
	 * @param {any} pRecord - The json object to be used as the Record for the template
	 * @param {(pError?: Error, pResult?: string) => void} fCallback - The callback function to call with the result
	 * @param {Array<any>} pContextArray - An array of context objects accessible from the template; safe to leave empty
	 * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
	 * @param {any} [pState] - A catchall state object for plumbing data through template processing.
	 * @return {void}
	 */
	renderAsync(pTemplateHash, pRecord, fCallback, pContextArray, pScope, pState)
	{
		const tmpRecordSet = pRecord.RecordSet || '';
		if (!tmpRecordSet)
		{
			this.pict.log.error(`Pict: Filter Instance Views Template Render: No record set specified in record`);
			return fCallback(null, '');
		}
		const tmpRecordSetConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations?.[tmpRecordSet];
		if (!tmpRecordSetConfiguration)
		{
			this.pict.log.error(`Pict: Filter Instance Views Template Render: No record set configuration found for [${tmpRecordSet}]`);
			return fCallback(null, '');
		}
		let tmpViewContext = pRecord.ViewContext;
		if (tmpViewContext)
		{
			tmpViewContext = tmpViewContext.trim();
		}
		else
		{
			tmpViewContext = 'Default';
		}

		pRecord = pRecord || {};
		if (!pRecord.RecordSet)
		{
			pRecord.RecordSet = tmpRecordSet;
		}
		if (!pRecord.RecordSetConfiguration)
		{
			pRecord.RecordSetConfiguration = tmpRecordSetConfiguration;
		}
		if (!pRecord.ViewContext)
		{
			pRecord.ViewContext = pRecord.DashboardHash ? `${tmpViewContext}-${pRecord.DashboardHash}` : tmpViewContext;
		}
		const tmpAnticipate = this.pict.newAnticipate();
		let tmpResult = '';

		const tmpClauses = this.pict.Bundle._ActiveFilterState?.[pRecord.RecordSet]?.FilterClauses || [];
		//FIXME: lookup by hash instead?
		for (let i = 0; i < tmpClauses.length; i++)
		{
			const tmpClause = tmpClauses[i];
			/** @type {import('../views/filters/RecordSet-Filter-Base.js')} */
			const tmpView = this._getViewForFilterClause(tmpClause);
			if (!tmpView)
			{
				continue;
			}

			const tmpRenderGUID = this.pict.getUUID();
			tmpAnticipate.anticipate((fNext) =>
			{
				const tmpRecord = Object.assign({}, pRecord, tmpClause);
				tmpRecord.ClauseAddress = `_ActiveFilterState[${pRecord.RecordSet}].FilterClauses[${i}]`;
				tmpView.prepareRecord(tmpRecord);

				return tmpView.renderWithScopeAsync(tmpClause, '__Virtual', `__TemplateOutputCache.${tmpRenderGUID}`, tmpRecord, pState && pState.RootRenderable,
					(pError, pResult) =>
					{
						if (pError)
						{
							this.log.warn(`Pict: Filter Instance Views Template Render: Error rendering view [${tmpView.Hash}]`, pError);
							//TODO: should we fail the whole render?
							return fNext();
							//return fNext(pError);
						}

						tmpResult += this.pict.__TemplateOutputCache[tmpRenderGUID];
						// TODO: Uncomment this when we like how it's working
						//delete this.pict.__TemplateOutputCache[tmpRenderGUID];

						return fNext(null);
					});
			});
		}
		return tmpAnticipate.wait((pError) =>
		{
			return fCallback(pError, tmpResult);
		});
	}
}

module.exports = PictTemplateFilterInstanceViewInstruction;
