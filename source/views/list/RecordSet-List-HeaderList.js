const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_List_HeaderList =
{
	ViewIdentifier: 'PRSP-List-HeaderList',

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
			Hash: 'PRSP-List-HeaderList-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-List-HeaderList-Template] -->
	<!-- DefaultPackage end view template:	[PRSP-List-HeaderList-Template] -->
`
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_HeaderList',
			TemplateHash: 'PRSP-List-HeaderList-Template',
			DestinationAddress: '#PRSP_HeaderList_Container',
			RenderMethod: 'replace'
		},
	],

	Manifests: {},
};

class viewRecordSetListHeaderList extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_List_HeaderList, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetListHeaderList;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_List_HeaderList;

