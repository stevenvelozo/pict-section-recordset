const libPictView = require('pict-view');

/**
 * The Association Editor — a small, embeddable widget that manages one many-to-many association from
 * the perspective of a single anchor record (e.g. the Authors of THIS book). It renders:
 *   - a searchable entity picker of the OTHER side, with the currently-associated rows culled out, and
 *   - a list of the current associations, each with a remove button.
 *
 * It is instantiated once per (anchor recordset, association) by the read view's Association tab, with
 * a unique Hash. All join + display data flows through the shared `RecordSetAssociationManager`; the
 * picker comes from `pict-section-picker` (a soft dependency — the host registers it as
 * `Pict-Section-Picker`). Instance-specific state is passed via the render Record (not a per-instance
 * AppData address), so the shared templates stay address-stable across instances.
 *
 * Configuration (set by the read view when it creates the instance):
 *   - AssociationHash {string}  - the association to manage.
 *   - ThisRecordSet {string}    - the anchor recordset name (resolves which side is "this side").
 *   - ThisID {string|number}    - the anchor record's id (re-set before each render).
 *   - DefaultDestinationAddress - the tab body to render into.
 *   - PickerMode {'single'|'multi'} - the add control: 'single' (default) stages one pick that an
 *       explicit Add button (or Enter) commits; 'multi' stages chips that one Add commits together.
 *       Driven from the RecordSetReadTabs Association entry's PickerMode.
 */

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_AssociationEditor = (
	{
		ViewIdentifier: 'PRSP-AssociationEditor',

		DefaultRenderable: 'PRSP_Renderable_AssociationEditor',
		DefaultDestinationAddress: '#PRSP_AssociationEditor_Container',
		DefaultTemplateRecordAddress: false,

		AutoInitialize: false,
		AutoInitializeOrdinal: 0,
		AutoRender: false,
		AutoRenderOrdinal: 0,
		AutoSolveWithApp: false,
		AutoSolveOrdinal: 0,

		CSS: /*css*/`
		.prsp-assoc { display: flex; flex-direction: column; gap: 0.85rem; padding: 0.25rem 0 0.5rem; }
		.prsp-assoc-add { display: flex; flex-direction: column; gap: 0.35rem; }
		.prsp-assoc-add-label { font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.05em; color: var(--theme-color-text-muted, #6b7686); }
		.prsp-assoc-add-row { display: flex; align-items: flex-start; gap: 0.5rem; }
		.prsp-assoc-picker-host { flex: 1 1 auto; min-width: 0; max-width: 460px; }
		.prsp-assoc-add-btn { flex: 0 0 auto; display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer; font: inherit; font-size: 0.9rem; font-weight: 600;
			padding: 0.45rem 0.85rem; border-radius: 8px; border: 1px solid var(--theme-color-brand-primary, #156dd1);
			background: var(--theme-color-brand-primary, #156dd1); color: #fff; }
		.prsp-assoc-add-btn:hover { background: var(--theme-color-brand-primary-hover, #1259ad); }
		.prsp-assoc-list { display: flex; flex-direction: column; gap: 0.3rem; }
		.prsp-assoc-list-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
		.prsp-assoc-list-title { font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.05em; color: var(--theme-color-text-muted, #6b7686); }
		.prsp-assoc-count { font-size: 0.78rem; color: var(--theme-color-text-muted, #6b7686); }
		.prsp-assoc-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.45rem 0.6rem; border: 1px solid var(--theme-color-border-light, #e8ebf0); border-radius: 8px;
			background: var(--theme-color-background-primary, #fff); }
		.prsp-assoc-row:hover { border-color: var(--theme-color-border-default, #d7dce3); }
		.prsp-assoc-row-name { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--theme-color-text-primary, #1f2733); font-size: 0.92rem; }
		.prsp-assoc-row-chips { flex: 1 1 auto; display: flex; flex-wrap: wrap; gap: 0.3rem; min-width: 0; }
		.prsp-assoc-chip { flex: 0 0 auto; display: inline-flex; align-items: center; font-size: 0.72rem; font-weight: 600; line-height: 1.25;
			padding: 0.05rem 0.4rem; border-radius: 5px; white-space: nowrap;
			background: var(--theme-color-background-tertiary, #eceef2); color: var(--theme-color-text-secondary, #45596b); }
		.prsp-assoc-row-id { flex: 0 0 auto; font-size: 0.74rem; color: var(--theme-color-text-muted, #6b7686); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
		.prsp-assoc-remove { flex: 0 0 auto; display: inline-flex; align-items: center; cursor: pointer; border: none; background: transparent; color: var(--theme-color-text-muted, #6b7686); padding: 0.2rem; border-radius: 5px; font: inherit; }
		.prsp-assoc-remove:hover { color: var(--theme-color-status-error, #b62828); background: color-mix(in srgb, var(--theme-color-status-error, #b62828) 10%, transparent); }
		.prsp-assoc-empty { padding: 0.7rem 0.2rem; color: var(--theme-color-text-muted, #6b7686); font-size: 0.88rem; font-style: italic; }
		.prsp-assoc-note { color: var(--theme-color-status-error, #b62828); font-size: 0.86rem; }
		`,
		CSSPriority: 500,

		Templates:
		[
			{
				Hash: 'PRSP-AssociationEditor-Template',
				Template: /*html*/`
		<!-- DefaultPackage pict view template: [PRSP-AssociationEditor-Template] -->
		<div class="prsp-assoc">
			<div class="prsp-assoc-add">
				<span class="prsp-assoc-add-label">{~D:Record.AddLabel~}</span>
				<div class="prsp-assoc-add-row">
					<div class="prsp-assoc-picker-host" id="{~D:Record.PickerHostID~}"></div>
					<button type="button" class="prsp-assoc-add-btn" id="{~D:Record.AddButtonID~}" onclick="_Pict.views['{~D:Record.ViewHash~}'].addStaged()" onkeydown="if (event.key === 'Enter') { event.preventDefault(); _Pict.views['{~D:Record.ViewHash~}'].addStaged(); }">{~I:Plus~} {~D:Record.AddButtonLabel~}</button>
				</div>
				{~NE:Record.PickerMissing^<div class="prsp-assoc-note">The entity picker (pict-section-picker) is not registered, so associations cannot be added here.</div>~}
			</div>
			<div class="prsp-assoc-list">
				<div class="prsp-assoc-list-head">
					<span class="prsp-assoc-list-title">{~D:Record.ListLabel~}</span>
					<span class="prsp-assoc-count">{~D:Record.Count~}</span>
				</div>
				{~TS:PRSP-AssociationEditor-Row:Record.Items~}
				{~TS:PRSP-AssociationEditor-Empty:Record.EmptySlot~}
			</div>
		</div>
		<!-- DefaultPackage end view template:  [PRSP-AssociationEditor-Template] -->
	`
			},
			{
				Hash: 'PRSP-AssociationEditor-Empty',
				Template: /*html*/`<div class="prsp-assoc-empty">{~D:Record.EmptyText~}</div>`
			},
			{
				Hash: 'PRSP-AssociationEditor-Row',
				Template: /*html*/`
		<div class="prsp-assoc-row">
			<span class="prsp-assoc-row-name">{~D:Record.Display~}</span>
			<span class="prsp-assoc-row-chips">{~TS:PRSP-AssociationEditor-Chip:Record.Chips~}</span>
			<span class="prsp-assoc-row-id">#{~D:Record.OtherID~}</span>
			<button type="button" class="prsp-assoc-remove" title="Remove association" onclick="_Pict.views['{~D:Record.ViewHash~}'].removeItem({~D:Record.JoinID~})">{~I:Trash~}</button>
		</div>
	`
			},
			{
				Hash: 'PRSP-AssociationEditor-Chip',
				Template: /*html*/`<span class="prsp-assoc-chip">{~D:Record.Text~}</span>`
			}
		],

		Renderables:
		[
			{
				RenderableHash: 'PRSP_Renderable_AssociationEditor',
				TemplateHash: 'PRSP-AssociationEditor-Template',
				ContentDestinationAddress: '#PRSP_AssociationEditor_Container',
				RenderMethod: 'replace'
			}
		],

		Manifests: {}
	});

class viewRecordSetAssociationEditor extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_AssociationEditor, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		/** @type {import('pict')} */
		this.pict;

		// The other-side ids currently associated (the live cull set the picker reads via a closure).
		this._otherIDs = [];
		// The current list items (so removeItem can find the exact join record by JoinID).
		this._lastItems = [];
	}

	/** @return {any} The association manager provider. */
	get manager()
	{
		return this.pict.providers.RecordSetAssociationManager;
	}

	/** @return {string} A DOM/address-safe key derived from this instance's Hash. */
	get safeKey()
	{
		return String(this.Hash).replace(/[^A-Za-z0-9]/g, '_');
	}

	/**
	 * Load the current associations and (re)paint the whole widget, then mount the picker. This is the
	 * editor's entry point — the read view's Association tab calls it (not the framework `render()`),
	 * so the async data load happens before the template renders (the read-view pattern).
	 *
	 * @return {Promise<boolean>}
	 */
	async renderEditor()
	{
		const tmpSides = this.manager ? this.manager.resolveSides(this.options.AssociationHash, this.options.ThisRecordSet) : false;
		if (!tmpSides)
		{
			this.pict.log.warn(`AssociationEditor [${this.Hash}]: association [${this.options.AssociationHash}] could not be resolved for [${this.options.ThisRecordSet}].`);
			return false;
		}

		const tmpThisID = this.options.ThisID;
		let tmpItems = [];
		if (tmpThisID !== undefined && tmpThisID !== null && tmpThisID !== '')
		{
			tmpItems = await this.manager.listAssociatedRecords(this.options.AssociationHash, this.options.ThisRecordSet, tmpThisID);
		}

		// Stamp the view hash on each row so the row template's remove button can reach this instance.
		for (let i = 0; i < tmpItems.length; i++)
		{
			tmpItems[i].ViewHash = this.Hash;
		}
		this._lastItems = tmpItems;
		this._otherIDs = tmpItems.map((pItem) => pItem.OtherID);

		const tmpOtherLabel = tmpSides.otherSide.Title || tmpSides.otherSide.RecordSet || tmpSides.otherSide.Entity;
		const tmpPickerPresent = !!this.pict.providers['Pict-Section-Picker'];
		const tmpRecord =
		{
			ViewHash: this.Hash,
			PickerHostID: `${this.safeKey}_Picker`,
			AddButtonID: `${this.safeKey}_AddBtn`,
			AddButtonLabel: (this.options.PickerMode === 'multi') ? 'Add selected' : 'Add',
			AddLabel: `Add ${tmpOtherLabel}`,
			ListLabel: `Current ${tmpOtherLabel}`,
			Count: `${tmpItems.length} ${tmpItems.length === 1 ? 'record' : 'records'}`,
			Items: tmpItems,
			// One-or-zero-element slot drives the empty-state line (TS parses inner tags; NE would not).
			EmptySlot: (tmpItems.length === 0) ? [ { EmptyText: `No ${tmpOtherLabel} associated yet — use the search above to add some.` } ] : [],
			PickerMissing: !tmpPickerPresent,
		};

		return new Promise((resolve) =>
		{
			this.renderAsync(this.options.DefaultRenderable, this.options.DefaultDestinationAddress, tmpRecord,
				(pError) =>
				{
					if (pError)
					{
						this.pict.log.error(`AssociationEditor [${this.Hash}]: render error.`, pError);
						return resolve(false);
					}
					this._mountPicker(tmpSides, tmpRecord.PickerHostID);
					this.pict.CSSMap.injectCSS();
					return resolve(true);
				});
		});
	}

	/**
	 * Create (or reconfigure) the other-side entity picker into its host element and render it. The
	 * picker's BaseFilter culls the currently-associated ids via a closure over `this._otherIDs`, so it
	 * re-evaluates on every search as associations change.
	 *
	 * @param {Record<string, any>} pSides - resolved sides from the manager.
	 * @param {string} pPickerHostID - the picker host element id.
	 */
	_mountPicker(pSides, pPickerHostID)
	{
		const tmpPickerProvider = this.pict.providers['Pict-Section-Picker'];
		if (!tmpPickerProvider)
		{
			return;
		}
		const tmpPickerHash = `${this.safeKey}_PickerView`;
		const tmpValueAddress = `AppData.PRSPAssocPicker.${this.safeKey}`;
		const tmpMulti = (this.options.PickerMode === 'multi');
		// Reset the scratch value so the picker mounts empty (and re-culls) after each add.
		if (!this.pict.AppData.PRSPAssocPicker) { this.pict.AppData.PRSPAssocPicker = {}; }
		this.pict.AppData.PRSPAssocPicker[this.safeKey] = tmpMulti ? [] : null;

		const tmpConfig = this.manager.buildOtherPickerConfig(this.options.AssociationHash, this.options.ThisRecordSet, () => this._otherIDs,
			{
				Mode: tmpMulti ? 'multi' : 'single',
				DestinationAddress: `#${pPickerHostID}`,
				ValueAddress: tmpValueAddress,
				Placeholder: `Search ${pSides.otherSide.Title || pSides.otherSide.RecordSet || pSides.otherSide.Entity}…`,
				// No add-on-select: a single-select pick just stages the value and moves focus to the Add
				// button (so Enter commits). Multi mode stages chips; the Add button commits them.
				OnChange: tmpMulti ? undefined : (() => this._focusAddButton()),
			});
		if (!tmpConfig)
		{
			return;
		}
		tmpPickerProvider.createEntityPicker(tmpPickerHash, tmpConfig);
		this.pict.views[tmpPickerHash].render();
	}

	/** Move focus to the Add button so a single-select pick can be committed by pressing Enter. */
	_focusAddButton()
	{
		const tmpButton = document.getElementById(`${this.safeKey}_AddBtn`);
		if (tmpButton)
		{
			tmpButton.focus();
		}
	}

	/**
	 * Commit the staged selection(s) — the Add button (and Enter). Reads the picker's value: a single
	 * scalar, or (multi mode) an array of ids. Creates a join for each, then reloads + repaints so the
	 * new rows appear and are culled from the picker.
	 *
	 * @return {Promise<void>}
	 */
	async addStaged()
	{
		const tmpStaged = this.pict.AppData.PRSPAssocPicker ? this.pict.AppData.PRSPAssocPicker[this.safeKey] : null;
		const tmpIDs = (this.options.PickerMode === 'multi')
			? (Array.isArray(tmpStaged) ? tmpStaged.slice() : [])
			: ((tmpStaged === undefined || tmpStaged === null || tmpStaged === '') ? [] : [ tmpStaged ]);
		if (tmpIDs.length < 1)
		{
			return;
		}
		let tmpFailures = 0;
		for (let i = 0; i < tmpIDs.length; i++)
		{
			try
			{
				await this.manager.createJoin(this.options.AssociationHash, this.options.ThisRecordSet, this.options.ThisID, tmpIDs[i]);
			}
			catch (pError)
			{
				tmpFailures++;
				this.pict.log.error(`AssociationEditor [${this.Hash}]: failed to create association for ${tmpIDs[i]}.`, pError);
			}
		}
		if (tmpFailures > 0)
		{
			this._toast(`${tmpFailures} association(s) could not be added.`, 'error');
		}
		await this.renderEditor();
	}

	/**
	 * Remove one association (a list row's remove handler). Confirms via the host modal, deletes the
	 * join, then reloads + repaints.
	 *
	 * @param {string|number} pJoinID - the join record id to delete.
	 * @return {Promise<void>}
	 */
	async removeItem(pJoinID)
	{
		const tmpItem = this._lastItems.find((pItem) => String(pItem.JoinID) === String(pJoinID));
		if (!tmpItem)
		{
			return;
		}
		const fRemove = async () =>
		{
			try
			{
				await this.manager.removeJoin(this.options.AssociationHash, tmpItem.JoinRecord);
			}
			catch (pError)
			{
				this.pict.log.error(`AssociationEditor [${this.Hash}]: failed to remove association.`, pError);
				this._toast('Could not remove the association.', 'error');
				return;
			}
			await this.renderEditor();
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

module.exports = viewRecordSetAssociationEditor;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_AssociationEditor;
