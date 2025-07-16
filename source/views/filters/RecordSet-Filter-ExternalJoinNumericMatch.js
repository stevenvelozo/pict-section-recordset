
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericMatch =
{
	ViewIdentifier: 'PRSP-FilterType-ExternalJoinNumericMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-NumericMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-NumericMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-NumericMatch-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinNumericMatch extends ViewRecordSetSUBSETFilterBase
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
		return 'PRSP-Filter-ExternalJoin-NumericMatch-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinNumericMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinNumericMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericMatch);
