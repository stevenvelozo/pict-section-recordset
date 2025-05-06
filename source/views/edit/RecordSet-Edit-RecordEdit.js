const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Edit_RecordEdit = (
  {
    ViewIdentifier: 'PRSP-Edit-RecordEdit',

    DefaultRenderable: 'PRSP_Renderable_RecordEdit',
    DefaultDestinationAddress: '#PRSP_RecordEdit_Container',
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
          Hash: 'PRSP-Edit-RecordEdit-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Edit-RecordEdit-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-Edit-RecordEdit-Template] -->
	`
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_RecordEdit',
          TemplateHash: 'PRSP-Edit-RecordEdit-Template',
          DestinationAddress: '#PRSP_RecordEdit_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetEditRecordEdit extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Edit_RecordEdit, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetEditRecordEdit;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Edit_RecordEdit;

