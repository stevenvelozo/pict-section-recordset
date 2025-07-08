
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_DateRange =
{
	ViewIdentifier: 'PRSP-Filter-DateRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_DateRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_DateRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-DateRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-DateRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartCriterionDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndCriterionDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-DateRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_DateRange',
			TemplateHash: 'PRSP-Filter-DateRange-Template',
			DestinationAddress: '#PRSP_Filter_DateRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterDateRange extends ViewRecordSetSUBSETFilterBaseRange
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

	/**
	 * FIXME: this be wrong
	 *
	 * @param {(error?: Error) => void} fCallback
	 * @return {void}
	 */
	onBeforeInitializeAsync(fCallback)
	{
		return super.onBeforeInitializeAsync((pError) =>
		{
			/** @type {import('pict/types/source/filters/FilterClauseLocal')} */
			//this.filter = this.addFilterClauseType('DateRange');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterDateRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterDateRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_DateRange);

