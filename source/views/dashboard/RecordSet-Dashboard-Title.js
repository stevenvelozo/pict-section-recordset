const libPictView = require('pict-view');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_List_Title =
{
	ViewIdentifier: 'PRSP-Dashboard-Title',

	DefaultRenderable: 'PRSP_Renderable_Title',
	DefaultDestinationAddress: '#PRSP_Title_Container',
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
			Hash: 'PRSP-Dashboard-Title-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-Title-Template] -->
	<header id="PRSP_Title_Container">
		<h1 id="PRSP_Title">{~D:Record.Title~}</h1>
		<h2 id="PRSP_Subtitle">{~D:Record.Subtitle~}</h2>
	</header>
	<!-- DefaultPackage end view template:	[PRSP-Dashboard-Title-Template] -->
`
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Title',
			TemplateHash: 'PRSP-Dashboard-Title-Template',
			DestinationAddress: '#PRSP_Title_Container',
			RenderMethod: 'replace'
		},
	],

	Manifests: {},
};

class viewRecordSetListTitle extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_List_Title, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetListTitle;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_List_Title;
