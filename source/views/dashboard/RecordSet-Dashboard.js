const libPictRecordSetRecordView = require('../RecordSet-RecordBaseView.js');

const _DEFAULT_CONFIGURATION__Dashboard =
{
	ViewIdentifier: 'PRSP-Dashboard',

	DefaultRenderable: 'PRSP_Renderable_Dashboard',
	DefaultDestinationAddress: '#PRSP_Dashboard_Container',
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
			Hash: 'PRSP-Dashboard-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Dashboard',
			TemplateHash: 'PRSP-Dashboard-Template',
			DestinationAddress: '#PRSP_Dashboard_Container',
			RenderMethod: 'replace'
		}
	],

	Manifests: {}
};

class viewRecordSetDashboard extends libPictRecordSetRecordView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION__Dashboard, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetDashboard;

module.exports.default_configuration = _DEFAULT_CONFIGURATION__Dashboard;

