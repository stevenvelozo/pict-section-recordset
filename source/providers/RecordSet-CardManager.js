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

	.psrs-card-popover { position: absolute; z-index: 4000; min-width: 16rem; max-width: 22rem;
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
	.psrs-card-custom { font-size: 0.9rem; color: var(--theme-color-text-primary, #1f2733); }
	.psrs-card-actions { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.85rem; padding-top: 0.7rem; border-top: 1px solid var(--theme-color-border-light, #eef1f5); }
	.psrs-card-action { display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer; font: inherit; font-size: 0.82rem; font-weight: 600;
		text-decoration: none; padding: 0.3rem 0.7rem; border-radius: 7px; border: 1px solid var(--theme-color-border-default, #d7dce3);
		background: var(--theme-color-background-secondary, #f5f6f8); color: var(--theme-color-text-secondary, #45505f); }
	.psrs-card-action:hover { border-color: var(--theme-color-brand-primary, #156dd1); color: var(--theme-color-brand-primary, #156dd1); background: var(--theme-color-background-selected, #e3edfb); }
	.psrs-card-action .pict-icon { font-size: 0.9em; }
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
	openCard(pRecordSetName, pIDOrRecord, pAnchorElement)
	{
		const tmpCard = this._cards[pRecordSetName];
		if (!tmpCard) { return; }
		// Toggle off if the same trigger is clicked while open.
		const tmpKey = `${pRecordSetName}:${(typeof pIDOrRecord === 'object') ? '' : pIDOrRecord}`;
		if (this._openForKey === tmpKey && this._isOpen())
		{
			this.closeCard();
			return;
		}

		if (pIDOrRecord && (typeof pIDOrRecord === 'object'))
		{
			this._renderAndShow(tmpCard, pIDOrRecord, pAnchorElement, tmpKey);
			return;
		}
		this.pict.EntityProvider.getEntity(tmpCard.Entity, pIDOrRecord, (pError, pRecord) =>
		{
			if (pError || !pRecord)
			{
				this.log.warn(`RecordSetCardManager: could not load ${tmpCard.Entity} ${pIDOrRecord} for its preview card.`, pError);
				return;
			}
			this._renderAndShow(tmpCard, pRecord, pAnchorElement, tmpKey);
		});
	}

	_renderAndShow(pCard, pRecord, pAnchorElement, pKey)
	{
		// Cards use synchronous template tags ({~D:~}, {~I:~}, formatters) so a sync parse is correct and
		// avoids a flash; the record is already in hand here.
		let tmpHTML = '';
		try { tmpHTML = this.pict.parseTemplateByHash(pCard.TemplateHash, pRecord); }
		catch (pError) { this.log.error(`RecordSetCardManager: card render failed for ${pCard.TemplateHash}.`, pError); return; }
		const tmpPopover = this._ensurePopover();
		if (!tmpPopover) { return; }
		tmpPopover.innerHTML = tmpHTML;
		// Drop any field whose value rendered empty so a card never shows a "LABEL: (blank)" row — the
		// configured Fields are static, but which ones have data varies per record.
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
		this.pict.CSSMap.injectCSS();
		this._openForKey = pKey;
		this._position(tmpPopover, pAnchorElement);
		tmpPopover.classList.add('is-open');
		this._bindDismiss();
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
