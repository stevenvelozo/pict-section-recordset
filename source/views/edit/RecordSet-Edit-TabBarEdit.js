const libPictView = require('pict-view');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Edit_TabBarEdit =
{
	ViewIdentifier: 'PRSP-Edit-TabBarEdit',

	DefaultRenderable: 'PRSP_Renderable_TabBarEdit',
	DefaultDestinationAddress: '#PRSP_TabBarEdit_Container',
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
			Hash: 'PRSP-Edit-TabBarEdit-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Edit-TabBarEdit-Template] -->
	<!-- DefaultPackage end view template:	[PRSP-Edit-TabBarEdit-Template] -->
`
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_TabBarEdit',
			TemplateHash: 'PRSP-Edit-TabBarEdit-Template',
			DestinationAddress: '#PRSP_TabBarEdit_Container',
			RenderMethod: 'replace'
		}
	],

	Manifests: {},
};

class viewRecordSetEditTabBarEdit extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Edit_TabBarEdit, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetEditTabBarEdit;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Edit_TabBarEdit;

