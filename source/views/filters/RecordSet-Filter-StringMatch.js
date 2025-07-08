
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_StringMatch =
{
	ViewIdentifier: 'PRSP-Filter-StringMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_StringMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_StringMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-StringMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-StringMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.CriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-StringMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_StringMatch',
			TemplateHash: 'PRSP-Filter-StringMatch-Template',
			DestinationAddress: '#PRSP_Filter_StringMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterStringMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = ViewRecordSetSUBSETFilterStringMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterStringMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_StringMatch);
