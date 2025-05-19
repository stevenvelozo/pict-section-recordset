const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Dashboard_TabBarDashboard =
{
	ViewIdentifier: 'PRSP-Dashboard-TabBarDashboard',

	DefaultRenderable: 'PRSP_Renderable_TabBarDashboard',
	DefaultDestinationAddress: '#PRSP_TabBarDashboard_Container',
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
			Hash: 'PRSP-Dashboard-TabBarDashboard-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-TabBarDashboard-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-TabBarDashboard-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_TabBarDashboard',
			TemplateHash: 'PRSP-Dashboard-TabBarDashboard-Template',
			DestinationAddress: '#PRSP_TabBarDashboard_Container',
			RenderMethod: 'replace'
		}
	],

	Manifests: {}
};

class viewRecordSetDashboardTabBarDashboard extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Dashboard_TabBarDashboard, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetDashboardTabBarDashboard;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Dashboard_TabBarDashboard;

