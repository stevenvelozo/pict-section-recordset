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
	<!-- DefaultPackage end view template:  [PRSP-List-PaginationTop-Template] -->
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

