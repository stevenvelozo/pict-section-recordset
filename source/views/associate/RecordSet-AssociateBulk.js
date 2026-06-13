const libPictView = require('pict-view');

/**
 * The Bulk Associate screen — a purpose-built page for bulk join operations ("assign these books to
 * THIS store"). The anchor recordset (the route's `:RecordSet`) is one side of the association; the
 * user picks an anchor record, multi-selects many other-side records (currently-associated rows culled
 * out), and creates all the joins at once. Current associations are listed below, each removable.
 *
 * Registered ONCE by the metacontroller as `RSP-RecordSet-Associate` and parameterized by route:
 *   /PSRS/:RecordSet/Associate/:Association
 *   /PSRS/:RecordSet/Associate/:Association/:AnchorID
 *
 * Light opt-in: a recordset advertises the screen in its nav by listing `RecordSetBulkAssociations`,
 * but the route works for any association whose side matches `:RecordSet`. All data flows through the
 * shared `RecordSetAssociationManager`; pickers come from `pict-section-picker` (soft dependency).
 */

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_AssociateBulk = (
	{
		ViewIdentifier: 'PRSP-AssociateBulk',

		DefaultRenderable: 'PRSP_Renderable_AssociateBulk',
		DefaultDestinationAddress: '#PRSP_Container',
		DefaultTemplateRecordAddress: false,

		AutoInitialize: false,
		AutoInitializeOrdinal: 0,
		AutoRender: false,
		AutoRenderOrdinal: 0,
		AutoSolveWithApp: false,
		AutoSolveOrdinal: 0,

		CSS: /*css*/`
		.prsp-bulk { display: flex; flex-direction: column; gap: 1.1rem; padding: 0.25rem 0 1rem; }
		.prsp-bulk-header h2 { margin: 0 0 0.2rem; font-size: 1.25rem; color: var(--theme-color-text-primary, #1f2733); }
		.prsp-bulk-sub { margin: 0; color: var(--theme-color-text-muted, #6b7686); font-size: 0.92rem; }
		.prsp-bulk-card { border: 1px solid var(--theme-color-border-light, #e8ebf0); border-radius: 12px; padding: 0.9rem 1rem; background: var(--theme-color-background-primary, #fff); display: flex; flex-direction: column; gap: 0.5rem; }
		.prsp-bulk-card-label { font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.05em; color: var(--theme-color-text-muted, #6b7686); }
		.prsp-bulk-picker-host { max-width: 520px; }
		.prsp-bulk-actions { display: flex; align-items: center; gap: 0.6rem; }
		.prsp-bulk-associate { display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; font: inherit; font-size: 0.92rem; font-weight: 600;
			padding: 0.5rem 0.95rem; border-radius: 8px; border: 1px solid var(--theme-color-brand-primary, #156dd1);
			background: var(--theme-color-brand-primary, #156dd1); color: #fff; }
		.prsp-bulk-associate:hover { background: var(--theme-color-brand-primary-hover, #1259ad); }
		.prsp-bulk-hint { color: var(--theme-color-text-muted, #6b7686); font-size: 0.92rem; font-style: italic; padding: 0.5rem 0.2rem; }
		.prsp-bulk-note { color: var(--theme-color-status-error, #b62828); font-size: 0.86rem; }
		.prsp-bulk-list-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
		.prsp-bulk-list-title { font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.05em; color: var(--theme-color-text-muted, #6b7686); }
		.prsp-bulk-count { font-size: 0.78rem; color: var(--theme-color-text-muted, #6b7686); }
		.prsp-bulk-list { display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.3rem; }
		.prsp-bulk-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.45rem 0.6rem; border: 1px solid var(--theme-color-border-light, #e8ebf0); border-radius: 8px; background: var(--theme-color-background-primary, #fff); }
		.prsp-bulk-row-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--theme-color-text-primary, #1f2733); font-size: 0.92rem; }
		.prsp-bulk-row-id { flex: 0 0 auto; font-size: 0.74rem; color: var(--theme-color-text-muted, #6b7686); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
		.prsp-bulk-remove { flex: 0 0 auto; display: inline-flex; align-items: center; cursor: pointer; border: none; background: transparent; color: var(--theme-color-text-muted, #6b7686); padding: 0.2rem; border-radius: 5px; font: inherit; }
		.prsp-bulk-remove:hover { color: var(--theme-color-status-error, #b62828); background: color-mix(in srgb, var(--theme-color-status-error, #b62828) 10%, transparent); }
		.prsp-bulk-empty { padding: 0.6rem 0.2rem; color: var(--theme-color-text-muted, #6b7686); font-size: 0.88rem; font-style: italic; }
		`,
		CSSPriority: 500,

		Templates:
		[
			{
				Hash: 'PRSP-AssociateBulk-Template',
				Template: /*html*/`
		<!-- DefaultPackage pict view template: [PRSP-AssociateBulk-Template] -->
		<div class="prsp-bulk">
			<div class="prsp-bulk-header">
				<h2>{~D:Record.Title~}</h2>
				<p class="prsp-bulk-sub">{~D:Record.Subtitle~}</p>
			</div>
			<div class="prsp-bulk-card">
				<span class="prsp-bulk-card-label">{~D:Record.AnchorLabel~}</span>
				<div class="prsp-bulk-picker-host" id="{~D:Record.AnchorPickerHostID~}"></div>
				{~NE:Record.PickerMissing^<div class="prsp-bulk-note">The entity picker (pict-section-picker) is not registered, so this screen cannot run.</div>~}
			</div>
			{~TS:PRSP-AssociateBulk-Hint:Record.HintSlot~}
			{~TS:PRSP-AssociateBulk-Body:Record.BodySlot~}
		</div>
		<!-- DefaultPackage end view template:  [PRSP-AssociateBulk-Template] -->
	`
			},
			{
				Hash: 'PRSP-AssociateBulk-Hint',
				Template: /*html*/`
		<div class="prsp-bulk-hint">{~D:Record.Hint~}</div>
	`
			},
			{
				Hash: 'PRSP-AssociateBulk-Body',
				Template: /*html*/`
		<div class="prsp-bulk-card">
			<span class="prsp-bulk-card-label">{~D:Record.AddLabel~}</span>
			<div class="prsp-bulk-picker-host" id="{~D:Record.CandidatePickerHostID~}"></div>
			<div class="prsp-bulk-actions">
				<button type="button" class="prsp-bulk-associate" onclick="_Pict.views['RSP-RecordSet-Associate'].associateStaged()">{~I:Plus~} {~D:Record.AssociateLabel~}</button>
			</div>
		</div>
		<div class="prsp-bulk-card">
			<div class="prsp-bulk-list-head">
				<span class="prsp-bulk-list-title">{~D:Record.ListLabel~}</span>
				<span class="prsp-bulk-count">{~D:Record.Count~}</span>
			</div>
			<div class="prsp-bulk-list">
				{~TS:PRSP-AssociateBulk-Row:Record.Items~}
				{~TS:PRSP-AssociateBulk-Empty:Record.EmptySlot~}
			</div>
		</div>
	`
			},
			{
				Hash: 'PRSP-AssociateBulk-Empty',
				Template: /*html*/`<div class="prsp-bulk-empty">{~D:Record.EmptyText~}</div>`
			},
			{
				Hash: 'PRSP-AssociateBulk-Row',
				Template: /*html*/`
		<div class="prsp-bulk-row">
			<span class="prsp-bulk-row-name">{~D:Record.Display~}</span>
			<span class="prsp-bulk-row-id">#{~D:Record.OtherID~}</span>
			<button type="button" class="prsp-bulk-remove" title="Remove association" onclick="_Pict.views['RSP-RecordSet-Associate'].removeItem({~D:Record.JoinID~})">{~I:Trash~}</button>
		</div>
	`
			}
		],

		Renderables:
		[
			{
				RenderableHash: 'PRSP_Renderable_AssociateBulk',
				TemplateHash: 'PRSP-AssociateBulk-Template',
				ContentDestinationAddress: '#PRSP_Container',
				RenderMethod: 'replace'
			}
		],

		Manifests: {}
	});

class viewRecordSetAssociateBulk extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_AssociateBulk, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		/** @type {import('pict') & { PictSectionRecordSet: any }} */
		this.pict;

		this._anchorRecordSet = null;
		this._associationHash = null;
		this._anchorID = null;
		this._currentItems = [];
		this._currentJoinedIDs = [];
	}

	/** @return {any} The association manager provider. */
	get manager()
	{
		return this.pict.providers.RecordSetAssociationManager;
	}

	addRoutes(pPictRouter)
	{
		pPictRouter.router.on('/PSRS/:RecordSet/Associate/:Association/:AnchorID', this.handleAssociateRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/Associate/:Association', this.handleAssociateRoute.bind(this));
		return true;
	}

	/**
	 * Route handler — parse the anchor recordset, association, and optional preset anchor id, then paint.
	 * @param {Record<string, any>} pRoutePayload
	 */
	handleAssociateRoute(pRoutePayload)
	{
		if (typeof(pRoutePayload) != 'object')
		{
			throw new Error(`Pict RecordSet Associate route handler called with invalid route payload.`);
		}
		this._anchorRecordSet = pRoutePayload.data.RecordSet;
		this._associationHash = pRoutePayload.data.Association;
		this._anchorID = (pRoutePayload.data.AnchorID !== undefined && pRoutePayload.data.AnchorID !== '') ? pRoutePayload.data.AnchorID : null;
		this._currentItems = [];
		this._currentJoinedIDs = [];

		// Use the recordset's RecordSetBulkAssociations Title (the opt-in label) as the screen title.
		this.options.ScreenTitle = false;
		const tmpRecordSetConfiguration = this.pict.PictSectionRecordSet
			? this.pict.PictSectionRecordSet.recordSetProviderConfigurations[this._anchorRecordSet] : null;
		const tmpBulkConfiguration = (tmpRecordSetConfiguration && Array.isArray(tmpRecordSetConfiguration.RecordSetBulkAssociations))
			? tmpRecordSetConfiguration.RecordSetBulkAssociations.find((pEntry) => pEntry.Association === this._associationHash) : null;
		if (tmpBulkConfiguration && tmpBulkConfiguration.Title)
		{
			this.options.ScreenTitle = tmpBulkConfiguration.Title;
		}

		return this.renderScreen();
	}

	/** A DOM/address-safe key for this screen's pickers. */
	get safeKey()
	{
		return `${String(this._anchorRecordSet)}_${String(this._associationHash)}`.replace(/[^A-Za-z0-9]/g, '_');
	}

	/**
	 * Load the current associations (when an anchor is selected) and paint the screen, then mount the
	 * anchor + candidate pickers.
	 * @return {Promise<boolean>}
	 */
	async renderScreen()
	{
		const tmpSides = this.manager ? this.manager.resolveSides(this._associationHash, this._anchorRecordSet) : false;
		if (!tmpSides)
		{
			this.pict.log.warn(`AssociateBulk: association [${this._associationHash}] could not be resolved for [${this._anchorRecordSet}].`);
			return false;
		}

		const tmpAnchorLabel = tmpSides.thisSide.Title || tmpSides.thisSide.RecordSet || tmpSides.thisSide.Entity;
		const tmpOtherLabel = tmpSides.otherSide.Title || tmpSides.otherSide.RecordSet || tmpSides.otherSide.Entity;
		const tmpHasAnchor = (this._anchorID !== undefined && this._anchorID !== null && this._anchorID !== '');

		let tmpItems = [];
		if (tmpHasAnchor)
		{
			tmpItems = await this.manager.listAssociatedRecords(this._associationHash, this._anchorRecordSet, this._anchorID);
		}
		this._currentItems = tmpItems;
		this._currentJoinedIDs = tmpItems.map((pItem) => pItem.OtherID);

		const tmpBodyData = {
			AddLabel: `Add ${tmpOtherLabel}`,
			CandidatePickerHostID: `${this.safeKey}_Candidate`,
			AssociateLabel: `Associate selected`,
			ListLabel: `Current ${tmpOtherLabel}`,
			Count: `${tmpItems.length} ${tmpItems.length === 1 ? 'record' : 'records'}`,
			Items: tmpItems,
			// One-or-zero-element slot drives the empty-state line (TS parses inner tags; NE would not).
			EmptySlot: (tmpItems.length === 0) ? [ { EmptyText: `No ${tmpOtherLabel} associated with this ${tmpAnchorLabel} yet.` } ] : [],
		};

		const tmpRecord =
		{
			Title: this.options.ScreenTitle || `Assign ${tmpOtherLabel} to ${tmpAnchorLabel}`,
			Subtitle: `Choose one of the ${tmpAnchorLabel}, then search and add ${tmpOtherLabel}. Already-added ${tmpOtherLabel} are hidden from the search.`,
			AnchorLabel: `${tmpAnchorLabel}`,
			AnchorPickerHostID: `${this.safeKey}_Anchor`,
			PickerMissing: !this.pict.providers['Pict-Section-Picker'],
			HintSlot: tmpHasAnchor ? [] : [ { Hint: `Choose one of the ${tmpAnchorLabel} above to begin.` } ],
			BodySlot: tmpHasAnchor ? [ tmpBodyData ] : [],
		};

		return new Promise((resolve) =>
		{
			this.renderAsync(this.options.DefaultRenderable, this.options.DefaultDestinationAddress, tmpRecord,
				(pError) =>
				{
					if (pError)
					{
						this.pict.log.error(`AssociateBulk: render error.`, pError);
						return resolve(false);
					}
					this._mountAnchorPicker(tmpSides, tmpRecord.AnchorPickerHostID);
					if (tmpHasAnchor)
					{
						this._mountCandidatePicker(tmpSides, tmpBodyData.CandidatePickerHostID);
					}
					this.pict.CSSMap.injectCSS();
					return resolve(true);
				});
		});
	}

	/**
	 * Mount the anchor (this side) picker — single select, preselected to the current anchor.
	 * @param {Record<string, any>} pSides @param {string} pHostID
	 */
	_mountAnchorPicker(pSides, pHostID)
	{
		const tmpPickerProvider = this.pict.providers['Pict-Section-Picker'];
		if (!tmpPickerProvider)
		{
			return;
		}
		const tmpPickerHash = `${this.safeKey}_AnchorPicker`;
		const tmpValueAddress = `AppData.PRSPBulkAnchor.${this.safeKey}`;

		const tmpConfig = this.manager.buildAnchorPickerConfig(this._associationHash, this._anchorRecordSet,
			{
				DestinationAddress: `#${pHostID}`,
				ValueAddress: tmpValueAddress,
				Placeholder: `Search ${pSides.thisSide.Title || pSides.thisSide.RecordSet || pSides.thisSide.Entity}…`,
				OnChange: (pValue) => { this.selectAnchor(pValue); },
			});
		if (!tmpConfig)
		{
			return;
		}
		tmpPickerProvider.createEntityPicker(tmpPickerHash, tmpConfig);
		// setValue (not render) so the picker (re)seeds + resolves the preset anchor's display via
		// ResolveValue — its init-time resolution does not re-run when the instance is reused across
		// re-renders (e.g. the deep-link /Associate/:RecordSet/:Association/:AnchorID route). setValue
		// does not fire OnChange, so there's no selectAnchor loop.
		this.pict.views[tmpPickerHash].setValue((this._anchorID !== undefined && this._anchorID !== null) ? this._anchorID : null);
	}

	/**
	 * Mount the candidate (other side) MULTI picker — culls the currently-associated ids.
	 * @param {Record<string, any>} pSides @param {string} pHostID
	 */
	_mountCandidatePicker(pSides, pHostID)
	{
		const tmpPickerProvider = this.pict.providers['Pict-Section-Picker'];
		if (!tmpPickerProvider)
		{
			return;
		}
		const tmpPickerHash = `${this.safeKey}_CandidatePicker`;
		const tmpValueAddress = `AppData.PRSPBulkStaged.${this.safeKey}`;
		if (!this.pict.AppData.PRSPBulkStaged) { this.pict.AppData.PRSPBulkStaged = {}; }
		this.pict.AppData.PRSPBulkStaged[this.safeKey] = [];

		const tmpConfig = this.manager.buildOtherPickerConfig(this._associationHash, this._anchorRecordSet, () => this._currentJoinedIDs,
			{
				Mode: 'multi',
				DestinationAddress: `#${pHostID}`,
				ValueAddress: tmpValueAddress,
				Placeholder: `Search ${pSides.otherSide.Title || pSides.otherSide.RecordSet || pSides.otherSide.Entity} to add…`,
			});
		if (!tmpConfig)
		{
			return;
		}
		tmpPickerProvider.createEntityPicker(tmpPickerHash, tmpConfig);
		this.pict.views[tmpPickerHash].render();
	}

	/**
	 * The anchor picker's OnChange — switch the anchor and repaint (loads its current associations and
	 * mounts the candidate picker).
	 * @param {string|number} pAnchorID
	 * @return {Promise<void>}
	 */
	async selectAnchor(pAnchorID)
	{
		this._anchorID = (pAnchorID !== undefined && pAnchorID !== '') ? pAnchorID : null;
		await this.renderScreen();
	}

	/**
	 * Create joins for every staged candidate (the "Associate selected" button), then clear + repaint.
	 * @return {Promise<void>}
	 */
	async associateStaged()
	{
		if (this._anchorID === undefined || this._anchorID === null || this._anchorID === '')
		{
			return;
		}
		const tmpStaged = (this.pict.AppData.PRSPBulkStaged && Array.isArray(this.pict.AppData.PRSPBulkStaged[this.safeKey]))
			? this.pict.AppData.PRSPBulkStaged[this.safeKey].slice() : [];
		if (tmpStaged.length < 1)
		{
			this._toast('Select one or more records to associate first.', 'info');
			return;
		}
		let tmpFailures = 0;
		for (let i = 0; i < tmpStaged.length; i++)
		{
			try
			{
				await this.manager.createJoin(this._associationHash, this._anchorRecordSet, this._anchorID, tmpStaged[i]);
			}
			catch (pError)
			{
				tmpFailures++;
				this.pict.log.error(`AssociateBulk: failed to create join for ${tmpStaged[i]}.`, pError);
			}
		}
		const tmpCreated = tmpStaged.length - tmpFailures;
		if (tmpCreated > 0)
		{
			this._toast(`Associated ${tmpCreated} ${tmpCreated === 1 ? 'record' : 'records'}.`, 'success');
		}
		if (tmpFailures > 0)
		{
			this._toast(`${tmpFailures} association(s) could not be created.`, 'error');
		}
		await this.renderScreen();
	}

	/**
	 * Remove one current association (a row's remove button) — confirm, delete, repaint.
	 * @param {string|number} pJoinID
	 * @return {Promise<void>}
	 */
	async removeItem(pJoinID)
	{
		const tmpItem = this._currentItems.find((pItem) => String(pItem.JoinID) === String(pJoinID));
		if (!tmpItem)
		{
			return;
		}
		const fRemove = async () =>
		{
			try
			{
				await this.manager.removeJoin(this._associationHash, tmpItem.JoinRecord);
			}
			catch (pError)
			{
				this.pict.log.error(`AssociateBulk: failed to remove association.`, pError);
				this._toast('Could not remove the association.', 'error');
				return;
			}
			await this.renderScreen();
		};

		const tmpModal = this.pict.views['Pict-Section-Modal'];
		if (tmpModal && typeof tmpModal.confirm === 'function')
		{
			const tmpOk = await tmpModal.confirm(`Remove the association with "${tmpItem.Display}"?`,
				{ title: 'Remove association', confirmLabel: 'Remove', cancelLabel: 'Cancel', dangerous: true });
			if (!tmpOk)
			{
				return;
			}
		}
		return fRemove();
	}

	/**
	 * Non-blocking notification via the host modal's toast, when available.
	 * @param {string} pMessage @param {string} pType
	 */
	_toast(pMessage, pType)
	{
		const tmpModal = this.pict.views['Pict-Section-Modal'];
		if (tmpModal && typeof tmpModal.toast === 'function')
		{
			tmpModal.toast(pMessage, { type: pType || 'info' });
		}
	}
}

module.exports = viewRecordSetAssociateBulk;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_AssociateBulk;
