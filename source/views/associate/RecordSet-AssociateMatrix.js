const libPictView = require('pict-view');

/**
 * The Matrix Associate screen — a dual-TABLE bulk-link tool for one association. Unlike the chip-picker
 * screens, each side is a full record table with configurable columns (per-side `TableColumns`) and a
 * checkbox per row — built for connecting complex records (Materials ↔ Pay Items, with several codes
 * and data points on both sides) where a single label can't disambiguate. Multi-select rows on BOTH
 * sides; a live stats line shows the pending count; "Link selected" creates the CROSS-PRODUCT of joins
 * (every left record × every right record), skipping pairs that already exist.
 *
 * Registered ONCE by the metacontroller as `RSP-RecordSet-AssociateMatrix` and parameterized by route:
 *   /PSRS/AssociateMatrix/:Association                 (left = the association's SideA)
 *   /PSRS/AssociateMatrix/:Association/:LeftRecordSet  (left = the named side)
 *
 * Records + columns flow through the shared `RecordSetAssociationManager` (fetchSidePage + TableColumns).
 */

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_AssociateMatrix = (
	{
		ViewIdentifier: 'PRSP-AssociateMatrix',

		DefaultRenderable: 'PRSP_Renderable_AssociateMatrix',
		DefaultDestinationAddress: '#PRSP_Container',
		DefaultTemplateRecordAddress: false,

		AutoInitialize: false,
		AutoInitializeOrdinal: 0,
		AutoRender: false,
		AutoRenderOrdinal: 0,
		AutoSolveWithApp: false,
		AutoSolveOrdinal: 0,

		MatrixPageSize: 25,

		CSS: /*css*/`
		.prsp-matrix { display: flex; flex-direction: column; gap: 1rem; padding: 0.25rem 0 1rem; }
		.prsp-matrix-header h2 { margin: 0 0 0.2rem; font-size: 1.25rem; color: var(--theme-color-text-primary, #1f2733); }
		.prsp-matrix-sub { margin: 0; color: var(--theme-color-text-muted, #6b7686); font-size: 0.92rem; }
		.prsp-matrix-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; position: sticky; top: 0; z-index: 2;
			border: 1px solid var(--theme-color-border-light, #e8ebf0); border-radius: 12px; padding: 0.7rem 1rem; background: var(--theme-color-background-secondary, #f7f8fa); }
		.prsp-matrix-stats { font-size: 0.95rem; color: var(--theme-color-text-secondary, #45505f); }
		.prsp-matrix-stats strong { color: var(--theme-color-brand-primary, #156dd1); font-size: 1.05rem; }
		.prsp-matrix-stats .prsp-matrix-eq { color: var(--theme-color-text-muted, #6b7686); margin: 0 0.15rem; }
		.prsp-matrix-link { display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; font: inherit; font-size: 0.92rem; font-weight: 600;
			padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--theme-color-brand-primary, #156dd1);
			background: var(--theme-color-brand-primary, #156dd1); color: #fff; }
		.prsp-matrix-link:hover { background: var(--theme-color-brand-primary-hover, #1259ad); }
		.prsp-matrix-link[disabled] { opacity: 0.5; cursor: not-allowed; }
		.prsp-matrix-cols { display: flex; gap: 1rem; align-items: flex-start; }
		.prsp-matrix-col { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 0.5rem;
			border: 1px solid var(--theme-color-border-light, #e8ebf0); border-radius: 12px; padding: 0.8rem 0.9rem; background: var(--theme-color-background-primary, #fff); }
		.prsp-matrix-col-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; }
		.prsp-matrix-col-label { font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.05em; color: var(--theme-color-text-muted, #6b7686); }
		.prsp-matrix-col-count { font-size: 0.78rem; color: var(--theme-color-brand-primary, #156dd1); font-weight: 600; }
		.prsp-matrix-col-head-right { display: flex; align-items: center; gap: 0.6rem; }
		.prsp-matrix-colbtn { display: inline-flex; align-items: center; gap: 0.3rem; cursor: pointer; font: inherit; font-size: 0.78rem; padding: 0.2rem 0.5rem;
			border: 1px solid var(--theme-color-border-default, #d7dce3); border-radius: 6px; background: var(--theme-color-background-panel, #fff); color: var(--theme-color-text-secondary, #45505f); }
		.prsp-matrix-colbtn:hover { background: var(--theme-color-background-tertiary, #eceef2); color: var(--theme-color-text-primary, #1f2733); }
		.prsp-matrix-colchooser-wrap { position: relative; }
		/* Transparent full-viewport backdrop catches the outside click to dismiss (no document listener);
		   only present while open, with the popover stacked above it. */
		.prsp-matrix-colchooser-backdrop { position: fixed; inset: 0; z-index: 30; display: none; }
		.prsp-matrix-colchooser-wrap.is-open .prsp-matrix-colchooser-backdrop { display: block; }
		.prsp-matrix-colchooser { position: absolute; right: 0; top: 0.3rem; z-index: 40; min-width: 200px; display: none;
			background: var(--theme-color-background-panel, #fff); border: 1px solid var(--theme-color-border-default, #d7dce3); border-radius: 10px; box-shadow: 0 10px 28px rgba(17, 24, 39, 0.14); overflow: hidden; }
		.prsp-matrix-colchooser-wrap.is-open .prsp-matrix-colchooser { display: block; }
		.prsp-matrix-colchooser-list { max-height: 50vh; overflow-y: auto; padding: 0.25rem; }
		.prsp-matrix-colrow { display: flex; align-items: center; gap: 0.5rem; width: 100%; text-align: left; cursor: pointer; font: inherit; font-size: 0.86rem;
			padding: 0.4rem 0.55rem; border: none; border-radius: 6px; background: transparent; color: var(--theme-color-text-primary, #1f2733); }
		.prsp-matrix-colrow:hover { background: var(--theme-color-background-tertiary, #eceef2); }
		.prsp-matrix-colrow-check { flex: 0 0 auto; display: inline-flex; width: 1em; color: var(--theme-color-brand-primary, #156dd1); visibility: hidden; }
		.prsp-matrix-colrow.is-on .prsp-matrix-colrow-check { visibility: visible; }
		.prsp-matrix-colchooser-foot { display: flex; justify-content: flex-end; padding: 0.35rem 0.5rem; border-top: 1px solid var(--theme-color-border-light, #e8ebf0); }
		.prsp-matrix-colreset { font: inherit; font-size: 0.8rem; cursor: pointer; border: none; background: transparent; color: var(--theme-color-text-muted, #6b7686); padding: 0.15rem 0.3rem; border-radius: 5px; }
		.prsp-matrix-colreset:hover { color: var(--theme-color-text-primary, #1f2733); background: var(--theme-color-background-tertiary, #eceef2); }
		.prsp-matrix-search { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.6rem; border: 1px solid var(--theme-color-border-default, #d7dce3); border-radius: 8px; }
		.prsp-matrix-search-ic { display: inline-flex; color: var(--theme-color-text-muted, #6b7686); font-size: 0.9rem; }
		.prsp-matrix-search input { flex: 1 1 auto; min-width: 0; font: inherit; font-size: 0.9rem; border: none; outline: none; background: transparent; color: var(--theme-color-text-primary, #1f2733); }
		.prsp-matrix-tablewrap { max-height: 56vh; overflow: auto; border: 1px solid var(--theme-color-border-light, #e8ebf0); border-radius: 8px; }
		.prsp-mtbl { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
		.prsp-mtbl thead th { position: sticky; top: 0; z-index: 1; text-align: left; padding: 0.5rem 0.6rem; background: var(--theme-color-background-tertiary, #eceef2);
			color: var(--theme-color-text-secondary, #45505f); font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap; }
		.prsp-mtbl-th-check { width: 1.8rem; }
		.prsp-mtbl-row { cursor: pointer; border-top: 1px solid var(--theme-color-border-light, #e8ebf0); }
		.prsp-mtbl-row:hover { background: var(--theme-color-background-tertiary, #eceef2); }
		.prsp-mtbl-row.is-selected { background: var(--theme-color-background-selected, #e3edfb); }
		.prsp-mtbl-row td { padding: 0.4rem 0.6rem; color: var(--theme-color-text-primary, #1f2733); max-width: 22rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
		.prsp-mtbl-td-check { width: 1.8rem; text-align: center; }
		.prsp-mtbl-check { display: inline-flex; color: var(--theme-color-brand-primary, #156dd1); visibility: hidden; }
		.prsp-mtbl-row.is-selected .prsp-mtbl-check { visibility: visible; }
		.prsp-matrix-empty { padding: 0.8rem; color: var(--theme-color-text-muted, #6b7686); font-size: 0.88rem; font-style: italic; text-align: center; }
		.prsp-matrix-more { display: block; width: 100%; padding: 0.45rem; cursor: pointer; font: inherit; font-size: 0.85rem; border: none; border-top: 1px solid var(--theme-color-border-light, #e8ebf0);
			background: transparent; color: var(--theme-color-brand-primary, #156dd1); }
		.prsp-matrix-more:hover { background: var(--theme-color-background-tertiary, #eceef2); }
		.prsp-matrix-cross { flex: 0 0 auto; display: flex; align-items: center; align-self: center; color: var(--theme-color-text-muted, #6b7686); font-size: 1.4rem; }
		.prsp-matrix-note { color: var(--theme-color-status-error, #b62828); font-size: 0.86rem; }
		@media (max-width: 820px) { .prsp-matrix-cols { flex-direction: column; } .prsp-matrix-cross { align-self: center; transform: rotate(90deg); } }
		`,
		CSSPriority: 500,

		Templates:
		[
			{
				Hash: 'PRSP-AssociateMatrix-Template',
				Template: /*html*/`
		<!-- DefaultPackage pict view template: [PRSP-AssociateMatrix-Template] -->
		<div class="prsp-matrix">
			<div class="prsp-matrix-header">
				<h2>{~D:Record.Title~}</h2>
				<p class="prsp-matrix-sub">{~D:Record.Subtitle~}</p>
			</div>
			<div class="prsp-matrix-bar">
				<div class="prsp-matrix-stats" id="{~D:Record.StatsID~}">{~T:PRSP-AssociateMatrix-Stats:Record~}</div>
				<button type="button" class="prsp-matrix-link" id="{~D:Record.LinkButtonID~}" onclick="_Pict.views['RSP-RecordSet-AssociateMatrix'].associateMatrix()">{~I:Plus~} Link selected</button>
			</div>
			{~NE:Record.PickerMissing^<div class="prsp-matrix-note">The entity provider is not available, so this screen cannot run.</div>~}
			<div class="prsp-matrix-cols">
				{~T:PRSP-AssociateMatrix-Panel:Record.Left~}
				<div class="prsp-matrix-cross">{~I:Plus~}</div>
				{~T:PRSP-AssociateMatrix-Panel:Record.Right~}
			</div>
		</div>
		<!-- DefaultPackage end view template:  [PRSP-AssociateMatrix-Template] -->
	`
			},
			{
				// One side's panel shell: head + search (rendered once) + an empty table container the
				// table sub-render targets, so searching/paging never disturbs the search input's focus.
				Hash: 'PRSP-AssociateMatrix-Panel',
				Template: /*html*/`
		<div class="prsp-matrix-col">
			<div class="prsp-matrix-col-head">
				<span class="prsp-matrix-col-label">{~D:Record.Label~}</span>
				<div class="prsp-matrix-col-head-right">
					<span class="prsp-matrix-col-count" id="{~D:Record.CountID~}"></span>
					<div class="prsp-matrix-colchooser-wrap" id="{~D:Record.ChooserID~}_Wrap">
						<button type="button" class="prsp-matrix-colbtn" title="Choose columns" onclick="_Pict.views['RSP-RecordSet-AssociateMatrix'].toggleColumnChooser('{~D:Record.Column~}')">{~I:Settings~} Columns</button>
						<div class="prsp-matrix-colchooser-backdrop" onclick="_Pict.views['RSP-RecordSet-AssociateMatrix'].closeColumnChooser('{~D:Record.Column~}')"></div>
						<div class="prsp-matrix-colchooser" id="{~D:Record.ChooserID~}"></div>
					</div>
				</div>
			</div>
			<div class="prsp-matrix-search">
				<span class="prsp-matrix-search-ic">{~I:Search~}</span>
				<input type="text" placeholder="Search {~D:Record.Label~}…" autocomplete="off" oninput="_Pict.views['RSP-RecordSet-AssociateMatrix'].searchSide('{~D:Record.Column~}', this.value)">
			</div>
			<div class="prsp-matrix-tablewrap"><div id="{~D:Record.TableID~}"></div></div>
		</div>
	`
			},
			{
				Hash: 'PRSP-AssociateMatrix-Chooser',
				Template: /*html*/`
		<div class="prsp-matrix-colchooser-list">{~TS:PRSP-AssociateMatrix-ColRow:Record.Rows~}</div>
		<div class="prsp-matrix-colchooser-foot"><button type="button" class="prsp-matrix-colreset" onclick="_Pict.views['RSP-RecordSet-AssociateMatrix'].resetColumns('{~D:Record.Column~}')">Reset to defaults</button></div>
	`
			},
			{
				Hash: 'PRSP-AssociateMatrix-ColRow',
				Template: /*html*/`<button type="button" class="prsp-matrix-colrow{~NE:Record.Visible^ is-on~}" onclick="_Pict.views['RSP-RecordSet-AssociateMatrix'].toggleColumn('{~D:Record.Column~}','{~D:Record.Key~}')"><span class="prsp-matrix-colrow-check">{~I:Check~}</span><span>{~D:Record.DisplayName~}</span></button>`
			},
			{
				Hash: 'PRSP-AssociateMatrix-Table',
				Template: /*html*/`
		<table class="prsp-mtbl">
			<thead><tr><th class="prsp-mtbl-th-check"></th>{~TS:PRSP-AssociateMatrix-HeaderCell:Record.Columns~}</tr></thead>
			<tbody>{~TS:PRSP-AssociateMatrix-Row:Record.Rows~}</tbody>
		</table>
		{~TS:PRSP-AssociateMatrix-Empty:Record.EmptySlot~}
		{~TS:PRSP-AssociateMatrix-More:Record.MoreSlot~}
	`
			},
			{
				Hash: 'PRSP-AssociateMatrix-Empty',
				Template: /*html*/`<div class="prsp-matrix-empty">{~D:Record.EmptyText~}</div>`
			},
			{
				Hash: 'PRSP-AssociateMatrix-HeaderCell',
				Template: /*html*/`<th>{~D:Record.DisplayName~}</th>`
			},
			{
				Hash: 'PRSP-AssociateMatrix-Row',
				Template: /*html*/`<tr id="{~D:Record.RowID~}" class="prsp-mtbl-row{~NE:Record.Selected^ is-selected~}" onclick="_Pict.views['RSP-RecordSet-AssociateMatrix'].toggleRow('{~D:Record.Column~}','{~D:Record.Value~}')"><td class="prsp-mtbl-td-check"><span class="prsp-mtbl-check">{~I:Check~}</span></td>{~TS:PRSP-AssociateMatrix-Cell:Record.Cells~}</tr>`
			},
			{
				Hash: 'PRSP-AssociateMatrix-Cell',
				Template: /*html*/`<td title="{~D:Record.Value~}">{~D:Record.Value~}</td>`
			},
			{
				Hash: 'PRSP-AssociateMatrix-More',
				Template: /*html*/`<button type="button" class="prsp-matrix-more" onclick="_Pict.views['RSP-RecordSet-AssociateMatrix'].loadMoreSide('{~D:Record.Column~}')">Load more</button>`
			},
			{
				Hash: 'PRSP-AssociateMatrix-Stats',
				Template: /*html*/`<strong>{~D:Record.LeftCount~}</strong> {~D:Record.LeftLabel~} <span class="prsp-matrix-eq">×</span> <strong>{~D:Record.RightCount~}</strong> {~D:Record.RightLabel~} <span class="prsp-matrix-eq">=</span> <strong>{~D:Record.PairCount~}</strong> link{~D:Record.PairPlural~}`
			}
		],

		Renderables:
		[
			{
				RenderableHash: 'PRSP_Renderable_AssociateMatrix',
				TemplateHash: 'PRSP-AssociateMatrix-Template',
				ContentDestinationAddress: '#PRSP_Container',
				RenderMethod: 'replace'
			}
		],

		Manifests: {}
	});

class viewRecordSetAssociateMatrix extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_AssociateMatrix, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		/** @type {import('pict') & { PictSectionRecordSet: any }} */
		this.pict;

		this._associationHash = null;
		// Per-column state (Left / Right): the resolved side, loaded records, paging, search, selection.
		this._side = { Left: this._blankSide('Left'), Right: this._blankSide('Right') };
		this._searchTimers = { Left: null, Right: null };
	}

	/** @param {'Left'|'Right'} pColumn @return {Record<string, any>} A blank per-side state. */
	_blankSide(pColumn)
	{
		return { Column: pColumn, side: null, records: [], cursor: 0, hasMore: false, search: '', selected: {} };
	}

	/** @return {any} The association manager provider. */
	get manager()
	{
		return this.pict.providers.RecordSetAssociationManager;
	}

	/** A DOM/address-safe key for this screen. */
	get safeKey()
	{
		return `${String(this._associationHash)}`.replace(/[^A-Za-z0-9]/g, '_');
	}

	addRoutes(pPictRouter)
	{
		pPictRouter.router.on('/PSRS/AssociateMatrix/:Association/:LeftRecordSet', this.handleMatrixRoute.bind(this));
		pPictRouter.router.on('/PSRS/AssociateMatrix/:Association', this.handleMatrixRoute.bind(this));
		return true;
	}

	/**
	 * Route handler — resolve the association + which side is on the left, then paint.
	 * @param {Record<string, any>} pRoutePayload
	 */
	handleMatrixRoute(pRoutePayload)
	{
		if (typeof(pRoutePayload) != 'object')
		{
			throw new Error(`Pict RecordSet AssociateMatrix route handler called with invalid route payload.`);
		}
		this._associationHash = pRoutePayload.data.Association;
		this._side = { Left: this._blankSide('Left'), Right: this._blankSide('Right') };
		const tmpAssociation = this.manager ? this.manager.getAssociation(this._associationHash) : null;
		if (!tmpAssociation)
		{
			this.pict.log.warn(`AssociateMatrix: association [${this._associationHash}] is not registered.`);
			return this.renderMatrix();
		}
		// Left side: the named :LeftRecordSet, else the association's SideA. The other side goes right.
		const tmpLeftRecordSet = pRoutePayload.data.LeftRecordSet || tmpAssociation.SideA.RecordSet;
		const tmpSides = this.manager.resolveSides(this._associationHash, tmpLeftRecordSet);
		this._side.Left.side = tmpSides ? tmpSides.thisSide : tmpAssociation.SideA;
		this._side.Right.side = tmpSides ? tmpSides.otherSide : tmpAssociation.SideB;
		return this.renderMatrix();
	}

	/**
	 * Paint the screen shell, then fetch + render both tables.
	 * @return {Promise<boolean>}
	 */
	renderMatrix()
	{
		if (!this._side.Left.side || !this._side.Right.side)
		{
			this.pict.log.warn(`AssociateMatrix: could not resolve sides for [${this._associationHash}].`);
			return Promise.resolve(false);
		}
		const tmpLeftLabel = this._sideLabel('Left');
		const tmpRightLabel = this._sideLabel('Right');

		const tmpRecord =
		{
			Title: this.options.ScreenTitle || `Bulk-link ${tmpLeftLabel} & ${tmpRightLabel}`,
			Subtitle: `Check ${tmpLeftLabel} on the left and ${tmpRightLabel} on the right, then link every selected ${this._singular(tmpLeftLabel)} to every selected ${this._singular(tmpRightLabel)}.`,
			StatsID: `${this.safeKey}_Stats`,
			LinkButtonID: `${this.safeKey}_Link`,
			PickerMissing: !this.pict.EntityProvider,
			Left: this._panelRecord('Left'),
			Right: this._panelRecord('Right'),
			// Initial stats (zero selected).
			LeftCount: 0, RightCount: 0, PairCount: 0, PairPlural: 's', LeftLabel: tmpLeftLabel, RightLabel: tmpRightLabel,
		};

		return new Promise((resolve) =>
		{
			this.renderAsync(this.options.DefaultRenderable, this.options.DefaultDestinationAddress, tmpRecord,
				(pError) =>
				{
					if (pError)
					{
						this.pict.log.error(`AssociateMatrix: render error.`, pError);
						return resolve(false);
					}
					this.pict.CSSMap.injectCSS();
					this.updateStats();
					Promise.all([ this._fetchSide('Left'), this._fetchSide('Right') ]).then(() => resolve(true));
				});
		});
	}

	/** @param {'Left'|'Right'} pColumn @return {Record<string, any>} The panel shell record. */
	_panelRecord(pColumn)
	{
		return {
			Column: pColumn,
			Label: this._sideLabel(pColumn),
			CountID: `${this.safeKey}_${pColumn}_Count`,
			TableID: `${this.safeKey}_${pColumn}_Table`,
			ChooserID: `${this.safeKey}_${pColumn}_Chooser`,
		};
	}

	/** The ColumnDataProvider persistence scope for a side (distinct from the List view's per-entity scope). */
	_columnScope(pColumn)
	{
		return `Matrix_${this._associationHash}_${pColumn}`;
	}

	/** @return {any} The column-visibility persistence provider (localStorage; host-overridable). */
	get columnProvider()
	{
		return this.pict.providers.ColumnDataProvider;
	}

	/**
	 * Effective visibility for a column: a stored user override wins, else the developer default
	 * (visible unless `DefaultHidden`).
	 * @param {'Left'|'Right'} pColumn @param {Record<string, any>} pCol
	 * @return {boolean}
	 */
	_isColumnVisible(pColumn, pCol)
	{
		const tmpOverrides = this.columnProvider ? this.columnProvider.getColumnVisibilityOverrides(this._columnScope(pColumn), 'Matrix') : {};
		if (tmpOverrides && Object.prototype.hasOwnProperty.call(tmpOverrides, pCol.Key))
		{
			return tmpOverrides[pCol.Key] === true;
		}
		return !pCol.DefaultHidden;
	}

	/** @param {'Left'|'Right'} pColumn @return {Array<Record<string, any>>} The currently-visible columns. */
	_visibleColumns(pColumn)
	{
		return this._side[pColumn].side.TableColumns.filter((pCol) => this._isColumnVisible(pColumn, pCol));
	}

	/** @param {'Left'|'Right'} pColumn @return {string} */
	_sideLabel(pColumn)
	{
		const tmpSide = this._side[pColumn].side;
		return tmpSide ? (tmpSide.Title || tmpSide.RecordSet || tmpSide.Entity) : '';
	}

	/**
	 * Fetch page 0 for a side (fresh search / first load), store the records, and render its table.
	 * @param {'Left'|'Right'} pColumn @return {Promise<void>}
	 */
	async _fetchSide(pColumn)
	{
		const tmpState = this._side[pColumn];
		tmpState.cursor = 0;
		const tmpResult = await this.manager.fetchSidePage(this._associationHash, tmpState.side.RecordSet, tmpState.search, 0, this.options.MatrixPageSize);
		tmpState.records = tmpResult.records;
		tmpState.hasMore = tmpResult.hasMore;
		this._renderSideTable(pColumn);
	}

	/**
	 * Fetch + append the next page for a side ("Load more").
	 * @param {'Left'|'Right'} pColumn @return {Promise<void>}
	 */
	async loadMoreSide(pColumn)
	{
		const tmpState = this._side[pColumn];
		tmpState.cursor += this.options.MatrixPageSize;
		const tmpResult = await this.manager.fetchSidePage(this._associationHash, tmpState.side.RecordSet, tmpState.search, tmpState.cursor, this.options.MatrixPageSize);
		tmpState.records = tmpState.records.concat(tmpResult.records);
		tmpState.hasMore = tmpResult.hasMore;
		this._renderSideTable(pColumn);
	}

	/**
	 * Debounced search for a side — re-fetches page 0. Only the table container repaints, so the search
	 * input keeps focus.
	 * @param {'Left'|'Right'} pColumn @param {string} pTerm
	 */
	searchSide(pColumn, pTerm)
	{
		this._side[pColumn].search = pTerm;
		if (this._searchTimers[pColumn])
		{
			clearTimeout(this._searchTimers[pColumn]);
		}
		this._searchTimers[pColumn] = setTimeout(() => { this._fetchSide(pColumn); }, 250);
	}

	/**
	 * Build the row models for a side and render its table into the panel's table container.
	 * @param {'Left'|'Right'} pColumn
	 */
	_renderSideTable(pColumn)
	{
		const tmpState = this._side[pColumn];
		const tmpColumns = this._visibleColumns(pColumn);
		const tmpIDField = tmpState.side.IDField;
		const tmpRows = tmpState.records.map((pRecord) =>
		{
			const tmpID = pRecord[tmpIDField];
			return {
				Column: pColumn,
				Value: tmpID,
				RowID: `${this.safeKey}_${pColumn}_row_${tmpID}`,
				Selected: !!tmpState.selected[String(tmpID)],
				Cells: tmpColumns.map((pCol) => ({ Value: pCol.Template ? this.pict.parseTemplate(pCol.Template, pRecord) : pRecord[pCol.Key] })),
			};
		});
		const tmpTableRecord = {
			Columns: tmpColumns.map((pCol) => ({ DisplayName: pCol.DisplayName })),
			Rows: tmpRows,
			// One-or-zero-element slot drives the empty-state line (TS parses inner tags; NE would not).
			EmptySlot: (tmpRows.length === 0) ? [ { EmptyText: `No ${this._sideLabel(pColumn)} found.` } ] : [],
			MoreSlot: tmpState.hasMore ? [ { Column: pColumn } ] : [],
		};
		const tmpHTML = this.pict.parseTemplateByHash('PRSP-AssociateMatrix-Table', tmpTableRecord);
		this.pict.ContentAssignment.assignContent(`#${this.safeKey}_${pColumn}_Table`, tmpHTML);
		this.pict.ContentAssignment.assignContent(`#${this.safeKey}_${pColumn}_Count`, this._selectedCount(pColumn) ? `${this._selectedCount(pColumn)} selected` : '');
	}

	/**
	 * Open/close a side's column chooser popover (the "Columns" button). Re-renders its rows on open.
	 * @param {'Left'|'Right'} pColumn
	 */
	toggleColumnChooser(pColumn)
	{
		const tmpWrapElements = this.pict.ContentAssignment.getElement(`#${this.safeKey}_${pColumn}_Chooser_Wrap`);
		if (!tmpWrapElements || tmpWrapElements.length < 1)
		{
			return;
		}
		if (tmpWrapElements[0].classList.contains('is-open'))
		{
			tmpWrapElements[0].classList.remove('is-open');
			return;
		}
		this._renderColumnChooser(pColumn);
		tmpWrapElements[0].classList.add('is-open');
	}

	/** Close a side's column chooser (the backdrop's outside-click handler). @param {'Left'|'Right'} pColumn */
	closeColumnChooser(pColumn)
	{
		const tmpWrapElements = this.pict.ContentAssignment.getElement(`#${this.safeKey}_${pColumn}_Chooser_Wrap`);
		if (tmpWrapElements && tmpWrapElements.length > 0)
		{
			tmpWrapElements[0].classList.remove('is-open');
		}
	}

	/** Render a side's column-chooser rows (every declared column, checked when effectively visible). */
	_renderColumnChooser(pColumn)
	{
		const tmpRows = this._side[pColumn].side.TableColumns.map((pCol) => (
			{
				Column: pColumn,
				Key: pCol.Key,
				DisplayName: pCol.DisplayName,
				Visible: this._isColumnVisible(pColumn, pCol),
			}));
		const tmpHTML = this.pict.parseTemplateByHash('PRSP-AssociateMatrix-Chooser', { Column: pColumn, Rows: tmpRows });
		this.pict.ContentAssignment.assignContent(`#${this.safeKey}_${pColumn}_Chooser`, tmpHTML);
	}

	/**
	 * Toggle one column's visibility — persisted through the ColumnDataProvider (localStorage; a host can
	 * register its own provider for server-side prefs). Refuses to hide the last visible column.
	 * @param {'Left'|'Right'} pColumn @param {string} pKey
	 */
	toggleColumn(pColumn, pKey)
	{
		if (!this.columnProvider)
		{
			return;
		}
		const tmpCol = this._side[pColumn].side.TableColumns.find((pCol) => String(pCol.Key) === String(pKey));
		if (!tmpCol)
		{
			return;
		}
		const tmpCurrentlyVisible = this._isColumnVisible(pColumn, tmpCol);
		if (tmpCurrentlyVisible && this._visibleColumns(pColumn).length <= 1)
		{
			return;
		}
		this.columnProvider.setColumnVisibilityOverride(this._columnScope(pColumn), 'Matrix', pKey, !tmpCurrentlyVisible);
		this._renderSideTable(pColumn);
		this._renderColumnChooser(pColumn);
	}

	/** Clear a side's column overrides — back to the developer defaults. */
	resetColumns(pColumn)
	{
		if (this.columnProvider)
		{
			this.columnProvider.clearColumnVisibilityOverrides(this._columnScope(pColumn), 'Matrix');
		}
		this._renderSideTable(pColumn);
		this._renderColumnChooser(pColumn);
	}

	/**
	 * Toggle a row's selection (the row click). Updates the selection set + the row's visual state + the
	 * stats, without re-rendering the whole table (so scroll + focus are preserved).
	 * @param {'Left'|'Right'} pColumn @param {string|number} pValue
	 */
	toggleRow(pColumn, pValue)
	{
		const tmpState = this._side[pColumn];
		const tmpKey = String(pValue);
		if (tmpState.selected[tmpKey])
		{
			delete tmpState.selected[tmpKey];
		}
		else
		{
			tmpState.selected[tmpKey] = true;
		}
		const tmpRowElements = this.pict.ContentAssignment.getElement(`#${this.safeKey}_${pColumn}_row_${pValue}`);
		if (tmpRowElements && tmpRowElements.length > 0)
		{
			tmpRowElements[0].classList.toggle('is-selected', !!tmpState.selected[tmpKey]);
		}
		this.pict.ContentAssignment.assignContent(`#${this.safeKey}_${pColumn}_Count`, this._selectedCount(pColumn) ? `${this._selectedCount(pColumn)} selected` : '');
		this.updateStats();
	}

	/** @param {'Left'|'Right'} pColumn @return {number} */
	_selectedCount(pColumn)
	{
		return Object.keys(this._side[pColumn].selected).length;
	}

	/** Recompute the live stats line + the link button's enabled state. */
	updateStats()
	{
		const tmpLeft = this._selectedCount('Left');
		const tmpRight = this._selectedCount('Right');
		const tmpPairs = tmpLeft * tmpRight;
		const tmpStatsHTML = this.pict.parseTemplateByHash('PRSP-AssociateMatrix-Stats',
			{ LeftCount: tmpLeft, RightCount: tmpRight, PairCount: tmpPairs, PairPlural: (tmpPairs === 1) ? '' : 's', LeftLabel: this._sideLabel('Left'), RightLabel: this._sideLabel('Right') });
		this.pict.ContentAssignment.assignContent(`#${this.safeKey}_Stats`, tmpStatsHTML);

		const tmpButtonElements = this.pict.ContentAssignment.getElement(`#${this.safeKey}_Link`);
		if (tmpButtonElements && tmpButtonElements.length > 0)
		{
			tmpButtonElements[0].disabled = (tmpPairs < 1);
		}
	}

	/**
	 * Create the cross-product of joins for the checked rows — every left record linked to every right
	 * record — skipping pairs that already exist (one INN lookup). Confirms first for large sets.
	 * @return {Promise<void>}
	 */
	async associateMatrix()
	{
		const tmpLeftIDs = Object.keys(this._side.Left.selected);
		const tmpRightIDs = Object.keys(this._side.Right.selected);
		if (tmpLeftIDs.length < 1 || tmpRightIDs.length < 1)
		{
			this._toast('Check records on both sides first.', 'info');
			return;
		}
		const tmpTotal = tmpLeftIDs.length * tmpRightIDs.length;
		const tmpLeftSide = this._side.Left.side;
		const tmpRightSide = this._side.Right.side;

		const tmpModal = this.pict.views['Pict-Section-Modal'];
		if (tmpTotal > 100 && tmpModal && typeof tmpModal.confirm === 'function')
		{
			const tmpOk = await tmpModal.confirm(`This will create up to ${tmpTotal} links. Continue?`,
				{ title: 'Bulk link', confirmLabel: `Link ${tmpTotal}`, cancelLabel: 'Cancel' });
			if (!tmpOk)
			{
				return;
			}
		}

		// Existing pairs (one INN lookup over the checked left ids) so we never duplicate a join.
		const tmpExisting = await this.manager.listJoinRecordsForIDs(this._associationHash, tmpLeftSide.RecordSet, tmpLeftIDs);
		const tmpExistingSet = {};
		for (let i = 0; i < tmpExisting.length; i++)
		{
			tmpExistingSet[`${tmpExisting[i][tmpLeftSide.IDField]}|${tmpExisting[i][tmpRightSide.IDField]}`] = true;
		}

		let tmpCreated = 0;
		let tmpSkipped = 0;
		let tmpFailed = 0;
		for (let i = 0; i < tmpLeftIDs.length; i++)
		{
			for (let j = 0; j < tmpRightIDs.length; j++)
			{
				if (tmpExistingSet[`${tmpLeftIDs[i]}|${tmpRightIDs[j]}`])
				{
					tmpSkipped++;
					continue;
				}
				try
				{
					await this.manager.createJoin(this._associationHash, tmpLeftSide.RecordSet, tmpLeftIDs[i], tmpRightIDs[j]);
					tmpCreated++;
				}
				catch (pError)
				{
					tmpFailed++;
					this.pict.log.error(`AssociateMatrix: failed to link ${tmpLeftIDs[i]} <-> ${tmpRightIDs[j]}.`, pError);
				}
			}
		}

		const tmpParts = [];
		if (tmpCreated > 0) { tmpParts.push(`${tmpCreated} link${tmpCreated === 1 ? '' : 's'} created`); }
		if (tmpSkipped > 0) { tmpParts.push(`${tmpSkipped} already existed`); }
		if (tmpFailed > 0) { tmpParts.push(`${tmpFailed} failed`); }
		this._toast(tmpParts.length ? tmpParts.join(', ') + '.' : 'Nothing to link.', tmpFailed > 0 ? 'error' : 'success');

		// Clear both selections and repaint the tables so the next batch starts clean.
		this._side.Left.selected = {};
		this._side.Right.selected = {};
		this._renderSideTable('Left');
		this._renderSideTable('Right');
		this.updateStats();
	}

	/** Crude singularizer for the subtitle copy ("Books" -> "Book"). */
	_singular(pLabel)
	{
		return (typeof pLabel === 'string' && pLabel.length > 1 && pLabel.slice(-1).toLowerCase() === 's') ? pLabel.slice(0, -1) : pLabel;
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

module.exports = viewRecordSetAssociateMatrix;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_AssociateMatrix;
