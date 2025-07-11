
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericMatch =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-NumericMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_NumericMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_NumericMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-NumericMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-NumericMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-NumericMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_NumericMatch',
			TemplateHash: 'PRSP-Filter-ExternalJoin-NumericMatch-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_NumericMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinNumericMatch extends ViewRecordSetSUBSETFilterBase
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

		pRecord.ClauseDescriptor.DataType = 'Number';
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinNumericMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinNumericMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericMatch);
