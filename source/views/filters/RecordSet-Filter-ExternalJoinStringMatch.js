
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoinStringMatch =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoinStringMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoinStringMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoinStringMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoinStringMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoinStringMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoinStringMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoinStringMatch',
			TemplateHash: 'PRSP-Filter-ExternalJoinStringMatch-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoinStringMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinStringMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinStringMatch;
module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinStringMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoinStringMatch);

