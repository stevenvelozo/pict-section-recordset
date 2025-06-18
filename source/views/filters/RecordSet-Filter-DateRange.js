
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

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
	{~MTIWHA:Start Date:Context[0].filter.Start:DateTime~}
	{~MTIWHA:End Date:Context[0].filter.End:DateTime~}
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

	Manifests: {},
};

class ViewRecordSetSUBSETFilterDateRange extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
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
			this.filter = this.addFilterClauseType('DateRange');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterDateRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterDateRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_DateRange);

