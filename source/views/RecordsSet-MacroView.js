const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Dashboard_HeaderDashboard = (
{
	ViewIdentifier: 'PRSP-Main',

	DefaultRenderable: 'PRSP_Main_Container',
	DefaultDestinationAddress: '#PictRecordSetContainer',
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
			Hash: 'PRSP-Main-Container-Template',
			Template: /*html*/`
<!-- DefaultPackage pict view template: [PRSP-Main-Container-Template] -->
<!-- DefaultPackage end view template:  [PRSP-Main-Container-Template] -->
		`
			}
		],

		Renderables:
		[
			{
				RenderableHash: 'PRSP_Renderable_HeaderDashboard',
				TemplateHash: 'PRSP-Main-Container-Template',
				DestinationAddress: '#PRSP_Main_Container',
				RenderMethod: 'replace'
			}
		],

	Manifests: {}
});

class viewPictSectionRecordSetMain extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Dashboard_HeaderDashboard, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewPictSectionRecordSetMain;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Dashboard_HeaderDashboard;

