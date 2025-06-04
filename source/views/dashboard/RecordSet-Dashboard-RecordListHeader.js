const libPictView = require('pict-view');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_List_RecordListHeader = (
	{
		ViewIdentifier: 'PRSP-Dashboard-RecordListHeader',

		DefaultRenderable: 'PRSP_Renderable_RecordListHeader',
		DefaultDestinationAddress: '#PRSP_RecordListHeader_Container',
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
					Hash: 'PRSP-Dashboard-RecordListHeader-Template',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-RecordListHeader-Template] -->
	<tr>
		{~TS:PRSP-Dashboard-RecordListHeader-Template-Header:Record.TableCells~}
		{~T:PRSP-Dashboard-RecordListHeader-Template-Extra-Header~}
		{~T:PRSP-Dashboard-RecordListActions-Template-Header~}
	</tr>
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-RecordListHeader-Template] -->
	`
				},
				{
					Hash: 'PRSP-Dashboard-RecordListHeader-Manifest-Template',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-RecordListHeader-Template] -->
	<tr>
		{~TS:PRSP-Dashboard-RecordListHeader-Template-Header:Record.ManifestOhz~}
		{~T:PRSP-Dashboard-RecordListHeader-Template-Extra-Header~}
		{~T:PRSP-Dashboard-RecordListActions-Template-Header~}
	</tr>
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-RecordListHeader-Template] -->
	`
				},
				{
					Hash: 'PRSP-Dashboard-RecordListHeader-Template-Header',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-RecordListHeader-Template-Header] -->
	<th style="border-bottom: 1px solid #ccc; padding: 5px; background-color: #f2f2f2; color: #333;">
		{~D:Record.DisplayName~}
	</th>
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-RecordListHeader-Template-Header] -->
	`
				},
				{
					Hash: 'PRSP-Dashboard-RecordListHeader-Template-Extra-Header',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-RecordListHeader-Template-Extra-Header] -->
{~TBR:Record.RecordSetConfiguration.RecordSetListExtraColumnsHeaderTemplateHash~}
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-RecordListHeader-Extra-Header] -->
	`
//	{~TBR:Record.RecordSetConfiguration.RecordSetListExtraColumnsHeaderTemplateHash~}

				},
				{
					Hash: 'PRSP-Dashboard-RecordListActions-Template-Header',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-RecordListActions-Template-Header] -->
	<th style="border-bottom: 1px solid #ccc; padding: 5px; background-color: #f2f2f2; color: #333;">
		Actions
	</th>
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-RecordListActions-Template-Header] -->
	`
				},
			],

		Renderables:
			[
				{
					RenderableHash: 'PRSP_Renderable_RecordListHeader',
					TemplateHash: 'PRSP-Dashboard-RecordListHeader-Template',
					DestinationAddress: '#PRSP_RecordListHeader_Container',
					RenderMethod: 'replace'
				}
			],

		Manifests: {}
	});

class viewRecordSetListRecordListHeader extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_List_RecordListHeader, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetListRecordListHeader;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_List_RecordListHeader;

