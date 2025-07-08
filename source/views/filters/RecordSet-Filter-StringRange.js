
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_StringRange =
{
	ViewIdentifier: 'PRSP-Filter-StringRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_StringRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_StringRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-StringRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-StringRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartCriterionDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndCriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-StringRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_StringRange',
			TemplateHash: 'PRSP-Filter-StringRange-Template',
			DestinationAddress: '#PRSP_Filter_StringRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterStringRange extends ViewRecordSetSUBSETFilterBaseRange
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = ViewRecordSetSUBSETFilterStringRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterStringRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_StringRange);
