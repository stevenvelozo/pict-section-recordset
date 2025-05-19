const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Read_RecordRead = (
	{
		ViewIdentifier: 'PRSP-Read-RecordRead',

		DefaultRenderable: 'PRSP_Renderable_RecordRead',
		DefaultDestinationAddress: '#PRSP_RecordRead_Container',
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
					Hash: 'PRSP-Read-RecordRead-Template',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Read-RecordRead-Template] -->
	<div>
		{~TSWP:PRSP-Read-RecordRead-Template-Row:Record.DisplayFields:Record.Record~}
	</div>
	<!-- DefaultPackage end view template:  [PRSP-Read-RecordRead-Template] -->
	`
				},
				{
					Hash: 'PRSP-Read-RecordRead-Template-Row',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Read-RecordRead-Template] -->
	<div>
		<span style="font-style: italic;">{~D:Record.Data.DisplayName~}</span>
		<span style="font-weight: bold;">{~DVBK:Record.Payload:Record.Data.Key~}</span>
	</div>
	<!-- DefaultPackage end view template:  [PRSP-Read-RecordRead-Template] -->
	`
				}
			],

		Renderables:
			[
				{
					RenderableHash: 'PRSP_Renderable_RecordRead',
					TemplateHash: 'PRSP-Read-RecordRead-Template',
					DestinationAddress: '#PRSP_RecordRead_Container',
					RenderMethod: 'replace'
				}
			],

		Manifests: {}
	});

class viewRecordSetReadRecordRead extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Read_RecordRead, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetReadRecordRead;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Read_RecordRead;

