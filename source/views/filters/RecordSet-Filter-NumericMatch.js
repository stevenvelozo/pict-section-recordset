
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_NumericMatch =
{
	ViewIdentifier: 'PRSP-FilterType-NumericMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-NumericMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-NumericMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-NumericMatch-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterNumericMatch extends ViewRecordSetSUBSETFilterBase
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

		pRecord.ClauseDescriptor.DataType = pRecord.DataType || 'Number';
		pRecord.ClauseDescriptor.PictForm = pRecord.PictForm || {};
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-NumericMatch-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterNumericMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterNumericMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_NumericMatch);
