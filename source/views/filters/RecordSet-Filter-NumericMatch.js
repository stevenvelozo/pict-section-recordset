
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_NumericMatch =
{
	ViewIdentifier: 'PRSP-Filter-NumericMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_NumericMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_NumericMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-NumericMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-NumericMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.CriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-NumericMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_NumericMatch',
			TemplateHash: 'PRSP-Filter-NumericMatch-Template',
			DestinationAddress: '#PRSP_Filter_NumericMatch_Container',
			RenderMethod: 'replace'
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

		pRecord.CriterionDescriptor.DataType = 'Number';
	}
}

module.exports = ViewRecordSetSUBSETFilterNumericMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterNumericMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_NumericMatch);
