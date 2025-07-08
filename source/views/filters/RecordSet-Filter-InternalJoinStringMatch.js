
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringMatch =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-StringMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_InternalJoin_StringMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_InternalJoin_StringMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-StringMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-StringMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.CriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-StringMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_InternalJoin_StringMatch',
			TemplateHash: 'PRSP-Filter-InternalJoin-StringMatch-Template',
			DestinationAddress: '#PRSP_Filter_InternalJoin_StringMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinStringMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinStringMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinStringMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringMatch);
