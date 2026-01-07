
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericRange =
{
	ViewIdentifier: 'PRSP-FilterType-InternalJoinNumericRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-NumericRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-NumericRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-NumericRange-Template] -->
`
		},
	],
};

class ViewRecordSetSUBSETFilterInternalJoinNumericRange extends ViewRecordSetSUBSETFilterBaseRange
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

		pRecord.StartClauseDescriptor.DataType = pRecord.DataType || 'Number';
		pRecord.StartClauseDescriptor.PictForm = pRecord.PictForm || {};
		pRecord.EndClauseDescriptor.DataType = pRecord.DataType || 'Number';
		pRecord.EndClauseDescriptor.PictForm = pRecord.PictForm || {};
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-InternalJoin-NumericRange-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinNumericRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinNumericRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericRange);
