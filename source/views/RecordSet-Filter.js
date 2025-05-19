const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_SUBSET_Filter =
{
	ViewIdentifier: 'PRSP-SUBSET-Filter',

	DefaultRenderable: 'PRSP_Renderable_Filter',
	DefaultDestinationAddress: '#PRSP_Filter_Container',
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
			Hash: 'PRSP-SUBSET-Filter-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filter-Template] -->
	<section id="PRSP_Filter_Container">
		<form id="PRSP_Filter_Form" onsubmit="_Pict.views['PRSP-Filters'].handleSearch(event)">
			{~T:PRSP-SUBSET-Filter-Template-Input-Fieldset~}
			{~T:PRSP-SUBSET-Filter-Template-Button-Fieldset~}
		</form>
	</section>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filter-Template] -->
`
		},
		{
			Hash: 'PRSP-SUBSET-Filter-Template-Input-Fieldset',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filter-Template-Input-Fieldset] -->
	<fieldset>
		<label for="filter">Filter:</label>
		<input type="text" name="filter">
	</fieldset>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filter-Template-Input-Fieldset] -->
`
		},
		{
			Hash: 'PRSP-SUBSET-Filter-Template-Button-Fieldset',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filter-Template-Button-Fieldset] -->
	<fieldset>
		<button type="button" id="PRSP_Filter_Button_Reset" onclick="_Pict.views['PRSP-Filters'].handleReset(event)">Reset</button>
		<button type="submit" id="PRSP_Filter_Button_Apply">Apply</button>
	</fieldset>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filter-Template-Button-Fieldset] -->
`
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter',
			TemplateHash: 'PRSP-SUBSET-Filter-Template',
			DestinationAddress: '#PRSP_Filter_Container',
			RenderMethod: 'replace'
		},
	],

	Manifests: {},
};

class viewRecordSetSUBSETFilter extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_SUBSET_Filter, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}

	handleSearch(event)
	{
		event.stopPropagation();
		event.preventDefault();
		this.pict.views['RSP-RecordSet-List']?.handleSearch?.(this.pict.ContentAssignment.readContent('input[name="filter"]'));
	}

	handleReset(event)
	{
		event.stopPropagation();
		this.pict.ContentAssignment.assignContent('input[name="filter"]', '');
	}
}

module.exports = viewRecordSetSUBSETFilter;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_SUBSET_Filter;

