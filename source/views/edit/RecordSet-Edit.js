const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION__Edit = (
  {
    ViewIdentifier: 'PRSP-Edit',

    DefaultRenderable: 'PRSP_Renderable_Edit',
    DefaultDestinationAddress: '#PRSP_Edit_Container',
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
          Hash: 'PRSP-Edit-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Edit-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-Edit-Template] -->
	`
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_Edit',
          TemplateHash: 'PRSP-Edit-Template',
          DestinationAddress: '#PRSP_Edit_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetEdit extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION__Edit, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetEdit;

module.exports.default_configuration = _DEFAULT_CONFIGURATION__Edit;

