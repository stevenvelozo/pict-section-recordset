
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateMatch =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-DateMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_InternalJoin_DateMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_InternalJoin_DateMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-DateMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-DateMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-DateMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_InternalJoin_DateMatch',
			TemplateHash: 'PRSP-Filter-InternalJoin-DateMatch-Template',
			DestinationAddress: '#PRSP_Filter_InternalJoin_DateMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinDateMatch extends ViewRecordSetSUBSETFilterBase
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

		pRecord.ClauseDescriptor.DataType = 'DateTime';
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinDateMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinDateMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateMatch);
