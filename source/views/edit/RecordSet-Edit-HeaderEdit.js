const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Edit_HeaderEdit =
{
	ViewIdentifier: 'PRSP-Edit-HeaderEdit',

	DefaultRenderable: 'PRSP_Renderable_HeaderEdit',
	DefaultDestinationAddress: '#PRSP_HeaderEdit_Container',
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
			Hash: 'PRSP-Edit-HeaderEdit-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Edit-HeaderEdit-Template] -->
	<!-- DefaultPackage end view template:	[PRSP-Edit-HeaderEdit-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_HeaderEdit',
			TemplateHash: 'PRSP-Edit-HeaderEdit-Template',
			DestinationAddress: '#PRSP_HeaderEdit_Container',
			RenderMethod: 'replace'
		}
	],

	Manifests: {},
};

class viewRecordSetEditHeaderEdit extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Edit_HeaderEdit, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetEditHeaderEdit;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Edit_HeaderEdit;

