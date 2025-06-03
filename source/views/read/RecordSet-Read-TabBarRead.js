const libPictView = require('pict-view');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Read_TabBarRead =
{
	ViewIdentifier: 'PRSP-Read-TabBarRead',

	DefaultRenderable: 'PRSP_Renderable_TabBarRead',
	DefaultDestinationAddress: '#PRSP_TabBarRead_Container',
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
			Hash: 'PRSP-Read-TabBarRead-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Read-TabBarRead-Template] -->
	<!-- DefaultPackage end view template:	[PRSP-Read-TabBarRead-Template] -->
`
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_TabBarRead',
			TemplateHash: 'PRSP-Read-TabBarRead-Template',
			DestinationAddress: '#PRSP_TabBarRead_Container',
			RenderMethod: 'replace'
		},
	],

	Manifests: {},
};

class viewRecordSetReadTabBarRead extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Read_TabBarRead, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetReadTabBarRead;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Read_TabBarRead;

