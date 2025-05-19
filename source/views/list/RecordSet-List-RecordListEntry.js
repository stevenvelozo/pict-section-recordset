const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_List_RecordListEntry = (
	{
		ViewIdentifier: 'PRSP-List-RecordListEntry',

		DefaultRenderable: 'PRSP_Renderable_RecordListEntry',
		DefaultDestinationAddress: '#PRSP_RecordListEntry_Container',
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
					// TODO: Add extras template here; it's in the header but not here yet.
					Hash: 'PRSP-List-RecordListEntry-Template',
					Template: /*html*/`
		{~TSWP:PRSP-List-RecordListEntry-Template-Row:Record.Records.Records:Record~}
	`
				},
				{
					Hash: 'PRSP-List-RecordListEntry-Template-Row',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-List-RecordListEntry-Template] -->
	<tr>
		{~TSWP:PRSP-List-RecordListEntry-Template-Row-Cell:Record.Payload.TableCells:Record.Data~}
		{~T:PRSP-List-RecordListHeader-Template-Extra-Row~}
		{~T:PRSP-List-RecordListAction-Template-Cell~}
	</tr>
	<!-- DefaultPackage end view template:  [PRSP-List-RecordListEntry-Template] -->
	`
//		

				},
				{
					Hash: 'PRSP-List-RecordListHeader-Template-Extra-Row',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-List-RecordListHeader-Template-Extra-Row] -->
	{~TBR:Record.Payload.RecordSetConfiguration.RecordSetListExtraColumnRowTemplateHash~}
	<!-- DefaultPackage end view template:  [PRSP-List-RecordListHeader-Extra-Row] -->
	`
//	{~TBR:Record.Payload.RecordSetConfiguration.RecordSetListExtraColumnRowTemplateHash~}

				},
				{
					Hash: 'PRSP-List-RecordListEntry-Template-Row-Cell',
					Template: /*html*/`
		<td style="border-bottom: 1px solid #ccc; padding: 5px;">
			{~DVBK:Record.Payload:Record.Data.Key~}
		</td>
	`
				},
				{
					Hash: 'PRSP-List-RecordListEntry-Template-Entry-Cell-Datum',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-List-RecordListEntry-Template-Entry-Cell-Datum] -->
	`
				},
				{
					Hash: 'PRSP-List-RecordListAction-Template-Cell',
					// FIXME: Needs a better way of getting the appropriate link templates in (likely requiring piping the RecordSet to the link manager)
					Template: /*html*/`
		<td style="border-bottom: 1px solid #ccc; padding: 5px;">
			<ul>
			{~TSWP:PRSP-List-RecordListAction-Template-Cell-Datum:Pict.providers.RecordSetLinkManager.linkTemplates:Record~}
			</ul>
		</td>
	`
				},
				{
					Hash: 'PRSP-List-RecordListAction-Template-Cell-Datum',
					// These use the new TemplateByReference template expression, which uses the values in these addresses to lookup the template hash then renders those template with the current Record state.
					// This is part one of refactoring to include metatemplate resolution ase a core behavior pict itself rather than a pict-section-form capability
					Template: /*html*/`
					<li><a href="{~TBR:Record.Data.URL~}">{~TBR:Record.Data.Name~}</a></li>
	`
	//					{~Breakpoint~}

				},
			],

		Renderables:
			[
				{
					RenderableHash: 'PRSP_Renderable_RecordListEntry',
					TemplateHash: 'PRSP-List-RecordListEntry-Template',
					DestinationAddress: '#PRSP_RecordListEntry_Container',
					RenderMethod: 'replace'
				}
			],

		Manifests: {}
	});

class viewRecordSetListRecordListEntry extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_List_RecordListEntry, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetListRecordListEntry;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_List_RecordListEntry;

