const libPictView = require('pict-view');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Dashboard_HeaderList =
{
	ViewIdentifier: 'PRSP-Dashboard-HeaderList',

	DefaultRenderable: 'PRSP_Renderable_HeaderList',
	DefaultDestinationAddress: '#PRSP_HeaderList_Container',
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

	Templates:
	[
		{
			Hash: 'PRSP-Dashboard-HeaderList-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-HeaderList-Template] -->
	<!-- DefaultPackage end view template:	[PRSP-Dashboard-HeaderList-Template] -->
`
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_HeaderList',
			TemplateHash: 'PRSP-Dashboard-HeaderList-Template',
			DestinationAddress: '#PRSP_HeaderList_Container',
			RenderMethod: 'replace'
		},
	],

	Manifests: {},
};

class viewRecordSetDashboardHeaderList extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Dashboard_HeaderList, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetDashboardHeaderList;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Dashboard_HeaderList;

