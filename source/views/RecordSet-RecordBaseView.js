const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Base_View = (
{
	ViewIdentifier: 'PRSP-RecordSet-View-Base',

	DefaultRenderable: 'PRSP_Base_Recordset',
	DefaultDestinationAddress: '#PictRecordSetContainer',
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
			Hash: 'PRSP-Base-View-Template',
			Template: /*html*/`
<!-- DefaultPackage pict view template: [PRSP-Base-View-Template] -->
<!--
	If this is being rendered, the RecordSet view has not taken control of its render function.
	While the view may not need custom templating it is strongly encouraged to still override 
	the template and put informative messaging into an HTML comment.

Record JSON:
\`\`\`json
{~DataJson:Record~}
\`\`\`
--!
<!-- DefaultPackage end view template:  [PRSP-Base-View-Template] -->
		`
			}
		],

		Renderables:
		[
			{
				RenderableHash: 'PRSP_Base_Recordset',
				TemplateHash: 'PRSP-Base-View-Template',
				DestinationAddress: '#PictRecordSetContainer',
				RenderMethod: 'replace'
			}
		],

	Manifests: {}
});

class viewPictSectionRecordSetViewBase extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Base_View, pOptions);
		super(pFable, tmpOptions, pServiceHash);
		/** @type {import('pict') & {
		 *      log: any,
		 *      instantiateServiceProviderWithoutRegistration: (hash: String) => any,
		 *      PictSectionRecordSet: InstanceType<import('../Pict-Section-RecordSet.js')> }
		 *  } */
		this.pict;
	}

	addRoutes(pPictRouter)
	{
		this.pict.log.trace(`View [${this.options.ViewIdentifier}]::[${this.Hash}] addRoutes called.`);
		return true;
	}
}

module.exports = viewPictSectionRecordSetViewBase;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Base_View;
