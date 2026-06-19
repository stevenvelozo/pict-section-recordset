const libPictTemplate = require('pict-template');

/**
 * The `{~RecordCard:RecordSet^IDAddress^Label~}` template tag — drops an inline preview-card trigger
 * (a label + a small icon) anywhere a record is referenced (lists, record views, dashboards). Clicking
 * it opens the recordset's configured preview card in an anchored popover (see RecordSet-CardManager).
 *
 * Three `^`-separated parts (the third is optional):
 *   1. RecordSet name (literal, e.g. `Author`).
 *   2. The record id — a literal number OR an address resolved against the current data (`Record.IDAuthor`).
 *   3. The visible label — an address (`Record.Name`) OR a literal string. Defaults to the id.
 *
 * Unlike `{~E:~}` this renders synchronously (no fetch): it only emits the trigger; the record is fetched
 * lazily on click. When no card is registered for the recordset it degrades to the plain label.
 */
class PictTemplateProviderRecordCard extends libPictTemplate
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		/** @type {any} */
		this.log;

		this.addPattern('{~RecordCard:', '~}');
		this.addPattern('{~RC:', '~}');
	}

	render(pTemplateHash, pRecord, pContextArray, pScope, pState)
	{
		const tmpParts = String(pTemplateHash).trim().split('^');
		if (tmpParts.length < 2)
		{
			this.log.warn(`Pict: RecordCard tag needs at least RecordSet^id — got [${pTemplateHash}].`);
			return '';
		}

		let tmpRecordSet = tmpParts[0].trim();
		let tmpID = tmpParts[1].trim();
		let tmpLabel = (tmpParts.length > 2) ? tmpParts[2].trim() : '';

		// Resolve the recordset: a literal name stays, an address (Record./AppData.) is looked up. This
		// lets a shared template (e.g. an association row) drive the card's recordset from data — an empty
		// result degrades to the plain label.
		if (/^(Record|AppData)[.[]/.test(tmpRecordSet))
		{
			tmpRecordSet = this.resolveStateFromAddress(tmpRecordSet, pRecord, pContextArray, null, pScope, pState);
		}

		// Resolve the id: a literal number stays, otherwise it is an address into the data.
		if (isNaN(Number(tmpID)))
		{
			tmpID = this.resolveStateFromAddress(tmpID, pRecord, pContextArray, null, pScope, pState);
		}

		// Resolve the label: an address (Record./AppData.) is looked up, otherwise it is a literal.
		if (tmpLabel && /^(Record|AppData)[.[]/.test(tmpLabel))
		{
			tmpLabel = this.resolveStateFromAddress(tmpLabel, pRecord, pContextArray, null, pScope, pState);
		}
		if (tmpLabel == null || tmpLabel === '')
		{
			tmpLabel = (tmpID == null) ? '' : String(tmpID);
		}

		const tmpManager = this.pict.providers.RecordSetCardManager;
		if (!tmpManager)
		{
			return String(tmpLabel);
		}
		return tmpManager.triggerHTML(tmpRecordSet, tmpID, tmpLabel);
	}

	/** Async entry just defers to the synchronous render (no fetch happens here — it is click-driven). */
	renderAsync(pTemplateHash, pRecord, fCallback, pContextArray, pScope, pState)
	{
		const tmpCallback = (typeof fCallback === 'function') ? fCallback : () => '';
		return tmpCallback(null, this.render(pTemplateHash, pRecord, pContextArray, pScope, pState));
	}
}

module.exports = PictTemplateProviderRecordCard;
