
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateRange =
{
	ViewIdentifier: 'PRSP-FilterType-ExternalJoinDateRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-DateRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-DateRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-DateRange-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinDateRange extends ViewRecordSetSUBSETFilterBaseRange
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * @param {Record<string, any>} pRecord
	 */
	prepareRecord(pRecord)
	{
		super.prepareRecord(pRecord);

		pRecord.StartClauseDescriptor.DataType = 'DateTime';
		pRecord.EndClauseDescriptor.DataType = 'DateTime';
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-ExternalJoin-DateRange-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinDateRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinDateRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateRange);
