const libPictView = require('pict-view');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_SUBSET_Filter =
{
	ViewIdentifier: 'PRSP-SUBSET-Filter-Base',

	DefaultTemplateRecordAddress: false,

	// If this is set to true, when the App initializes this will.
	// While the App initializes, initialize will be called.
	AutoInitialize: false,
	AutoInitializeOrdinal: 0,

	// If this is set to true, when the App autorenders (on load) this will.
	// After the App initializes, render will be called.
	AutoRender: false,
	AutoRenderOrdinal: 0,

	AutoSolveWithApp: false,
	AutoSolveOrdinal: 0,

	CSS: false,
	CSSPriority: 500,

	Manifests: {},

	DefaultRenderable: 'PRSP_Renderable_Filter_Base',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-DateRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-Base-Template] -->
	{~JD:Record~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-Base-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_Base',
			TemplateHash: 'PRSP-Filter-Base-Template',
			DestinationAddress: '#PRSP_Filter_Base_Container',
			RenderMethod: 'replace',
		}
	],
};

class ViewRecordSetSUBSETFilterBase extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_SUBSET_Filter, pOptions);
		super(pFable, tmpOptions, pServiceHash);
		/** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, PictSectionRecordSet: import('../../Pict-Section-RecordSet.js') }} */
		this.pict;
	}

	/**
	 * Hook to prepare state on the render record before rendering.
	 *
	 * @param {Record<string, any>} pRecord - The record used for view rendering.
	 */
	prepareRecord(pRecord)
	{
		pRecord.CriterionValueAddress = pRecord.CriterionAddress + '.Value';
		pRecord.CriterionValuesAddress = pRecord.CriterionAddress + '.Values';

		pRecord.CriterionDescriptor =
		{
			Address: pRecord.CriterionValueAddress,
			//TODO: figure out a nice pattern for extracting a name for the field from the filter - and allow the filter author to provide the label here
			Name: pRecord.Label || pRecord.ExternalFilterByColumn || pRecord.ExternalFilterByColumns?.[0] || pRecord.FilterByColumn || pRecord.FilterByColumns?.[0] || 'Value',
			DataType: 'String',
		};

	}
}

module.exports = ViewRecordSetSUBSETFilterBase;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_SUBSET_Filter;

