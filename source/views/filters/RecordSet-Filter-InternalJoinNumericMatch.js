
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericMatch =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-NumericMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_InternalJoin_NumericMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_InternalJoin_NumericMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-NumericMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-NumericMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.CriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-NumericMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_InternalJoin_NumericMatch',
			TemplateHash: 'PRSP-Filter-InternalJoin-NumericMatch-Template',
			DestinationAddress: '#PRSP_Filter_InternalJoin_NumericMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinNumericMatch extends ViewRecordSetSUBSETFilterBase
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

module.exports = ViewRecordSetSUBSETFilterInternalJoinNumericMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinNumericMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericMatch);
