
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringRange =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-StringRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_InternalJoin_StringRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_InternalJoin_StringRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-StringRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-StringRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartCriterionDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndCriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-StringRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_InternalJoin_StringRange',
			TemplateHash: 'PRSP-Filter-InternalJoin-StringRange-Template',
			DestinationAddress: '#PRSP_Filter_InternalJoin_StringRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinStringRange extends ViewRecordSetSUBSETFilterBaseRange
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinStringRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinStringRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringRange);
