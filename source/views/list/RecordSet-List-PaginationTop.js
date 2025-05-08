const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_List_PaginationTop = (
  {
    ViewIdentifier: 'PRSP-List-PaginationTop',

    DefaultRenderable: 'PRSP_Renderable_PaginationTop',
    DefaultDestinationAddress: '#PRSP_PaginationTop_Container',
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
          Hash: 'PRSP-List-PaginationTop-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-List-PaginationTop-Template] -->
  <nav id="RSP_Upper_Pagination_Container" role="navigation" aria-label="pagination">
    {~T:PRSP-List-Pagination-Template-Description~}
		{~T:PRSP-List-Pagination-Template-Buttons~}
	</nav>
	<!-- DefaultPackage end view template:  [PRSP-List-PaginationTop-Template] -->
	`
        },
        {
          Hash: 'PRSP-List-Pagination-Template-Description',
          Template: /*html*/`
  <!-- DefaultPackage pict view template: [PRSP-List-Pagination-Template-Description] -->
  <div>
    <span id="PRSP_Pagination_Description_Records_Start">1</span> to
    <span id="PRSP_Pagination_Description_Records_End">{~D:Record.Records.Records.length~}</span> of
    <span id="PRSP_Pagination_Description_Records_Total">{~D:Record.Records.Records.length~}</span> records
  </div>
  <!-- DefaultPackage end view template:  [PRSP-List-Pagination-Template-Description] -->
  `
        },
        {
          Hash: 'PRSP-List-Pagination-Template-Buttons',
          Template: /*html*/`
  <!-- DefaultPackage pict view template: [PRSP-List-Pagination-Template-Buttons] -->
  <ul>
    {~T:PRSP-List-Pagination-Template-Button-Previous~}
    {~TS:PRSP-List-Pagination-Template-Button-Page~}
    {~T:PRSP-List-Pagination-Template-Button-Next~}
  </ul>
  <!-- DefaultPackage end view template:  [PRSP-List-Pagination-Template-Buttons] -->
  `
        },
        {
          Hash: 'PRSP-List-Pagination-Template-Button-Previous',
          Template: /*html*/`
  <!-- DefaultPackage pict view template: [PRSP-List-Pagination-Template-Button-Previous] -->
  <li><a href="#" aria-label="Previous page">&laquo; Previous</a></li>
  <!-- DefaultPackage end view template:  [PRSP-List-Pagination-Template-Button-Previous] -->
  `
        },
        {
          Hash: 'PRSP-List-Pagination-Template-Button-Next',
          Template: /*html*/`
  <!-- DefaultPackage pict view template: [PRSP-List-Pagination-Template-Button-Next] -->
  <li><a href="#" aria-label="Next page">Next &raquo;</a></li>
  <!-- DefaultPackage end view template:  [PRSP-List-Pagination-Template-Button-Next] -->
  `
        },
        {
          Hash: 'PRSP-List-Pagination-Template-Button-Page',
          Template: /*html*/`
  <!-- DefaultPackage pict view template: [PRSP-List-Pagination-Template-Button-Page] -->
  <li><a href="#" aria-label="Go to page {~D:Record.Page~}">{~D:Record.Page~}</a></li>
  <!-- DefaultPackage end view template:  [PRSP-List-Pagination-Template-Button-Page] -->
  `
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_PaginationTop',
          TemplateHash: 'PRSP-List-PaginationTop-Template',
          DestinationAddress: '#PRSP_PaginationTop_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetListPaginationTop extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_List_PaginationTop, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetListPaginationTop;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_List_PaginationTop;

