
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateRange =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-DateRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_DateRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_DateRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-DateRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-DateRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-DateRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_DateRange',
			TemplateHash: 'PRSP-Filter-ExternalJoin-DateRange-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_DateRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinDateRange extends ViewRecordSetSUBSETFilterBaseRange
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

		pRecord.StartClauseDescriptor.DataType = 'DateTime';
		pRecord.EndClauseDescriptor.DataType = 'DateTime';
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinDateRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinDateRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateRange);
