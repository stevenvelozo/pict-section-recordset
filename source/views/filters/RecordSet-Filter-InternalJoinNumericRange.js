
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericRange =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-NumericRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_InternalJoin_NumericRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_InternalJoin_NumericRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-NumericRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-NumericRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-NumericRange-Template] -->
`
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_InternalJoin_NumericRange',
			TemplateHash: 'PRSP-Filter-InternalJoin-NumericRange-Template',
			DestinationAddress: '#PRSP_Filter_InternalJoin_NumericRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinNumericRange extends ViewRecordSetSUBSETFilterBaseRange
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

		pRecord.StartClauseDescriptor.DataType = 'Number';
		pRecord.EndClauseDescriptor.DataType = 'Number';
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinNumericRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinNumericRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericRange);
