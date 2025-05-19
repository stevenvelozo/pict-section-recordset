const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Read_RecordReadExtra =
{
	ViewIdentifier: 'PRSP-Read-RecordReadExtra',

	DefaultRenderable: 'PRSP_Renderable_RecordReadExtra',
	DefaultDestinationAddress: '#PRSP_RecordReadExtra_Container',
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
			Hash: 'PRSP-Read-RecordReadExtra-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Read-RecordReadExtra-Template] -->
	<!-- DefaultPackage end view template:	[PRSP-Read-RecordReadExtra-Template] -->
`
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_RecordReadExtra',
			TemplateHash: 'PRSP-Read-RecordReadExtra-Template',
			DestinationAddress: '#PRSP_RecordReadExtra_Container',
			RenderMethod: 'replace'
		},
	],

	Manifests: {},
};

class viewRecordSetReadRecordReadExtra extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Read_RecordReadExtra, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetReadRecordReadExtra;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Read_RecordReadExtra;

