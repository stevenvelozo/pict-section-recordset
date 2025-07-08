
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_NumericRange =
{
	ViewIdentifier: 'PRSP-Filter-NumericRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_NumericRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_NumericRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-NumericRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-NumericRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartCriterionDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndCriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-NumericRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_NumericRange',
			TemplateHash: 'PRSP-Filter-NumericRange-Template',
			DestinationAddress: '#PRSP_Filter_NumericRange_Container',
			RenderMethod: 'replace'
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

		pRecord.StartCriterionDescriptor.DataType = 'Number';
		pRecord.EndCriterionDescriptor.DataType = 'Number';
	}
}

module.exports = ViewRecordSetSUBSETFilterNumericRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterNumericRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_NumericRange);
