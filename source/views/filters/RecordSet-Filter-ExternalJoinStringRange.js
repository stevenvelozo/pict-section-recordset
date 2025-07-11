
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_StringRange =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-StringRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_StringRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_StringRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-StringRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-StringRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-StringRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_StringRange',
			TemplateHash: 'PRSP-Filter-ExternalJoin-StringRange-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_StringRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinStringRange extends ViewRecordSetSUBSETFilterBaseRange
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinStringRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinStringRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_StringRange);
