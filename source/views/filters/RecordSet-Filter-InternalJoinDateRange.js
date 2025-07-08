
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateRange =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-DateRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_InternalJoin_DateRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_InternalJoin_DateRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-DateRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-DateRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartCriterionDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndCriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-DateRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_InternalJoin_DateRange',
			TemplateHash: 'PRSP-Filter-InternalJoin-DateRange-Template',
			DestinationAddress: '#PRSP_Filter_InternalJoin_DateRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinDateRange extends ViewRecordSetSUBSETFilterBaseRange
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

		pRecord.StartCriterionDescriptor.DataType = 'DateTime';
		pRecord.EndCriterionDescriptor.DataType = 'DateTime';
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinDateRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinDateRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateRange);
