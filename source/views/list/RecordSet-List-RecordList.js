const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_List_RecordList = (
  {
    ViewIdentifier: 'PRSP-List-RecordList',

    DefaultRenderable: 'PRSP_Renderable_RecordList',
    DefaultDestinationAddress: '#PRSP_RecordList_Container',
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
          Hash: 'PRSP-List-RecordList-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-List-RecordList-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-List-RecordList-Template] -->
	`
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_RecordList',
          TemplateHash: 'PRSP-List-RecordList-Template',
          DestinationAddress: '#PRSP_RecordList_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetListRecordList extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_List_RecordList, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetListRecordList;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_List_RecordList;

