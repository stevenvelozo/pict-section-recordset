const libPictProvider = require('pict-provider');

const _DEFAULT_CONFIGURATION =
{
	ProviderIdentifier: 'RecordSetCardManager',

	AutoInitialize: true,
	AutoInitializeOrdinal: 0,

	CSS: /*css*/`
	.psrs-card-trigger { display: inline-flex; align-items: center; gap: 0.25rem; cursor: pointer; }
	.psrs-card-trigger-label { text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 0.15em; }
	.psrs-card-trigger:hover .psrs-card-trigger-label { text-decoration-style: solid; color: var(--theme-color-brand-primary, #156dd1); }
	.psrs-card-trigger-icon { display: inline-flex; font-size: 0.82em; color: var(--theme-color-text-muted, #6b7686); }
	.psrs-card-trigger:hover .psrs-card-trigger-icon { color: var(--theme-color-brand-primary, #156dd1); }

	.psrs-card-popover { position: absolute; z-index: 4000; min-width: 16rem; max-width: 22rem; max-height: 70vh; overflow-y: auto;
		background: var(--theme-color-background-panel, #fff); border: 1px solid var(--theme-color-border-default, #d7dce3);
		border-radius: 12px; box-shadow: 0 16px 40px rgba(15, 23, 42, 0.20); padding: 0.95rem 1.05rem;
		opacity: 0; transform: translateY(-4px); transition: opacity 0.12s ease, transform 0.12s ease; pointer-events: none; }
	.psrs-card-popover.is-open { opacity: 1; transform: translateY(0); pointer-events: auto; }
	.psrs-card-head { display: flex; align-items: flex-start; gap: 0.7rem; margin: 0 0 0.6rem; }
	.psrs-card-img { flex: 0 0 auto; width: 2.6rem; height: 2.6rem; border-radius: 8px; overflow: hidden;
		background: var(--theme-color-background-tertiary, #f1f3f6); display: flex; align-items: center; justify-content: center; }
	.psrs-card-img img { width: 100%; height: 100%; object-fit: cover; }
	.psrs-card-title { font-size: 1.02rem; font-weight: 700; line-height: 1.2; color: var(--theme-color-text-primary, #1f2733); }
	.psrs-card-subtitle { font-size: 0.82rem; color: var(--theme-color-text-muted, #6b7686); margin-top: 0.1rem; }
	.psrs-card-fields { display: grid; grid-template-columns: auto 1fr; gap: 0.3rem 0.85rem; align-items: baseline; margin: 0.2rem 0 0; }
	.psrs-card-label { font-size: 0.68rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--theme-color-text-muted, #6b7686); white-space: nowrap; }
	.psrs-card-value { font-size: 0.9rem; color: var(--theme-color-text-primary, #1f2733); word-break: break-word; }
	.psrs-card-bool { display: inline-flex; align-items: center; justify-content: center; width: 1.05rem; height: 1.05rem; border-radius: 4px;
		border: 1.5px solid var(--theme-color-border-default, #c7cdd6); color: #fff; vertical-align: middle; }
	.psrs-card-bool-on { background: var(--theme-color-brand-primary, #156dd1); border-color: var(--theme-color-brand-primary, #156dd1); }
	.psrs-card-bool .pict-icon { font-size: 0.8em; }
	.psrs-card-custom { font-size: 0.9rem; color: var(--theme-color-text-primary, #1f2733); }
	.psrs-card-actions { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.85rem; padding-top: 0.7rem; border-top: 1px solid var(--theme-color-border-light, #eef1f5); }
	.psrs-card-action { display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer; font: inherit; font-size: 0.82rem; font-weight: 600;
		text-decoration: none; padding: 0.3rem 0.7rem; border-radius: 7px; border: 1px solid var(--theme-color-border-default, #d7dce3);
		background: var(--theme-color-background-secondary, #f5f6f8); color: var(--theme-color-text-secondary, #45505f); }
	.psrs-card-action:hover { border-color: var(--theme-color-brand-primary, #156dd1); color: var(--theme-color-brand-primary, #156dd1); background: var(--theme-color-background-selected, #e3edfb); }
	.psrs-card-action .pict-icon { font-size: 0.9em; }
	/* Audit stripe — a thin Created/Updated line + ID/GUID copy buttons, shown above the actions when on. */
	.psrs-card-audit { display: flex; flex-wrap: wrap; align-items: center; gap: 0.3rem 0.8rem; margin-top: 0.7rem; padding-top: 0.55rem;
		border-top: 1px dashed var(--theme-color-border-light, #eef1f5); font-size: 0.7rem; line-height: 1.35; color: var(--theme-color-text-muted, #6b7686); }
	.psrs-card-audit-info { display: flex; flex-wrap: wrap; align-items: center; gap: 0.15rem 0.5rem; }
	.psrs-card-audit-info b { font-weight: 600; color: var(--theme-color-text-secondary, #45505f); }
	.psrs-card-audit-sep { opacity: 0.45; }
	.psrs-card-audit-copy { display: inline-flex; gap: 0.3rem; margin-left: auto; }
	.psrs-card-copy { display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; font: inherit; font-size: 0.68rem; font-weight: 600;
		border: 1px solid var(--theme-color-border-light, #e1e6ec); border-radius: 6px; padding: 0.08rem 0.4rem;
		background: var(--theme-color-background-secondary, #f5f6f8); color: var(--theme-color-text-muted, #6b7686); }
	.psrs-card-copy:hover { border-color: var(--theme-color-brand-primary, #156dd1); color: var(--theme-color-brand-primary, #156dd1); }
	.psrs-card-copy.psrs-card-copied { border-color: #2e9e5b; color: #2e9e5b; }
	.psrs-card-copy .pict-icon { font-size: 0.85em; }
	.psrs-card-audit-toggle { display: inline-flex; align-items: center; gap: 0.3rem; margin-left: auto; font-size: 0.74rem; font-weight: 600;
		color: var(--theme-color-text-muted, #6b7686); cursor: pointer; white-space: nowrap; }
	.psrs-card-audit-toggle input { cursor: pointer; margin: 0; }
	`,
	CSSPriority: 600,
};

/**
 * RecordSetCardManager — a global registry of "record preview cards". A card is a small, meaningful
 * view of one record plus links to its most important actions, defined entirely in CONFIGURATION per
 * recordset (no code). Any list, record view, or dashboard can drop a trigger (`{~RecordCard:~}` tag or
 * `triggerHTML()`); clicking it fetches the record (cached EntityProvider) and shows an anchored popover
 * card next to the trigger.
 *
 * Config shape (registered via settings.RecordCards or registerCard()):
 *   {
 *     Entity: 'Author',                              // Meadow entity to fetch (default: the recordset name)
 *     Title: 'Name',                                 // a field name OR a '{~...~}' template
 *     Subtitle: '{~D:Record.City~}, {~D:Record.Country~}',
 *     Image: 'PhotoURL',                             // optional image field/template
 *     Fields: [ { Label: 'Books', Value: 'BookCount' }, ... ],   // labeled values (field OR template)
 *     Template: '<custom markup with {~D:Record.X~}>',          // alternative to Fields (full control)
 *     Actions: [ { Label:'View', Icon:'Eye', Route:'#/PSRS/Author/View/{~D:Record.GUIDAuthor~}' },
 *                { Label:'Download', Icon:'Download', URL:'{~D:Record.FileURL~}' } ]   // Route | URL | Handler
 *   }
 */
class RecordSetCardManager extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		/** @type {any} */
		this.pict;

		// recordset name -> normalized card config
		this._cards = {};
		this._popoverElementID = 'PSRS-RecordCard-Popover';
		this._dismissBound = false;
		this._openForKey = null;

		if (this.pict && this.pict.CSSMap && (typeof this.pict.CSSMap.addCSS === 'function'))
		{
			this.pict.CSSMap.addCSS('PSRS-RecordCard-CSS', this.options.CSS, this.options.CSSPriority);
		}
	}

	/**
	 * Register a card layout for a recordset. Pre-compiles the config into a pict template so render is a
	 * single parseTemplateByHash against the fetched record.
	 * @param {String} pRecordSetName
	 * @param {Object} pCardConfig
	 */
	registerCard(pRecordSetName, pCardConfig)
	{
		if (!pRecordSetName || !pCardConfig || (typeof pCardConfig !== 'object'))
		{
			this.log.warn(`RecordSetCardManager: ignoring invalid card config for [${pRecordSetName}].`);
			return;
		}
		const tmpConfig =
		{
			Entity: pCardConfig.Entity || pRecordSetName,
			IDField: pCardConfig.IDField || `ID${pRecordSetName}`,
			GUIDField: pCardConfig.GUIDField || `GUID${pCardConfig.Entity || pRecordSetName}`,
			TemplateHash: `PSRS-RecordCard-${pRecordSetName}`,
			Config: pCardConfig,
		};
		this._cards[pRecordSetName] = tmpConfig;
		this.pict.TemplateProvider.addTemplate(tmpConfig.TemplateHash, this._buildCardTemplate(pCardConfig));
	}

	hasCard(pRecordSetName)
	{
		return !!this._cards[pRecordSetName];
	}

	/** A config value is a field name unless it already contains a template expression. */
	_valueTemplate(pValue)
	{
		if (pValue == null) { return ''; }
		const tmpValue = String(pValue);
		return (tmpValue.indexOf('{~') !== -1) ? tmpValue : `{~D:Record.${tmpValue}~}`;
	}

	/** Compile a card config into a pict template string (resolved against the record at render time). */
	_buildCardTemplate(pConfig)
	{
		let tmpHead = '<div class="psrs-card-head">';
		if (pConfig.Image)
		{
			tmpHead += `<div class="psrs-card-img"><img src="${this._valueTemplate(pConfig.Image)}" alt="" /></div>`;
		}
		tmpHead += `<div><div class="psrs-card-title">${this._valueTemplate(pConfig.Title || `ID${''}`)}</div>`;
		if (pConfig.Subtitle)
		{
			tmpHead += `<div class="psrs-card-subtitle">${this._valueTemplate(pConfig.Subtitle)}</div>`;
		}
		tmpHead += '</div></div>';

		let tmpBody = '';
		if (pConfig.Template)
		{
			tmpBody = `<div class="psrs-card-custom">${pConfig.Template}</div>`;
		}
		else if (Array.isArray(pConfig.Fields) && (pConfig.Fields.length > 0))
		{
			tmpBody = '<div class="psrs-card-fields">';
			pConfig.Fields.forEach((pField) =>
			{
				tmpBody += `<span class="psrs-card-label">${pField.Label || ''}</span><span class="psrs-card-value">${this._valueTemplate(pField.Value)}</span>`;
			});
			tmpBody += '</div>';
		}

		let tmpActions = '';
		if (Array.isArray(pConfig.Actions) && (pConfig.Actions.length > 0))
		{
			tmpActions = '<div class="psrs-card-actions">';
			pConfig.Actions.forEach((pAction) =>
			{
				const tmpIcon = pAction.Icon ? `<span class="psrs-card-action-icon">{~I:${pAction.Icon}~}</span>` : '';
				const tmpLabel = `${tmpIcon}<span>${pAction.Label || 'Open'}</span>`;
				if (pAction.URL)
				{
					tmpActions += `<a class="psrs-card-action" href="${this._valueTemplate(pAction.URL)}" target="_blank" rel="noopener" onclick="_Pict.providers.RecordSetCardManager.closeCard()">${tmpLabel}</a>`;
				}
				else if (pAction.Route)
				{
					tmpActions += `<a class="psrs-card-action" href="${this._valueTemplate(pAction.Route)}" onclick="_Pict.providers.RecordSetCardManager.closeCard()">${tmpLabel}</a>`;
				}
				else if (pAction.Handler)
				{
					tmpActions += `<button type="button" class="psrs-card-action" onclick="_Pict.providers.RecordSetCardManager.closeCard(); ${pAction.Handler}">${tmpLabel}</button>`;
				}
			});
			tmpActions += '</div>';
		}

		return `<div class="psrs-card">${tmpHead}${tmpBody}${tmpActions}</div>`;
	}

	// --- Trigger HTML (used by the {~RecordCard:~} template tag and by callers directly) ---

	/**
	 * The clickable inline trigger: a label + a small preview icon. Degrades to plain text when no card is
	 * registered for the recordset.
	 * @param {String} pRecordSetName
	 * @param {String|Number} pID
	 * @param {String} pLabel
	 * @return {String}
	 */
	triggerHTML(pRecordSetName, pID, pLabel)
	{
		const tmpLabel = (pLabel == null) ? '' : String(pLabel);
		if (!this.hasCard(pRecordSetName) || pID == null || pID === '')
		{
			return tmpLabel;
		}
		const tmpIcon = (typeof this.pict.icon === 'function') ? this.pict.icon('Info', { ariaLabel: 'Preview' }) : '';
		const tmpSafeID = String(pID).replace(/'/g, '');
		return `<span class="psrs-card-trigger" onclick="event.stopPropagation();_Pict.providers.RecordSetCardManager.openCard('${pRecordSetName}','${tmpSafeID}',this)">`
			+ `<span class="psrs-card-trigger-label">${tmpLabel}</span><span class="psrs-card-trigger-icon">${tmpIcon}</span></span>`;
	}

	// --- Open / render / position ---

	/**
	 * Open the preview card for a record next to an anchor element. The record is fetched through the
	 * cached EntityProvider unless a full record object is passed.
	 * @param {String} pRecordSetName
	 * @param {String|Number|Object} pIDOrRecord
	 * @param {HTMLElement} pAnchorElement
	 */
	openCard(pRecordSetName, pIDOrRecord, pAnchorElement, pOptions)
	{
		const tmpOptions = pOptions || {};
		// A registered card, or a synthesized default card so any entity gets a preview (rich callers).
		let tmpCard = this._cards[pRecordSetName];
		if (!tmpCard) { tmpCard = this._defaultCard(pRecordSetName, tmpOptions); }
		if (!tmpCard) { return; }

		const tmpKeyID = (pIDOrRecord && (typeof pIDOrRecord === 'object'))
			? ((pIDOrRecord[tmpCard.IDField] != null) ? pIDOrRecord[tmpCard.IDField] : '')
			: pIDOrRecord;
		const tmpKey = `${pRecordSetName}:${tmpKeyID}`;
		if (this._openForKey === tmpKey && this._isOpen())
		{
			this.closeCard();
			return;
		}

		// The audit stripe + the "more data" body both need the FULL record (the explorer passes only the few
		// Lite columns). Only RICH cards render those, so only rich cards fetch — a normal recordset card keeps
		// its exact existing behavior (no extra fetch) even when the global audit toggle is on.
		const tmpWantFull = !!tmpOptions.Rich;
		if (pIDOrRecord && (typeof pIDOrRecord === 'object'))
		{
			const tmpID = pIDOrRecord[tmpCard.IDField];
			if (tmpWantFull && (tmpID != null) && this.pict.EntityProvider)
			{
				return this._fetchAndShow(tmpCard, tmpID, pAnchorElement, tmpKey, tmpOptions, pIDOrRecord);
			}
			return this._renderAndShow(tmpCard, pIDOrRecord, pAnchorElement, tmpKey, tmpOptions);
		}
		if (!this.pict.EntityProvider) { return; }
		return this._fetchAndShow(tmpCard, pIDOrRecord, pAnchorElement, tmpKey, tmpOptions, null);
	}

	/** Fetch the full record (and, when the audit stripe is on, its creating/updating user names) then show. */
	_fetchAndShow(pCard, pID, pAnchorElement, pKey, pOptions, pFallbackRecord)
	{
		this.pict.EntityProvider.getEntity(pCard.Entity, pID, (pError, pRecord) =>
		{
			const tmpRecord = (pError || !pRecord) ? pFallbackRecord : pRecord;
			if (!tmpRecord)
			{
				this.log.warn(`RecordSetCardManager: could not load ${pCard.Entity} ${pID} for its preview card.`, pError);
				return;
			}
			const fRender = () =>
			{
				if (this.getAuditEnabled())
				{
					return this._resolveAuditUsers(tmpRecord, () => this._renderAndShow(pCard, tmpRecord, pAnchorElement, pKey, pOptions));
				}
				return this._renderAndShow(pCard, tmpRecord, pAnchorElement, pKey, pOptions);
			};
			// Rich cards checkbox-render schema booleans → ensure the entity's (cached) schema first.
			if (pOptions && pOptions.Rich) { return this._ensureSchema(pCard.Entity, fRender); }
			return fRender();
		});
	}

	/**
	 * Resolve + cache the set of BOOLEAN columns for an entity (so rich cards show 0/1 bits as checkboxes).
	 * Uses the host-supplied `SchemaSource(entity, cb) -> (err, schema)` — meadow JSON-schema (`properties[].type`)
	 * or Stricture (`Columns[].DataType`). No source / fetch failure → no booleans (values render verbatim).
	 */
	_ensureSchema(pEntity, fComplete)
	{
		if (!this._schemaBooleans) { this._schemaBooleans = {}; }
		if (this._schemaBooleans[pEntity]) { return fComplete(); }
		if (typeof this.SchemaSource !== 'function') { this._schemaBooleans[pEntity] = {}; return fComplete(); }
		let tmpSettled = false;
		const fDone = (pSchema) =>
		{
			if (tmpSettled) { return; }
			tmpSettled = true;
			const tmpBooleans = {};
			if (pSchema && pSchema.properties)
			{
				Object.keys(pSchema.properties).forEach((pKey) => { if (pSchema.properties[pKey] && (pSchema.properties[pKey].type === 'boolean')) { tmpBooleans[pKey] = true; } });
			}
			else if (pSchema && Array.isArray(pSchema.Columns))
			{
				pSchema.Columns.forEach((pColumn) => { if (pColumn && (pColumn.DataType === 'Boolean')) { tmpBooleans[pColumn.Column] = true; } });
			}
			this._schemaBooleans[pEntity] = tmpBooleans;
			fComplete();
		};
		try { this.SchemaSource(pEntity, (pError, pSchema) => fDone(pError ? null : pSchema)); }
		catch (pError) { fDone(null); }
	}

	/** Synthesize a card for an entity that has none registered, so every record still gets a preview. */
	_defaultCard(pRecordSetName, pOptions)
	{
		const tmpEntityConfig = (pOptions && pOptions.EntityConfig) || {};
		const tmpEntity = tmpEntityConfig.Entity || pRecordSetName;
		return {
			Entity: tmpEntity,
			IDField: tmpEntityConfig.IDField || `ID${pRecordSetName}`,
			GUIDField: tmpEntityConfig.GUIDField || `GUID${tmpEntity}`,
			TemplateHash: null,   // no pre-compiled template — default cards always render the rich (dynamic) body
			Config: { _Default: true, Title: (tmpEntityConfig.Display && tmpEntityConfig.Display.Title) || null, Actions: [] },
		};
	}

	/** Resolve creating/updating user display names onto the record (cached lookups) before a sync render. */
	_resolveAuditUsers(pRecord, fComplete)
	{
		const tmpEntityProvider = this.pict.EntityProvider;
		if (!tmpEntityProvider || (typeof tmpEntityProvider.getEntity !== 'function')) { return fComplete(); }
		const tmpJobs = [];
		if (pRecord.CreatingIDUser) { tmpJobs.push({ Field: 'CreatingUserName', ID: pRecord.CreatingIDUser }); }
		if (pRecord.UpdatingIDUser) { tmpJobs.push({ Field: 'UpdatingUserName', ID: pRecord.UpdatingIDUser }); }
		if (tmpJobs.length < 1) { return fComplete(); }
		let tmpPending = tmpJobs.length;
		tmpJobs.forEach((pJob) =>
		{
			tmpEntityProvider.getEntity('User', pJob.ID, (pError, pUser) =>
			{
				if (!pError && pUser)
				{
					pRecord[pJob.Field] = [ pUser.NameFirst, pUser.NameLast ].filter((pPart) => (typeof pPart === 'string') && pPart.trim().length > 0).join(' ')
						|| pUser.FullName || pUser.Name || pUser.LoginID || `User ${pJob.ID}`;
				}
				tmpPending--;
				if (tmpPending <= 0) { fComplete(); }
			});
		});
	}

	_renderAndShow(pCard, pRecord, pAnchorElement, pKey, pOptions)
	{
		const tmpOptions = pOptions || {};
		// A default card (no pre-compiled template) or a rich caller renders the dynamic body (all columns +
		// audit stripe). Otherwise the existing pre-compiled card template renders verbatim (no behavior change).
		const tmpRich = !!tmpOptions.Rich || !pCard.TemplateHash;
		let tmpHTML = '';
		if (!tmpRich)
		{
			// Cards use synchronous template tags ({~D:~}, {~I:~}, formatters) so a sync parse is correct and
			// avoids a flash; the record is already in hand here.
			try { tmpHTML = this.pict.parseTemplateByHash(pCard.TemplateHash, pRecord); }
			catch (pError) { this.log.error(`RecordSetCardManager: card render failed for ${pCard.TemplateHash}.`, pError); return; }
		}
		else
		{
			tmpHTML = this._buildRichCardHTML(pCard, pRecord, tmpOptions);
		}
		const tmpPopover = this._ensurePopover();
		if (!tmpPopover) { return; }
		tmpPopover.innerHTML = tmpHTML;
		if (!tmpRich)
		{
			// Drop any field whose value rendered empty so a card never shows a "LABEL: (blank)" row — the
			// configured Fields are static, but which ones have data varies per record. (The rich body skips
			// empties as it builds, so this only applies to the pre-compiled path.)
			const tmpValueCells = tmpPopover.querySelectorAll('.psrs-card-fields .psrs-card-value');
			for (let i = 0; i < tmpValueCells.length; i++)
			{
				if (String(tmpValueCells[i].textContent || '').trim() !== '') { continue; }
				const tmpLabelCell = tmpValueCells[i].previousElementSibling;
				if (tmpLabelCell && tmpLabelCell.classList.contains('psrs-card-label')) { tmpLabelCell.remove(); }
				tmpValueCells[i].remove();
			}
			const tmpFieldsBox = tmpPopover.querySelector('.psrs-card-fields');
			if (tmpFieldsBox && (tmpFieldsBox.children.length === 0)) { tmpFieldsBox.remove(); }
		}
		this.pict.CSSMap.injectCSS();
		this._openForKey = pKey;
		this._lastShow = { Card: pCard, Record: pRecord, Anchor: pAnchorElement, Key: pKey, Options: tmpOptions };   // for the audit re-render
		this._position(tmpPopover, pAnchorElement);
		tmpPopover.classList.add('is-open');
		this._bindDismiss();
	}

	// --- Rich card body (all columns + audit stripe) + the audit/copy actions ---

	/** Build the dynamic card HTML: head + all meaningful columns + (when on) the audit stripe + actions. */
	_buildRichCardHTML(pCard, pRecord, pOptions)
	{
		const tmpConfig = pCard.Config || {};
		const tmpTitle = (tmpConfig.Title ? this._resolveText(tmpConfig.Title, pRecord) : '') || this._deriveTitle(pRecord, pCard);
		let tmpHead = `<div class="psrs-card-head"><div><div class="psrs-card-title">${this._escapeHTML(tmpTitle)}</div>`;
		const tmpSubtitle = tmpConfig.Subtitle ? this._resolveText(tmpConfig.Subtitle, pRecord) : '';
		if (tmpSubtitle) { tmpHead += `<div class="psrs-card-subtitle">${this._escapeHTML(tmpSubtitle)}</div>`; }
		tmpHead += '</div></div>';

		// Skip the field the title already shows, so the body doesn't repeat it as a "Name: …" row.
		let tmpSkipField = null;
		if (tmpConfig.Title && (String(tmpConfig.Title).indexOf('{~') < 0)) { tmpSkipField = tmpConfig.Title; }
		else if (!tmpConfig.Title && pRecord.Name) { tmpSkipField = 'Name'; }
		let tmpBody = '';
		const tmpBooleanFields = (this._schemaBooleans && this._schemaBooleans[pCard.Entity]) || {};
		const tmpFields = this._richFields(pRecord, tmpSkipField, tmpBooleanFields);
		if (tmpFields.length > 0)
		{
			tmpBody = '<div class="psrs-card-fields">';
			tmpFields.forEach((pField) =>
			{
				const tmpValueCell = pField.IsBoolean ? this._boolHTML(pField.BoolOn) : this._escapeHTML(pField.Value);
				tmpBody += `<span class="psrs-card-label">${this._escapeHTML(pField.Label)}</span><span class="psrs-card-value">${tmpValueCell}</span>`;
			});
			tmpBody += '</div>';
		}

		const tmpAudit = this.getAuditEnabled() ? this._auditStripeHTML(pCard, pRecord) : '';
		const tmpActions = this._richActionsHTML(tmpConfig, pRecord, pOptions);
		return `<div class="psrs-card">${tmpHead}${tmpBody}${tmpAudit}${tmpActions}</div>`;
	}

	/** Every real data column (skipping id/guid — surfaced via copy buttons — audit, nulls + objects). */
	_richFields(pRecord, pSkipField, pBooleanFields)
	{
		const tmpBooleans = pBooleanFields || {};
		const tmpFields = [];
		Object.keys(pRecord || {}).forEach((pKey) =>
		{
			if (pKey === pSkipField) { return; }
			if (/^(ID|GUID)/.test(pKey)) { return; }
			if (/^(CreateDate|UpdateDate|CreatingIDUser|UpdatingIDUser|DeletingIDUser|DeleteDate|Deleted|CreatingUserName|UpdatingUserName)$/.test(pKey)) { return; }
			const tmpValue = pRecord[pKey];
			if ((tmpValue == null) || (tmpValue === '') || (typeof tmpValue === 'object')) { return; }
			// Schema booleans render as a checkbox glyph, not their raw 0/1.
			if (tmpBooleans[pKey])
			{
				tmpFields.push({ Label: this._humanizeLabel(pKey), IsBoolean: true, BoolOn: ((tmpValue === 1) || (tmpValue === '1') || (tmpValue === true) || (String(tmpValue).toLowerCase() === 'true')) });
				return;
			}
			let tmpDisplay = String(tmpValue);
			// Hide values that are only null/undefined tokens (e.g. a "null null" address from concatenated
			// empty parts) — they shouldn't reach the user looking like broken software.
			if (/^(null|undefined|nan)(\s+(null|undefined|nan))*$/i.test(tmpDisplay.trim())) { return; }
			// Humanize ISO timestamps instead of dumping the raw `2026-06-21T05:47:01.000Z`.
			if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(tmpDisplay)) { tmpDisplay = this._fmtDate(tmpDisplay); }
			tmpFields.push({ Label: this._humanizeLabel(pKey), Value: tmpDisplay });
		});
		return tmpFields;
	}

	/** A checkbox glyph for a schema-boolean value — filled when on, an empty box when off. */
	_boolHTML(pOn)
	{
		const tmpCheck = (pOn && (typeof this.pict.icon === 'function')) ? this.pict.icon('Check') : '';
		return `<span class="psrs-card-bool${pOn ? ' psrs-card-bool-on' : ''}">${pOn ? tmpCheck : ''}</span>`;
	}

	/** The thin audit stripe: Created/Updated date + user, plus ID/GUID copy buttons (value shown on hover). */
	_auditStripeHTML(pCard, pRecord)
	{
		const tmpInfo = [];
		if (pRecord.CreateDate) { tmpInfo.push(`<span>Created <b>${this._escapeHTML(this._fmtDate(pRecord.CreateDate))}</b>${pRecord.CreatingUserName ? ` by <b>${this._escapeHTML(pRecord.CreatingUserName)}</b>` : ''}</span>`); }
		if (pRecord.UpdateDate) { tmpInfo.push(`<span>Updated <b>${this._escapeHTML(this._fmtDate(pRecord.UpdateDate))}</b>${pRecord.UpdatingUserName ? ` by <b>${this._escapeHTML(pRecord.UpdatingUserName)}</b>` : ''}</span>`); }
		const tmpIcon = (typeof this.pict.icon === 'function') ? this.pict.icon('Copy') : '';
		let tmpCopies = '';
		const tmpID = pRecord[pCard.IDField];
		const tmpGUID = pRecord[pCard.GUIDField];
		if ((tmpID != null) && (tmpID !== '')) { tmpCopies += this._copyButtonHTML('ID', tmpID, tmpIcon); }
		if (tmpGUID) { tmpCopies += this._copyButtonHTML('GUID', tmpGUID, tmpIcon); }
		if ((tmpInfo.length < 1) && !tmpCopies) { return ''; }
		return `<div class="psrs-card-audit"><div class="psrs-card-audit-info">${tmpInfo.join('<span class="psrs-card-audit-sep">·</span>')}</div>`
			+ `<div class="psrs-card-audit-copy">${tmpCopies}</div></div>`;
	}

	_copyButtonHTML(pLabel, pValue, pIcon)
	{
		const tmpValue = this._escapeAttribute(String(pValue));
		return `<button type="button" class="psrs-card-copy" title="${tmpValue}" data-copy="${tmpValue}" onclick="event.stopPropagation();_Pict.providers.RecordSetCardManager.copyValue(this.getAttribute('data-copy'),this)">${pIcon}<span>${this._escapeHTML(pLabel)}</span></button>`;
	}

	/** The card's configured actions (View, …) + the global Audit toggle pushed to the right. */
	_richActionsHTML(pConfig, pRecord, pOptions)
	{
		let tmpActions = '';
		(Array.isArray(pConfig.Actions) ? pConfig.Actions : []).forEach((pAction) => { tmpActions += this._actionHTML(pAction, pRecord); });
		const tmpAuditToggle = (pOptions && (pOptions.Audit === false)) ? ''
			: `<label class="psrs-card-audit-toggle"><input type="checkbox" ${this.getAuditEnabled() ? 'checked ' : ''}onclick="event.stopPropagation();_Pict.providers.RecordSetCardManager.toggleAudit()" /><span>Audit</span></label>`;
		if (!tmpActions && !tmpAuditToggle) { return ''; }
		return `<div class="psrs-card-actions">${tmpActions}${tmpAuditToggle}</div>`;
	}

	/** Build one action anchor/button, resolving its Route/URL template + icon against the record. */
	_actionHTML(pAction, pRecord)
	{
		const tmpIcon = (pAction.Icon && (typeof this.pict.icon === 'function')) ? this.pict.icon(pAction.Icon) : '';
		const tmpLabel = `${tmpIcon}<span>${this._escapeHTML(pAction.Label || 'Open')}</span>`;
		if (pAction.URL)
		{
			return `<a class="psrs-card-action" href="${this._escapeAttribute(this._resolveText(pAction.URL, pRecord))}" target="_blank" rel="noopener" onclick="_Pict.providers.RecordSetCardManager.closeCard()">${tmpLabel}</a>`;
		}
		if (pAction.Route)
		{
			return `<a class="psrs-card-action" href="${this._escapeAttribute(this._resolveText(pAction.Route, pRecord))}" onclick="_Pict.providers.RecordSetCardManager.closeCard()">${tmpLabel}</a>`;
		}
		if (pAction.Handler)
		{
			return `<button type="button" class="psrs-card-action" onclick="_Pict.providers.RecordSetCardManager.closeCard(); ${pAction.Handler}">${tmpLabel}</button>`;
		}
		return '';
	}

	/** Resolve a field-name-or-template config value against a record into a plain string. */
	_resolveText(pValue, pRecord)
	{
		try { return this.pict.parseTemplate(this._valueTemplate(pValue), pRecord); }
		catch (pError) { return ''; }
	}

	_deriveTitle(pRecord, pCard)
	{
		return pRecord.Name || pRecord.Title || pRecord.DisplayName
			|| `${pCard.Entity} #${(pRecord[pCard.IDField] != null) ? pRecord[pCard.IDField] : ''}`;
	}

	/** `MaterialCode` → `Material Code`, `mix_id` → `mix id`. */
	_humanizeLabel(pKey)
	{
		return String(pKey).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
	}

	/** Human-readable date — `Jun 21, 2026 05:47` (or `Jun 21, 2026` with no time) from an ISO string. */
	_fmtDate(pDate)
	{
		const tmpString = String((pDate == null) ? '' : pDate);
		const tmpMatch = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(tmpString);
		if (!tmpMatch) { return tmpString; }
		const tmpMonths = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		const tmpMonth = tmpMonths[parseInt(tmpMatch[2], 10) - 1] || tmpMatch[2];
		let tmpResult = `${tmpMonth} ${parseInt(tmpMatch[3], 10)}, ${tmpMatch[1]}`;
		if (tmpMatch[4]) { tmpResult += ` ${tmpMatch[4]}:${tmpMatch[5]}`; }
		return tmpResult;
	}

	_escapeHTML(pValue)
	{
		return String((pValue == null) ? '' : pValue).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	_escapeAttribute(pValue)
	{
		return String((pValue == null) ? '' : pValue).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	// --- Audit toggle (global, persisted) + clipboard copy ---

	/** Whether the audit stripe is globally enabled (localStorage, with an in-memory fallback). */
	getAuditEnabled()
	{
		try
		{
			if (typeof window !== 'undefined' && window.localStorage) { return window.localStorage.getItem('RecordSetCardManager.AuditStripe') === 'true'; }
		}
		catch (pError) { /* fall through to the in-memory copy */ }
		return !!this._auditEnabled;
	}

	setAuditEnabled(pEnabled)
	{
		this._auditEnabled = !!pEnabled;
		try
		{
			if (typeof window !== 'undefined' && window.localStorage) { window.localStorage.setItem('RecordSetCardManager.AuditStripe', String(!!pEnabled)); }
		}
		catch (pError) { /* in-memory only */ }
	}

	/** Flip the global audit setting and repaint the open card so its stripe shows/hides immediately. */
	toggleAudit()
	{
		this.setAuditEnabled(!this.getAuditEnabled());
		if (!this._lastShow) { return; }
		const tmpLast = this._lastShow;
		if (this.getAuditEnabled())
		{
			return this._resolveAuditUsers(tmpLast.Record, () => this._renderAndShow(tmpLast.Card, tmpLast.Record, tmpLast.Anchor, tmpLast.Key, tmpLast.Options));
		}
		return this._renderAndShow(tmpLast.Card, tmpLast.Record, tmpLast.Anchor, tmpLast.Key, tmpLast.Options);
	}

	/** Copy a value (an ID / GUID) to the clipboard with a brief confirmation on the button. */
	copyValue(pValue, pButton)
	{
		try
		{
			if ((typeof navigator !== 'undefined') && navigator.clipboard && (typeof navigator.clipboard.writeText === 'function'))
			{
				navigator.clipboard.writeText(String((pValue == null) ? '' : pValue));
			}
		}
		catch (pError) { /* clipboard unavailable */ }
		if (pButton && pButton.classList)
		{
			pButton.classList.add('psrs-card-copied');
			setTimeout(() => { if (pButton.classList) { pButton.classList.remove('psrs-card-copied'); } }, 1100);
		}
	}

	_ensurePopover()
	{
		if (typeof document === 'undefined') { return null; }
		let tmpPopover = document.getElementById(this._popoverElementID);
		if (!tmpPopover)
		{
			tmpPopover = document.createElement('div');
			tmpPopover.id = this._popoverElementID;
			tmpPopover.className = 'psrs-card-popover';
			document.body.appendChild(tmpPopover);
		}
		return tmpPopover;
	}

	/** Anchor the popover under the trigger, flipping above / clamping horizontally near the viewport edge. */
	_position(pPopover, pAnchorElement)
	{
		if (!pAnchorElement || (typeof pAnchorElement.getBoundingClientRect !== 'function')) { return; }
		const tmpRect = pAnchorElement.getBoundingClientRect();
		// Measure with the card laid out but invisible.
		pPopover.style.top = '-9999px';
		pPopover.style.left = '0px';
		const tmpWidth = pPopover.offsetWidth;
		const tmpHeight = pPopover.offsetHeight;
		const tmpScrollX = window.scrollX || window.pageXOffset || 0;
		const tmpScrollY = window.scrollY || window.pageYOffset || 0;
		const tmpGap = 6;

		let tmpLeft = tmpRect.left + tmpScrollX;
		const tmpMaxLeft = tmpScrollX + window.innerWidth - tmpWidth - 8;
		if (tmpLeft > tmpMaxLeft) { tmpLeft = Math.max(tmpScrollX + 8, tmpMaxLeft); }

		let tmpTop = tmpRect.bottom + tmpScrollY + tmpGap;
		// Flip above when there's not enough room below.
		if ((tmpRect.bottom + tmpHeight + tmpGap > window.innerHeight) && (tmpRect.top - tmpHeight - tmpGap > 0))
		{
			tmpTop = tmpRect.top + tmpScrollY - tmpHeight - tmpGap;
		}
		// Clamp vertically so a tall (rich) card never runs off-screen — it scrolls internally past max-height.
		const tmpBottomLimit = tmpScrollY + window.innerHeight - 8;
		if (tmpTop + tmpHeight > tmpBottomLimit) { tmpTop = Math.max(tmpScrollY + 8, tmpBottomLimit - tmpHeight); }
		pPopover.style.left = `${Math.round(tmpLeft)}px`;
		pPopover.style.top = `${Math.round(tmpTop)}px`;
	}

	_isOpen()
	{
		const tmpPopover = (typeof document !== 'undefined') ? document.getElementById(this._popoverElementID) : null;
		return !!(tmpPopover && tmpPopover.classList.contains('is-open'));
	}

	closeCard()
	{
		const tmpPopover = (typeof document !== 'undefined') ? document.getElementById(this._popoverElementID) : null;
		if (tmpPopover) { tmpPopover.classList.remove('is-open'); }
		this._openForKey = null;
	}

	/**
	 * One-time document handlers that dismiss the card on an outside click or Escape. Browser-level events
	 * with no inline-handler equivalent — bound once, guarded so they never stack.
	 */
	_bindDismiss()
	{
		if (this._dismissBound || (typeof document === 'undefined')) { return; }
		this._dismissBound = true;
		document.addEventListener('click', (pEvent) =>
		{
			if (!this._isOpen()) { return; }
			const tmpPopover = document.getElementById(this._popoverElementID);
			if (tmpPopover && tmpPopover.contains(pEvent.target)) { return; }
			if (pEvent.target && pEvent.target.closest && pEvent.target.closest('.psrs-card-trigger')) { return; }
			this.closeCard();
		});
		document.addEventListener('keydown', (pEvent) =>
		{
			if ((pEvent.key === 'Escape') && this._isOpen()) { this.closeCard(); }
		});
	}
}

module.exports = RecordSetCardManager;
module.exports.default_configuration = _DEFAULT_CONFIGURATION;
