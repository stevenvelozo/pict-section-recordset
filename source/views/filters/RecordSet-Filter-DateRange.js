
const FilterClauseLocal = require('pict/types/source/filters/FilterClauseLocal');
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
			Hash: 'PRSP-Edit-HeaderEdit-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-DateRange-Template] -->
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
	 * NOTE: example of a subclass setting up filters for that specific filter type: should not be here in the bas class.
	 *
	 * @param {(error?: Error) => void} fCallback
	 * @return {void}
	 */
	onBeforeInitializeAsync(fCallback)
	{
		return super.onBeforeInitializeAsync((pError) =>
		{
			/** @type {FilterClauseLocal} */
			this.filter = this.addFilterClauseType('DateRange');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterDateRange;

module.exports.default_configuration = Object.assign({}, _DEFAULT_CONFIGURATION_Filter_DateRange, ViewRecordSetSUBSETFilterDateRange.default_configuration);

