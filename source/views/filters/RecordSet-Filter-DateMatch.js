
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_DateMatch =
{
	ViewIdentifier: 'PRSP-Filter-DateMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_DateMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_DateMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-DateMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-DateMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-DateMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_DateMatch',
			TemplateHash: 'PRSP-Filter-DateMatch-Template',
			DestinationAddress: '#PRSP_Filter_DateMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterDateMatch extends ViewRecordSetSUBSETFilterBase
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
	//{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
		pRecord.ClauseDescriptor.DataType = 'DateTime';
	}
}

module.exports = ViewRecordSetSUBSETFilterDateMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterDateMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_DateMatch);
