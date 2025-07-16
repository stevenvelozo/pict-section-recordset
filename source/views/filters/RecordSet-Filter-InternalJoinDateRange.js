
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateRange =
{
	ViewIdentifier: 'PRSP-FilterType-InternalJoinDateRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-DateRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-DateRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-DateRange-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinDateRange extends ViewRecordSetSUBSETFilterBaseRange
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
		return 'PRSP-Filter-InternalJoin-DateRange-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinDateRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinDateRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateRange);
