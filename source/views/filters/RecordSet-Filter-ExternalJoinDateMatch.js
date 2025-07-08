
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateMatch =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-DateMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_DateMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_DateMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-DateMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-DateMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.CriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-DateMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_DateMatch',
			TemplateHash: 'PRSP-Filter-ExternalJoin-DateMatch-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_DateMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinDateMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * Hook to prepare state on the render record before rendering.
	 *
	 * @param {Record<string, any>} pRecord - The record used for view rendering.
	 */
	prepareRecord(pRecord)
	{
		pRecord.CriterionDescriptor.DataType = 'DateTime';
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinDateMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinDateMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateMatch);
