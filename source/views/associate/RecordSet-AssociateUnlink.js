const libPictView = require('pict-view');

/**
 * The Bulk Unlink screen — the removal counterpart to Assign/Matrix. Pick one anchor record (a specific
 * book OR a specific store), see ALL of its current associations in a selectable record table
 * (configurable columns + a column chooser + search), check the ones to drop, and "Unlink selected"
 * deletes those join rows at once. The anchor side is the route's `:AnchorRecordSet`, so the same screen
 * unlinks from either side.
 *
 * Registered ONCE by the metacontroller as `RSP-RecordSet-AssociateUnlink` and parameterized by route:
 *   /PSRS/AssociateUnlink/:Association/:AnchorRecordSet
 *   /PSRS/AssociateUnlink/:Association/:AnchorRecordSet/:AnchorID
 *
 * Data flows through the shared `RecordSetAssociationManager` (listAssociatedRecords + removeJoin);
 * column visibility persists through the `ColumnDataProvider` (the same host-overridable seam).
 */

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_AssociateUnlink = (
	{
		ViewIdentifier: 'PRSP-AssociateUnlink',

		DefaultRenderable: 'PRSP_Renderable_AssociateUnlink',
		DefaultDestinationAddress: '#PRSP_Container',
		DefaultTemplateRecordAddress: false,

		AutoInitialize: false,
		AutoInitializeOrdinal: 0,
		AutoRender: false,
		AutoRenderOrdinal: 0,
		AutoSolveWithApp: false,
		AutoSolveOrdinal: 0,

		CSS: /*css*/`
		.prsp-unlink { display: flex; flex-direction: column; gap: 1rem; padding: 0.25rem 0 1rem; }
		.prsp-unlink-header h2 { margin: 0 0 0.2rem; font-size: 1.25rem; color: var(--theme-color-text-primary, #1f2733); }
		.prsp-unlink-sub { margin: 0; color: var(--theme-color-text-muted, #6b7686); font-size: 0.92rem; }
		.prsp-unlink-card { border: 1px solid var(--theme-color-border-light, #e8ebf0); border-radius: 12px; padding: 0.8rem 0.9rem; background: var(--theme-color-background-primary, #fff); display: flex; flex-direction: column; gap: 0.6rem; }
		.prsp-unlink-card-label { font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.05em; color: var(--theme-color-text-muted, #6b7686); }
		.prsp-unlink-anchor-host { max-width: 520px; }
		.prsp-unlink-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
			border: 1px solid var(--theme-color-border-light, #e8ebf0); border-radius: 12px; padding: 0.7rem 1rem; background: var(--theme-color-background-secondary, #f7f8fa); }
		.prsp-unlink-stats { font-size: 0.95rem; color: var(--theme-color-text-secondary, #45505f); }
		.prsp-unlink-stats strong { color: var(--theme-color-status-error, #b62828); font-size: 1.05rem; }
		.prsp-unlink-btn { display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; font: inherit; font-size: 0.92rem; font-weight: 600;
			padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--theme-color-status-error, #b62828);
			background: var(--theme-color-status-error, #b62828); color: #fff; }
		.prsp-unlink-btn:hover { background: var(--theme-color-status-error-hover, #9c2020); }
		.prsp-unlink-btn[disabled] { opacity: 0.5; cursor: not-allowed; }
		.prsp-unlink-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; flex-wrap: wrap; }
		.prsp-unlink-search { flex: 1 1 220px; display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.6rem; border: 1px solid var(--theme-color-border-default, #d7dce3); border-radius: 8px; }
		.prsp-unlink-search-ic { display: inline-flex; color: var(--theme-color-text-muted, #6b7686); font-size: 0.9rem; }
		.prsp-unlink-search input { flex: 1 1 auto; min-width: 0; font: inherit; font-size: 0.9rem; border: none; outline: none; background: transparent; color: var(--theme-color-text-primary, #1f2733); }
		.prsp-unlink-tools { display: flex; align-items: center; gap: 0.6rem; }
		.prsp-unlink-colbtn { display: inline-flex; align-items: center; gap: 0.3rem; cursor: pointer; font: inherit; font-size: 0.78rem; padding: 0.2rem 0.5rem;
			border: 1px solid var(--theme-color-border-default, #d7dce3); border-radius: 6px; background: var(--theme-color-background-panel, #fff); color: var(--theme-color-text-secondary, #45505f); }
		.prsp-unlink-colbtn:hover { background: var(--theme-color-background-tertiary, #eceef2); color: var(--theme-color-text-primary, #1f2733); }
		.prsp-unlink-colchooser-wrap { position: relative; }
		.prsp-unlink-colchooser-backdrop { position: fixed; inset: 0; z-index: 30; display: none; }
		.prsp-unlink-colchooser-wrap.is-open .prsp-unlink-colchooser-backdrop { display: block; }
		.prsp-unlink-colchooser { position: absolute; right: 0; top: 0.3rem; z-index: 40; min-width: 200px; display: none;
			background: var(--theme-color-background-panel, #fff); border: 1px solid var(--theme-color-border-default, #d7dce3); border-radius: 10px; box-shadow: 0 10px 28px rgba(17, 24, 39, 0.14); overflow: hidden; }
		.prsp-unlink-colchooser-wrap.is-open .prsp-unlink-colchooser { display: block; }
		.prsp-unlink-colchooser-list { max-height: 50vh; overflow-y: auto; padding: 0.25rem; }
		.prsp-unlink-colrow { display: flex; align-items: center; gap: 0.5rem; width: 100%; text-align: left; cursor: pointer; font: inherit; font-size: 0.86rem;
			padding: 0.4rem 0.55rem; border: none; border-radius: 6px; background: transparent; color: var(--theme-color-text-primary, #1f2733); }
		.prsp-unlink-colrow:hover { background: var(--theme-color-background-tertiary, #eceef2); }
		.prsp-unlink-colrow-check { flex: 0 0 auto; display: inline-flex; width: 1em; color: var(--theme-color-brand-primary, #156dd1); visibility: hidden; }
		.prsp-unlink-colrow.is-on .prsp-unlink-colrow-check { visibility: visible; }
		.prsp-unlink-colchooser-foot { display: flex; justify-content: flex-end; padding: 0.35rem 0.5rem; border-top: 1px solid var(--theme-color-border-light, #e8ebf0); }
		.prsp-unlink-colreset { font: inherit; font-size: 0.8rem; cursor: pointer; border: none; background: transparent; color: var(--theme-color-text-muted, #6b7686); padding: 0.15rem 0.3rem; border-radius: 5px; }
		.prsp-unlink-tablewrap { max-height: 56vh; overflow: auto; border: 1px solid var(--theme-color-border-light, #e8ebf0); border-radius: 8px; }
		.prsp-utbl { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
		.prsp-utbl thead th { position: sticky; top: 0; z-index: 1; text-align: left; padding: 0.5rem 0.6rem; background: var(--theme-color-background-tertiary, #eceef2);
			color: var(--theme-color-text-secondary, #45505f); font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap; }
		.prsp-utbl-th-check { width: 1.8rem; text-align: center; cursor: pointer; }
		.prsp-utbl-row { cursor: pointer; border-top: 1px solid var(--theme-color-border-light, #e8ebf0); }
		.prsp-utbl-row:hover { background: var(--theme-color-background-tertiary, #eceef2); }
		.prsp-utbl-row.is-selected { background: color-mix(in srgb, var(--theme-color-status-error, #b62828) 9%, transparent); }
		.prsp-utbl-row td { padding: 0.4rem 0.6rem; color: var(--theme-color-text-primary, #1f2733); max-width: 22rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
		.prsp-utbl-td-check { width: 1.8rem; text-align: center; }
		.prsp-utbl-check { display: inline-flex; color: var(--theme-color-status-error, #b62828); visibility: hidden; }
		.prsp-utbl-row.is-selected .prsp-utbl-check { visibility: visible; }
		.prsp-utbl-headcheck { display: inline-flex; color: var(--theme-color-text-muted, #6b7686); }
		.prsp-unlink-empty { padding: 0.9rem; color: var(--theme-color-text-muted, #6b7686); font-size: 0.9rem; font-style: italic; text-align: center; }
		.prsp-unlink-hint { color: var(--theme-color-text-muted, #6b7686); font-size: 0.92rem; font-style: italic; padding: 0.5rem 0.2rem; }
		.prsp-unlink-note { color: var(--theme-color-status-error, #b62828); font-size: 0.86rem; }
		`,
		CSSPriority: 500,

		Templates:
		[
			{
				Hash: 'PRSP-AssociateUnlink-Template',
				Template: /*html*/`
		<!-- DefaultPackage pict view template: [PRSP-AssociateUnlink-Template] -->
		<div class="prsp-unlink">
			<div class="prsp-unlink-header">
				<h2>{~D:Record.Title~}</h2>
				<p class="prsp-unlink-sub">{~D:Record.Subtitle~}</p>
			</div>
			<div class="prsp-unlink-card">
				<span class="prsp-unlink-card-label">{~D:Record.AnchorLabel~}</span>
				<div class="prsp-unlink-anchor-host" id="{~D:Record.AnchorPickerHostID~}"></div>
				{~NE:Record.PickerMissing^<div class="prsp-unlink-note">The entity picker (pict-section-picker) is not registered, so this screen cannot run.</div>~}
			</div>
			{~TS:PRSP-AssociateUnlink-Hint:Record.HintSlot~}
			{~TS:PRSP-AssociateUnlink-Body:Record.BodySlot~}
		</div>
		<!-- DefaultPackage end view template:  [PRSP-AssociateUnlink-Template] -->
	`
			},
			{
				Hash: 'PRSP-AssociateUnlink-Hint',
				Template: /*html*/`<div class="prsp-unlink-hint">{~D:Record.Hint~}</div>`
			},
			{
				Hash: 'PRSP-AssociateUnlink-Body',
				Template: /*html*/`
		<div class="prsp-unlink-bar">
			<div class="prsp-unlink-stats" id="{~D:Record.StatsID~}"></div>
			<button type="button" class="prsp-unlink-btn" id="{~D:Record.UnlinkButtonID~}" onclick="_Pict.views['RSP-RecordSet-AssociateUnlink'].unlinkSelected()">{~I:Trash~} Unlink selected</button>
		</div>
		<div class="prsp-unlink-card">
			<div class="prsp-unlink-toolbar">
				<div class="prsp-unlink-search">
					<span class="prsp-unlink-search-ic">{~I:Search~}</span>
					<input type="text" placeholder="Filter {~D:Record.OtherLabel~}…" autocomplete="off" oninput="_Pict.views['RSP-RecordSet-AssociateUnlink'].searchItems(this.value)">
				</div>
				<div class="prsp-unlink-tools">
					<div class="prsp-unlink-colchooser-wrap" id="{~D:Record.ChooserID~}_Wrap">
						<button type="button" class="prsp-unlink-colbtn" title="Choose columns" onclick="_Pict.views['RSP-RecordSet-AssociateUnlink'].toggleColumnChooser()">{~I:Settings~} Columns</button>
						<div class="prsp-unlink-colchooser-backdrop" onclick="_Pict.views['RSP-RecordSet-AssociateUnlink'].closeColumnChooser()"></div>
						<div class="prsp-unlink-colchooser" id="{~D:Record.ChooserID~}"></div>
					</div>
				</div>
			</div>
			<div class="prsp-unlink-tablewrap"><div id="{~D:Record.TableID~}"></div></div>
		</div>
	`
			},
			{
				Hash: 'PRSP-AssociateUnlink-Table',
				Template: /*html*/`
		<table class="prsp-utbl">
			<thead><tr><th class="prsp-utbl-th-check" title="Select all" onclick="_Pict.views['RSP-RecordSet-AssociateUnlink'].toggleSelectAll()"><span class="prsp-utbl-headcheck">{~D:Record.SelectAllIcon~}</span></th>{~TS:PRSP-AssociateUnlink-HeaderCell:Record.Columns~}</tr></thead>
			<tbody>{~TS:PRSP-AssociateUnlink-Row:Record.Rows~}</tbody>
		</table>
		{~TS:PRSP-AssociateUnlink-Empty:Record.EmptySlot~}
	`
			},
			{
				Hash: 'PRSP-AssociateUnlink-HeaderCell',
				Template: /*html*/`<th>{~D:Record.DisplayName~}</th>`
			},
			{
				Hash: 'PRSP-AssociateUnlink-Row',
				Template: /*html*/`<tr id="{~D:Record.RowID~}" class="prsp-utbl-row{~NE:Record.Selected^ is-selected~}" onclick="_Pict.views['RSP-RecordSet-AssociateUnlink'].toggleRow('{~D:Record.JoinID~}')"><td class="prsp-utbl-td-check"><span class="prsp-utbl-check">{~I:Check~}</span></td>{~TS:PRSP-AssociateUnlink-Cell:Record.Cells~}</tr>`
			},
			{
				Hash: 'PRSP-AssociateUnlink-Cell',
				Template: /*html*/`<td title="{~D:Record.Value~}">{~D:Record.Value~}</td>`
			},
			{
				Hash: 'PRSP-AssociateUnlink-Empty',
				Template: /*html*/`<div class="prsp-unlink-empty">{~D:Record.EmptyText~}</div>`
			},
			{
				Hash: 'PRSP-AssociateUnlink-Chooser',
				Template: /*html*/`
		<div class="prsp-unlink-colchooser-list">{~TS:PRSP-AssociateUnlink-ColRow:Record.Rows~}</div>
		<div class="prsp-unlink-colchooser-foot"><button type="button" class="prsp-unlink-colreset" onclick="_Pict.views['RSP-RecordSet-AssociateUnlink'].resetColumns()">Reset to defaults</button></div>
	`
			},
			{
				Hash: 'PRSP-AssociateUnlink-ColRow',
				Template: /*html*/`<button type="button" class="prsp-unlink-colrow{~NE:Record.Visible^ is-on~}" onclick="_Pict.views['RSP-RecordSet-AssociateUnlink'].toggleColumn('{~D:Record.Key~}')"><span class="prsp-unlink-colrow-check">{~I:Check~}</span><span>{~D:Record.DisplayName~}</span></button>`
			}
		],

		Renderables:
		[
			{
				RenderableHash: 'PRSP_Renderable_AssociateUnlink',
				TemplateHash: 'PRSP-AssociateUnlink-Template',
				ContentDestinationAddress: '#PRSP_Container',
				RenderMethod: 'replace'
			}
		],

		Manifests: {}
	});

class viewRecordSetAssociateUnlink extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_AssociateUnlink, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		/** @type {import('pict') & { PictSectionRecordSet: any }} */
		this.pict;

		this._associationHash = null;
		this._anchorSide = null;
		this._otherSide = null;
		this._anchorID = null;
		this._items = [];           // current associations: { JoinID, OtherID, Display, OtherRecord, JoinRecord, Chips }
		this._selected = {};        // selected JoinIDs to remove
		this._search = '';
	}

	/** @return {any} The association manager provider. */
	get manager()
	{
		return this.pict.providers.RecordSetAssociationManager;
	}

	/** @return {any} The column-visibility persistence provider (localStorage; host-overridable). */
	get columnProvider()
	{
		return this.pict.providers.ColumnDataProvider;
	}

	/** A DOM/address-safe key for this screen. */
	get safeKey()
	{
		return `${String(this._associationHash)}_${String(this._anchorSide && this._anchorSide.RecordSet)}`.replace(/[^A-Za-z0-9]/g, '_');
	}

	addRoutes(pPictRouter)
	{
		pPictRouter.router.on('/PSRS/AssociateUnlink/:Association/:AnchorRecordSet/:AnchorID', this.handleUnlinkRoute.bind(this));
		pPictRouter.router.on('/PSRS/AssociateUnlink/:Association/:AnchorRecordSet', this.handleUnlinkRoute.bind(this));
		return true;
	}

	/**
	 * Route handler — resolve the association + anchor side, then paint.
	 * @param {Record<string, any>} pRoutePayload
	 */
	handleUnlinkRoute(pRoutePayload)
	{
		if (typeof(pRoutePayload) != 'object')
		{
			throw new Error(`Pict RecordSet AssociateUnlink route handler called with invalid route payload.`);
		}
		this._associationHash = pRoutePayload.data.Association;
		this._items = [];
		this._selected = {};
		this._search = '';
		const tmpAssociation = this.manager ? this.manager.getAssociation(this._associationHash) : null;
		if (!tmpAssociation)
		{
			this.pict.log.warn(`AssociateUnlink: association [${this._associationHash}] is not registered.`);
			this._anchorSide = null;
			this._otherSide = null;
			return this.renderUnlink();
		}
		const tmpAnchorRecordSet = pRoutePayload.data.AnchorRecordSet || tmpAssociation.SideA.RecordSet;
		const tmpSides = this.manager.resolveSides(this._associationHash, tmpAnchorRecordSet);
		this._anchorSide = tmpSides ? tmpSides.thisSide : tmpAssociation.SideA;
		this._otherSide = tmpSides ? tmpSides.otherSide : tmpAssociation.SideB;
		this._anchorID = (pRoutePayload.data.AnchorID !== undefined && pRoutePayload.data.AnchorID !== '') ? pRoutePayload.data.AnchorID : null;
		return this.renderUnlink();
	}

	/** @return {string} */
	_anchorLabel() { return this._anchorSide ? (this._anchorSide.Title || this._anchorSide.RecordSet || this._anchorSide.Entity) : ''; }
	/** @return {string} */
	_otherLabel() { return this._otherSide ? (this._otherSide.Title || this._otherSide.RecordSet || this._otherSide.Entity) : ''; }

	/** Persistence scope for this anchor side's column visibility (distinct from list/matrix scopes). */
	_columnScope() { return `Unlink_${this._associationHash}_${this._anchorSide && this._anchorSide.RecordSet}`; }

	/**
	 * Paint the screen shell and mount the anchor picker; load + render the table when an anchor is set.
	 * @return {Promise<boolean>}
	 */
	async renderUnlink()
	{
		if (!this._anchorSide || !this._otherSide)
		{
			this.pict.log.warn(`AssociateUnlink: could not resolve sides for [${this._associationHash}].`);
			return false;
		}
		const tmpHasAnchor = (this._anchorID !== undefined && this._anchorID !== null && this._anchorID !== '');
		if (tmpHasAnchor)
		{
			this._items = await this.manager.listAssociatedRecords(this._associationHash, this._anchorSide.RecordSet, this._anchorID);
		}

		const tmpBodyData = {
			OtherLabel: this._otherLabel(),
			StatsID: `${this.safeKey}_Stats`,
			UnlinkButtonID: `${this.safeKey}_Unlink`,
			ChooserID: `${this.safeKey}_Chooser`,
			TableID: `${this.safeKey}_Table`,
		};
		const tmpRecord = {
			Title: this.options.ScreenTitle || `Unlink ${this._otherLabel()} from a ${this._singular(this._anchorLabel())}`,
			Subtitle: `Pick a ${this._singular(this._anchorLabel())}, then check the ${this._otherLabel()} to unlink and remove them together.`,
			AnchorLabel: this._anchorLabel(),
			AnchorPickerHostID: `${this.safeKey}_Anchor`,
			PickerMissing: !this.pict.providers['Pict-Section-Picker'],
			HintSlot: tmpHasAnchor ? [] : [ { Hint: `Select a ${this._singular(this._anchorLabel())} above to see its current links.` } ],
			BodySlot: tmpHasAnchor ? [ tmpBodyData ] : [],
		};

		return new Promise((resolve) =>
		{
			this.renderAsync(this.options.DefaultRenderable, this.options.DefaultDestinationAddress, tmpRecord,
				(pError) =>
				{
					if (pError)
					{
						this.pict.log.error(`AssociateUnlink: render error.`, pError);
						return resolve(false);
					}
					this._mountAnchorPicker(tmpRecord.AnchorPickerHostID);
					if (tmpHasAnchor)
					{
						this._renderTable();
						this.updateStats();
					}
					this.pict.CSSMap.injectCSS();
					return resolve(true);
				});
		});
	}

	/** Mount the anchor (this side) picker — single select, preselected to the current anchor. */
	_mountAnchorPicker(pHostID)
	{
		const tmpPickerProvider = this.pict.providers['Pict-Section-Picker'];
		if (!tmpPickerProvider)
		{
			return;
		}
		const tmpPickerHash = `${this.safeKey}_AnchorPicker`;
		const tmpValueAddress = `AppData.PRSPUnlinkAnchor.${this.safeKey}`;
		if (!this.pict.AppData.PRSPUnlinkAnchor) { this.pict.AppData.PRSPUnlinkAnchor = {}; }
		this.pict.AppData.PRSPUnlinkAnchor[this.safeKey] = (this._anchorID !== undefined && this._anchorID !== null) ? this._anchorID : null;

		const tmpConfig = this.manager.buildAnchorPickerConfig(this._associationHash, this._anchorSide.RecordSet,
			{
				DestinationAddress: `#${pHostID}`,
				ValueAddress: tmpValueAddress,
				Placeholder: `Search ${this._anchorLabel()}…`,
				OnChange: (pValue) => { this.selectAnchor(pValue); },
			});
		if (!tmpConfig)
		{
			return;
		}
		tmpPickerProvider.createEntityPicker(tmpPickerHash, tmpConfig);
		this.pict.views[tmpPickerHash].setValue((this._anchorID !== undefined && this._anchorID !== null) ? this._anchorID : null);
	}

	/**
	 * The anchor picker's OnChange — load that anchor's links and repaint.
	 * @param {string|number} pAnchorID @return {Promise<void>}
	 */
	async selectAnchor(pAnchorID)
	{
		this._anchorID = (pAnchorID !== undefined && pAnchorID !== '') ? pAnchorID : null;
		this._selected = {};
		this._search = '';
		await this.renderUnlink();
	}

	/** Effective visibility for a column (stored override wins, else `!DefaultHidden`). */
	_isColumnVisible(pCol)
	{
		const tmpOverrides = this.columnProvider ? this.columnProvider.getColumnVisibilityOverrides(this._columnScope(), 'Unlink') : {};
		if (tmpOverrides && Object.prototype.hasOwnProperty.call(tmpOverrides, pCol.Key))
		{
			return tmpOverrides[pCol.Key] === true;
		}
		return !pCol.DefaultHidden;
	}

	/** @return {Array<Record<string, any>>} The currently-visible other-side columns. */
	_visibleColumns()
	{
		return this._otherSide.TableColumns.filter((pCol) => this._isColumnVisible(pCol));
	}

	/** @return {Array<Record<string, any>>} The items matching the current search filter (client-side). */
	_filteredItems()
	{
		const tmpTerm = (this._search || '').trim().toLowerCase();
		if (!tmpTerm)
		{
			return this._items;
		}
		const tmpColumns = this._visibleColumns();
		return this._items.filter((pItem) =>
		{
			if (String(pItem.Display).toLowerCase().includes(tmpTerm)) { return true; }
			return tmpColumns.some((pCol) =>
			{
				const tmpValue = pCol.Template ? this.pict.parseTemplate(pCol.Template, pItem.OtherRecord) : pItem.OtherRecord[pCol.Key];
				return (tmpValue !== undefined && tmpValue !== null) && String(tmpValue).toLowerCase().includes(tmpTerm);
			});
		});
	}

	/** Build the row models for the (filtered) current associations and render the table. */
	_renderTable()
	{
		const tmpColumns = this._visibleColumns();
		const tmpItems = this._filteredItems();
		const tmpRows = tmpItems.map((pItem) => (
			{
				JoinID: pItem.JoinID,
				RowID: `${this.safeKey}_row_${pItem.JoinID}`,
				Selected: !!this._selected[String(pItem.JoinID)],
				Cells: tmpColumns.map((pCol) => ({ Value: pCol.Template ? this.pict.parseTemplate(pCol.Template, pItem.OtherRecord) : pItem.OtherRecord[pCol.Key] })),
			}));
		const tmpAllSelected = (tmpRows.length > 0 && tmpRows.every((pRow) => pRow.Selected));
		const tmpTableRecord = {
			Columns: tmpColumns.map((pCol) => ({ DisplayName: pCol.DisplayName })),
			Rows: tmpRows,
			SelectAllIcon: this.pict.icon(tmpAllSelected ? 'Check' : 'Minus'),
			EmptySlot: (tmpRows.length === 0) ? [ { EmptyText: this._search ? `No ${this._otherLabel()} match the filter.` : `This ${this._singular(this._anchorLabel())} has no ${this._otherLabel()} linked.` } ] : [],
		};
		const tmpHTML = this.pict.parseTemplateByHash('PRSP-AssociateUnlink-Table', tmpTableRecord);
		this.pict.ContentAssignment.assignContent(`#${this.safeKey}_Table`, tmpHTML);
	}

	/** Debounced client-side filter of the loaded links. @param {string} pTerm */
	searchItems(pTerm)
	{
		this._search = pTerm;
		this._renderTable();
		this.updateStats();
	}

	/**
	 * Toggle a link's selection (the row click). Updates the set + row state + stats.
	 * @param {string|number} pJoinID
	 */
	toggleRow(pJoinID)
	{
		const tmpKey = String(pJoinID);
		if (this._selected[tmpKey]) { delete this._selected[tmpKey]; }
		else { this._selected[tmpKey] = true; }
		const tmpRowElements = this.pict.ContentAssignment.getElement(`#${this.safeKey}_row_${pJoinID}`);
		if (tmpRowElements && tmpRowElements.length > 0)
		{
			tmpRowElements[0].classList.toggle('is-selected', !!this._selected[tmpKey]);
		}
		this.updateStats();
	}

	/** Select-all / clear-all the currently-filtered rows (the header checkbox). */
	toggleSelectAll()
	{
		const tmpFiltered = this._filteredItems();
		const tmpAllSelected = (tmpFiltered.length > 0 && tmpFiltered.every((pItem) => this._selected[String(pItem.JoinID)]));
		this._selected = {};
		if (!tmpAllSelected)
		{
			for (let i = 0; i < tmpFiltered.length; i++) { this._selected[String(tmpFiltered[i].JoinID)] = true; }
		}
		this._renderTable();
		this.updateStats();
	}

	/** @return {number} */
	_selectedCount() { return Object.keys(this._selected).length; }

	/** Recompute the stats line + the unlink button's enabled state. */
	updateStats()
	{
		const tmpSelected = this._selectedCount();
		const tmpTotal = this._items.length;
		this.pict.ContentAssignment.assignContent(`#${this.safeKey}_Stats`,
			`<strong>${tmpSelected}</strong> of ${tmpTotal} ${this._otherLabel()} selected to unlink`);
		const tmpButtonElements = this.pict.ContentAssignment.getElement(`#${this.safeKey}_Unlink`);
		if (tmpButtonElements && tmpButtonElements.length > 0)
		{
			tmpButtonElements[0].disabled = (tmpSelected < 1);
		}
	}

	/**
	 * Remove every selected link (confirm via the host modal), then reload the anchor's links + repaint.
	 * @return {Promise<void>}
	 */
	async unlinkSelected()
	{
		const tmpSelectedJoinIDs = Object.keys(this._selected);
		if (tmpSelectedJoinIDs.length < 1)
		{
			return;
		}
		const tmpItemsByJoin = {};
		for (let i = 0; i < this._items.length; i++) { tmpItemsByJoin[String(this._items[i].JoinID)] = this._items[i]; }

		const tmpModal = this.pict.views['Pict-Section-Modal'];
		if (tmpModal && typeof tmpModal.confirm === 'function')
		{
			const tmpOk = await tmpModal.confirm(`Unlink ${tmpSelectedJoinIDs.length} ${this._otherLabel()} from this ${this._singular(this._anchorLabel())}?`,
				{ title: 'Unlink', confirmLabel: `Unlink ${tmpSelectedJoinIDs.length}`, cancelLabel: 'Cancel', dangerous: true });
			if (!tmpOk)
			{
				return;
			}
		}

		let tmpRemoved = 0;
		let tmpFailed = 0;
		for (let i = 0; i < tmpSelectedJoinIDs.length; i++)
		{
			const tmpItem = tmpItemsByJoin[tmpSelectedJoinIDs[i]];
			if (!tmpItem) { continue; }
			try
			{
				await this.manager.removeJoin(this._associationHash, tmpItem.JoinRecord);
				tmpRemoved++;
			}
			catch (pError)
			{
				tmpFailed++;
				this.pict.log.error(`AssociateUnlink: failed to remove join ${tmpItem.JoinID}.`, pError);
			}
		}
		this._toast(`${tmpRemoved} unlinked${tmpFailed > 0 ? `, ${tmpFailed} failed` : ''}.`, tmpFailed > 0 ? 'error' : 'success');

		this._selected = {};
		await this.renderUnlink();
	}

	// --- Column chooser (mirrors the matrix's, scoped per anchor side) ---

	/** Open/close the column chooser. */
	toggleColumnChooser()
	{
		const tmpWrapElements = this.pict.ContentAssignment.getElement(`#${this.safeKey}_Chooser_Wrap`);
		if (!tmpWrapElements || tmpWrapElements.length < 1) { return; }
		if (tmpWrapElements[0].classList.contains('is-open'))
		{
			tmpWrapElements[0].classList.remove('is-open');
			return;
		}
		this._renderColumnChooser();
		tmpWrapElements[0].classList.add('is-open');
	}

	/** Close the column chooser (backdrop outside-click). */
	closeColumnChooser()
	{
		const tmpWrapElements = this.pict.ContentAssignment.getElement(`#${this.safeKey}_Chooser_Wrap`);
		if (tmpWrapElements && tmpWrapElements.length > 0)
		{
			tmpWrapElements[0].classList.remove('is-open');
		}
	}

	/** Render the chooser rows. */
	_renderColumnChooser()
	{
		const tmpRows = this._otherSide.TableColumns.map((pCol) => ({ Key: pCol.Key, DisplayName: pCol.DisplayName, Visible: this._isColumnVisible(pCol) }));
		const tmpHTML = this.pict.parseTemplateByHash('PRSP-AssociateUnlink-Chooser', { Rows: tmpRows });
		this.pict.ContentAssignment.assignContent(`#${this.safeKey}_Chooser`, tmpHTML);
	}

	/** Toggle one column's visibility (persisted; refuses to hide the last visible column). @param {string} pKey */
	toggleColumn(pKey)
	{
		if (!this.columnProvider) { return; }
		const tmpCol = this._otherSide.TableColumns.find((pCol) => String(pCol.Key) === String(pKey));
		if (!tmpCol) { return; }
		const tmpVisible = this._isColumnVisible(tmpCol);
		if (tmpVisible && this._visibleColumns().length <= 1) { return; }
		this.columnProvider.setColumnVisibilityOverride(this._columnScope(), 'Unlink', pKey, !tmpVisible);
		this._renderTable();
		this._renderColumnChooser();
	}

	/** Clear column overrides — back to developer defaults. */
	resetColumns()
	{
		if (this.columnProvider) { this.columnProvider.clearColumnVisibilityOverrides(this._columnScope(), 'Unlink'); }
		this._renderTable();
		this._renderColumnChooser();
	}

	/** Crude singularizer ("Books" -> "Book"). */
	_singular(pLabel)
	{
		return (typeof pLabel === 'string' && pLabel.length > 1 && pLabel.slice(-1).toLowerCase() === 's') ? pLabel.slice(0, -1) : pLabel;
	}

	/** Non-blocking notification via the host modal's toast, when available. */
	_toast(pMessage, pType)
	{
		const tmpModal = this.pict.views['Pict-Section-Modal'];
		if (tmpModal && typeof tmpModal.toast === 'function')
		{
			tmpModal.toast(pMessage, { type: pType || 'info' });
		}
	}
}

module.exports = viewRecordSetAssociateUnlink;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_AssociateUnlink;
