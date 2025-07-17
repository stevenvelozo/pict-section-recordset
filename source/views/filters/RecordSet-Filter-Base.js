const libPictView = require('pict-view');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_SUBSET_Filter =
{
	ViewIdentifier: 'PRSP-FilterType-Base',

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
			Hash: 'PRSP-Filter-Base-Form',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-Base-Form] -->
	{~JD:Record~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-Base-Form] -->
`
		},
		{
			Hash: 'PRSP-Filter-Base-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-Base-Template] -->
	<div>
		{~TBR:Context[0].getFilterFormTemplate()~}
	</div>
	<!-- DefaultPackage end view template:	[PRSP-Filter-Base-Template] -->
`
		},
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
	}

	/**
	 * Hook to prepare state on the render record before rendering.
	 *
	 * @param {Record<string, any>} pRecord - The record used for view rendering.
	 */
	prepareRecord(pRecord)
	{
		pRecord.ClauseValueAddress = pRecord.ClauseAddress + '.Value';
		pRecord.ClauseValuesAddress = pRecord.ClauseAddress + '.Values';

		pRecord.ClauseDescriptor =
		{
			Address: pRecord.ClauseValueAddress,
			Hash: this.fable.DataFormat.sanitizeObjectKey(pRecord.ClauseValueAddress),
			//TODO: figure out a nice pattern for extracting a name for the field from the filter - and allow the filter author to provide the label here
			Name: pRecord.Label || pRecord.ExternalFilterByColumn || pRecord.ExternalFilterByColumns?.[0] || pRecord.FilterByColumn || pRecord.FilterByColumns?.[0] || 'Value',
			DataType: 'String',
		};
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-Base-Form';
	}
}

module.exports = ViewRecordSetSUBSETFilterBase;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_SUBSET_Filter;

