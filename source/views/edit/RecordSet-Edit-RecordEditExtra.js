const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Edit_RecordEditExtra = (
  {
    ViewIdentifier: 'PRSP-Edit-RecordEditExtra',

    DefaultRenderable: 'PRSP_Renderable_RecordEditExtra',
    DefaultDestinationAddress: '#PRSP_RecordEditExtra_Container',
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
          Hash: 'PRSP-Edit-RecordEditExtra-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Edit-RecordEditExtra-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-Edit-RecordEditExtra-Template] -->
	`
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_RecordEditExtra',
          TemplateHash: 'PRSP-Edit-RecordEditExtra-Template',
          DestinationAddress: '#PRSP_RecordEditExtra_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetEditRecordEditExtra extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Edit_RecordEditExtra, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetEditRecordEditExtra;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Edit_RecordEditExtra;

