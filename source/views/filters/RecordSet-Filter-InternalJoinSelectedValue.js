
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

const _DEFAULT_CONFIGURATION_Filter_InternalJoin_SelectedValue =
{
	ViewIdentifier: 'PRSP-FilterType-InternalJoinSelectedValue',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-SelectedValue-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-SelectedValue-Template] -->
	<table>
		<tbody>
		<td valign="top">{~T:PRSP-Filter-InternalJoin-SelectedValue-SearchResults~}</td><td valign="top">{~T:PRSP-Filter-InternalJoin-SelectedValue-SelectedValues~}</td>
		</tbody>
	</table>
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-SelectedValue-Template] -->
`
		},
		{
			Hash: 'PRSP-Filter-InternalJoin-SelectedValue-SearchResults',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-SelectedValue-SearchResults] -->
	<form id="PRSP_Filter_{~D:Record.Hash~}_Search_Form" onsubmit="_Pict.views['{~D:Context[0].Hash~}'].performSearch(event, '{~D:Record.ClauseAddress~}', '{~D:Record.Hash~}'); return false;">
		<input id="PRSP_Filter_{~D:Record.Hash~}_Search_Value" type="text" placeholder="Search..." value="{~D:Record.SearchInputValue~}" />
		<button type="submit" id="PRSP_Filter_{~D:Record.Hash~}_Button_Search" onclick="_Pict.views['{~D:Context[0].Hash~}'].performSearch(event, '{~D:Record.ClauseAddress~}', '{~D:Record.Hash~}')">Search</button>
	</form>
	<table>
		<thead>
			<tr><th colspan="2">{~D:Record.Label~}</th></tr>
		</thead>
		<tbody>
			{~TSWP:PRSP-Filter-InternalJoin-SelectedValue-SearchResults-Entry:Record.SearchResults:Record~}
		</tbody>
	</table>
	<button type="button" id="PRSP_Filter_{~D:Record.Hash~}_Button_LoadMore" class="is-hidden" onclick="_Pict.views['{~D:Context[0].Hash~}'].loadMore(event, '{~D:Record.ClauseAddress~}', '{~D:Record.Hash~}', {~D:Record.SearchResultsOffset:0~})">Load More</button>
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-SelectedValue-SearchResults] -->
`
		},
		{
			Hash: 'PRSP-Filter-InternalJoin-SelectedValue-SelectedValues',
			Template: /*html*/`
	<!-- DefaultPackage view template:	[PRSP-Filter-InternalJoin-SelectedValue-SelectedValues] -->
	<table>
		<thead>
			<tr><th colspan="2">Selection</th></tr>
		</thead>
		<tbody>
			{~TSWP:PRSP-Filter-InternalJoin-SelectedValue-SelectedValues-Entry:Record.SelectedValues:Record~}
		</tbody>
	</table>
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-SelectedValue-SelectedValues] -->
`
		},
		{
			Hash: 'PRSP-Filter-InternalJoin-SelectedValue-SearchResults-Entry',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-SelectedValue-Template] -->
	<tr><td><button onclick="_Pict.views['{~D:Context[0].Hash~}'].handleSelect(event, {~DVBK:Record.Data:Record.Payload.ExternalFilterTableLookupColumn~}, '{~D:Record.Payload.ClauseAddress~}', '{~D:Record.Payload.Hash~}')">Select</button></td><td>{~TFA:Record.Payload.ExternalRecordDisplayTemplate:Record~}</td></tr>
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-SelectedValue-Template] -->
`
		},
		{
			Hash: 'PRSP-Filter-InternalJoin-SelectedValue-SelectedValues-Entry',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-SelectedValue-SelectedValues-Entry] -->
	<tr><td><button onclick="_Pict.views['{~D:Context[0].Hash~}'].handleRemove(event, {~DVBK:Record.Data:Record.Payload.ExternalFilterTableLookupColumn~}, '{~D:Record.Payload.ClauseAddress~}', '{~D:Record.Payload.Hash~}')">Remove</button></td><td>{~TFA:Record.Payload.ExternalRecordDisplayTemplate:Record~}</td></tr>
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-SelectedValue-SelectedValues-Entry] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinSelectedValue extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		if (!pOptions.PageSize)
		{
			pOptions.PageSize = 15; // default page size for search results
		}
		super(pFable, pOptions, pServiceHash);
		/*
		 * show / hide the complex editor since it'll be large ?
		 * selected record lookup values
		 * using bundle to load those records (if any)
		 * templating out the selection
		 * templating out the search results
		 * controls to add search result values to selection
		 */
	}

	/**
	 * @param {Record<string, any>} pRecord
	 */
	prepareRecord(pRecord)
	{
		super.prepareRecord(pRecord);

		pRecord.ClauseDescriptor.DataType = 'Number';
		if (!pRecord.ExternalFilterTableLookupColumn)
		{
			pRecord.ExternalFilterTableLookupColumn = `ID${pRecord.RemoteTable}`;
		}
		if (!pRecord.SearchResults)
		{
			pRecord.SearchResults = [];
		}
		if (!pRecord.SelectedValues)
		{
			pRecord.SelectedValues = [];
		}
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-InternalJoin-SelectedValue-Template';
	}

	/**
	 * @param {UIEvent} pEvent
	 * @param {string} pClauseInformaryAddress
	 * @param {string} pClauseHash
	 */
	loadMore(pEvent, pClauseInformaryAddress, pClauseHash, pCurrentOffset = 0)
	{
		this.performSearch(pEvent, pClauseInformaryAddress, pClauseHash, pCurrentOffset + this.options.PageSize);
	}

	/**
	 * @param {UIEvent} pEvent
	 * @param {string} pClauseInformaryAddress
	 * @param {string} pClauseHash
	 * @param {number} [pOffset=0] - The offset for the search results, defaults to 0
	 */
	performSearch(pEvent, pClauseInformaryAddress, pClauseHash, pOffset = 0)
	{
		pEvent.preventDefault();
		const tmpClause = this.getInformaryScopedValue(pClauseInformaryAddress);
		if (!tmpClause)
		{
			this.pict.log.error(`[Filter-InternalJoinSelectedValue]  No clause found for address: ${pClauseInformaryAddress}`);
			return;
		}
		tmpClause.SearchResultsOffset = pOffset;
		// get the input value (search box)
		const tmpSearchInputValue = pOffset > 0 ? tmpClause.SearchInputValue : this.pict.ContentAssignment.readContent(`#PRSP_Filter_${tmpClause.Hash}_Search_Value`);
		tmpClause.SearchInputValue = tmpSearchInputValue;
		if (!tmpSearchInputValue)
		{
			tmpClause.SearchResults = [];
			tmpClause.LoadMoreEnabled = false;
			const tmpRecord = Object.assign({ ClauseAddress: pClauseInformaryAddress }, tmpClause);
			this.prepareRecord(tmpRecord);
			const tmpDestinationAddress = `#PRSP_Filter_Container_${pClauseHash}`;
			this.render(null, tmpDestinationAddress, tmpRecord);
			return;
		}
		const tmpFilterByColumns = tmpClause.ExternalFilterByColumns || (tmpClause.ExternalFilterByColumn ? [ tmpClause.ExternalFilterByColumn ] : [ 'Name' ]);
		const tmpMeadowFilter = tmpFilterByColumns.map((pColumn) => `FBVOR~${pColumn}~LK~${encodeURIComponent(`%${tmpSearchInputValue}%`)}`).join('~');
		// bundle load the remote records and put them in the clause
		this.pict.EntityProvider.gatherDataFromServer(
			[
				{
					Entity: tmpClause.RemoteTable,
					Filter: tmpMeadowFilter,
					Destination: pOffset > 0 ? `${this.getInformaryAddressPrefix()}${pClauseInformaryAddress}.SearchResultsAppend` : `${this.getInformaryAddressPrefix()}${pClauseInformaryAddress}.SearchResults`,
					RecordStartCursor: pOffset,
					PageSize: this.options.PageSize,
				}
			],
			(pError, pResult) =>
			{
				if (pOffset > 0 && tmpClause.SearchResultsAppend?.length > 0)
				{
					tmpClause.SearchResults = tmpClause.SearchResults.concat(tmpClause.SearchResultsAppend);
				}
				delete tmpClause.SearchResultsAppend;
				tmpClause.SearchResultsOffset = pOffset;
				const tmpRecord = Object.assign({ ClauseAddress: pClauseInformaryAddress }, tmpClause);
				this.prepareRecord(tmpRecord);
				const tmpDestinationAddress = `#PRSP_Filter_Container_${pClauseHash}`;
				this.render(null, tmpDestinationAddress, tmpRecord);
				const tmpLoadedRecords = pOffset > 0 ? tmpClause.SearchResultsAppend : tmpClause.SearchResults;
				const tmpLoadMoreEnabled = tmpLoadedRecords && tmpLoadedRecords.length >= this.options.PageSize;
				tmpClause.LoadMoreEnabled = tmpLoadMoreEnabled;
				if (tmpClause.LoadMoreEnabled)
				{
					this.pict.ContentAssignment.removeClass(`#PRSP_Filter_${tmpClause.Hash}_Button_LoadMore`, 'is-hidden');
				}
			});
	}

	handleSelect(pEvent, pRecordLookupValue, pClauseInformaryAddress, pClauseHash)
	{
		pEvent.preventDefault();
		const tmpClause = this.getInformaryScopedValue(pClauseInformaryAddress);
		if (!tmpClause)
		{
			this.pict.log.error(`[Filter-InternalJoinSelectedValue]  No clause found for address: ${pClauseInformaryAddress}`);
			return;
		}
		const tmpRecordLookupColumn = tmpClause.ExternalFilterTableLookupColumn || `ID${tmpClause.RemoteTable}`;
		const tmpRecordToSelect = tmpClause.SearchResults.find((r) => r[tmpRecordLookupColumn] == pRecordLookupValue);
		if (!tmpRecordToSelect)
		{
			this.pict.log.error(`[Filter-InternalJoinSelectedValue]  No record found to add for value: ${pRecordLookupValue}`);
			return;
		}
		if (!tmpClause.SelectedValues)
		{
			tmpClause.SelectedValues = [];
		}
		if (tmpClause.SelectedValues.some((pSV) => pSV[tmpRecordLookupColumn] == pRecordLookupValue))
		{
			return;
		}
		const tmpValue = tmpRecordToSelect[tmpRecordLookupColumn];
		if (tmpValue == null)
		{
			this.pict.log.error(`[Filter-InternalJoinSelectedValue]  No value found in record to add: ${JSON.stringify(tmpRecordToSelect)}`);
			return;
		}
		tmpClause.SelectedValues = [ tmpRecordToSelect ];
		tmpClause.Values = [ tmpValue ];
		const tmpRecord = Object.assign({ ClauseAddress: pClauseInformaryAddress }, tmpClause);
		this.prepareRecord(tmpRecord);
		const tmpDestinationAddress = `#PRSP_Filter_Container_${pClauseHash}`;
		this.render(null, tmpDestinationAddress, tmpRecord);
		if (tmpClause.LoadMoreEnabled)
		{
			this.pict.ContentAssignment.removeClass(`#PRSP_Filter_${tmpClause.Hash}_Button_LoadMore`, 'is-hidden');
		}
	}

	handleRemove(pEvent, pRecordLookupValue, pClauseInformaryAddress, pClauseHash)
	{
		pEvent.preventDefault();
		const tmpClause = this.getInformaryScopedValue(pClauseInformaryAddress);
		if (!tmpClause)
		{
			this.pict.log.error(`[Filter-InternalJoinSelectedValue]  No clause found for address: ${pClauseInformaryAddress}`);
			return;
		}
		const tmpRecordLookupColumn = tmpClause.ExternalFilterTableLookupColumn || `ID${tmpClause.RemoteTable}`;
		const tmpRecordIndexToRemove = tmpClause.SelectedValues.findIndex((r) => r[tmpRecordLookupColumn] == pRecordLookupValue);
		if (tmpRecordIndexToRemove < 0)
		{
			this.pict.log.error(`[Filter-InternalJoinSelectedValue]  No record found to remove for value: ${pRecordLookupValue}`);
			return;
		}
		const tmpRecordToRemove = tmpClause.SelectedValues.splice(tmpRecordIndexToRemove, 1)[0];
		const tmpValue = tmpRecordToRemove[tmpRecordLookupColumn];
		tmpClause.Values = tmpClause.Values.filter((pV) => pV !== tmpValue);
		const tmpRecord = Object.assign({ ClauseAddress: pClauseInformaryAddress }, tmpClause);
		this.prepareRecord(tmpRecord);
		const tmpDestinationAddress = `#PRSP_Filter_Container_${pClauseHash}`;
		this.render(null, tmpDestinationAddress, tmpRecord);
		if (tmpClause.LoadMoreEnabled)
		{
			this.pict.ContentAssignment.removeClass(`#PRSP_Filter_${tmpClause.Hash}_Button_LoadMore`, 'is-hidden');
		}
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinSelectedValue;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinSelectedValue.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_SelectedValue);
