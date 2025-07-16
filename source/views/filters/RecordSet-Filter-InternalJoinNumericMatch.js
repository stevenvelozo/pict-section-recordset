
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericMatch =
{
	ViewIdentifier: 'PRSP-FilterType-InternalJoinNumericMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-NumericMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-NumericMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-NumericMatch-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinNumericMatch extends ViewRecordSetSUBSETFilterBase
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

		pRecord.ClauseDescriptor.DataType = 'Number';
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-InternalJoin-NumericMatch-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinNumericMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinNumericMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericMatch);
