
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_NumericRange =
{
	ViewIdentifier: 'PRSP-FilterType-NumericRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-NumericRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-NumericRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-NumericRange-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterNumericRange extends ViewRecordSetSUBSETFilterBaseRange
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
		return 'PRSP-Filter-NumericRange-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterNumericRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterNumericRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_NumericRange);
