
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericRange =
{
	ViewIdentifier: 'PRSP-FilterType-ExternalJoinNumericRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-NumericRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-NumericRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-NumericRange-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinNumericRange extends ViewRecordSetSUBSETFilterBaseRange
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

		pRecord.StartClauseDescriptor.DataType = 'Number';
		pRecord.EndClauseDescriptor.DataType = 'Number';
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-ExternalJoin-NumericRange-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinNumericRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinNumericRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericRange);
