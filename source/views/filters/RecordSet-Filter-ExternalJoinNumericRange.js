
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericRange =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-NumericRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_NumericRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_NumericRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-NumericRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-NumericRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-NumericRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_NumericRange',
			TemplateHash: 'PRSP-Filter-ExternalJoin-NumericRange-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_NumericRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinNumericRange extends ViewRecordSetSUBSETFilterBaseRange
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

module.exports = ViewRecordSetSUBSETFilterExternalJoinNumericRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinNumericRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericRange);
