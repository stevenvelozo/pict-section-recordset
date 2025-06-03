const libPictView = require('pict-view');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_List_PaginationBottom = (
	{
		ViewIdentifier: 'PRSP-Dashboard-PaginationBottom',

		DefaultRenderable: 'PRSP_Renderable_PaginationBottom',
		DefaultDestinationAddress: '#PRSP_PaginationBottom_Container',
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
					Hash: 'PRSP-Dashboard-PaginationBottom-Template',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-PaginationBottom-Template] -->
	<nav id="RSP_Lower_Pagination_Container">
	{~T:PRSP-Dashboard-Pagination-Template-Description~}
		{~T:PRSP-Dashboard-Pagination-Template-Buttons~}
	</nav>
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-PaginationBottom-Template] -->
	`
				}
			],

		Renderables:
			[
				{
					RenderableHash: 'PRSP_Renderable_PaginationBottom',
					TemplateHash: 'PRSP-Dashboard-PaginationBottom-Template',
					DestinationAddress: '#PRSP_PaginationBottom_Container',
					RenderMethod: 'replace'
				}
			],

		Manifests: {}
	});

class viewRecordSetListPaginationBottom extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_List_PaginationBottom, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = viewRecordSetListPaginationBottom;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_List_PaginationBottom;

