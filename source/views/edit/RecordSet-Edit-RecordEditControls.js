const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Edit_RecordEditControls = (
  {
    ViewIdentifier: 'PRSP-Edit-RecordEditControls',

    DefaultRenderable: 'PRSP_Renderable_RecordEditControls',
    DefaultDestinationAddress: '#PRSP_RecordEditControls_Container',
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
          Hash: 'PRSP-Edit-RecordEditControls-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Edit-RecordEditControls-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-Edit-RecordEditControls-Template] -->
	`
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_RecordEditControls',
          TemplateHash: 'PRSP-Edit-RecordEditControls-Template',
          DestinationAddress: '#PRSP_RecordEditControls_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetEditRecordEditControls extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Edit_RecordEditControls, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetEditRecordEditControls;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Edit_RecordEditControls;

