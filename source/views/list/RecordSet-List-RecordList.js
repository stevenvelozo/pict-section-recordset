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
  <section id="PRSP_List_Container">
		{~T:PRSP-List-RecordList-Template-Table~}
	</section>
	<!-- DefaultPackage end view template:  [PRSP-List-RecordList-Template] -->
	`
        },
        {
          Hash: 'PRSP-List-RecordList-Template-Table',
          Template: /*html*/`
  <!-- DefaultPackage pict view template: [PRSP-List-RecordList-Template-Table] -->
  <table id="PRSP_List_Table" tablespacing="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>{~T:PRSP-List-RecordListHeader-Template~}</thead>
    <tbody id="PRSP_RecordList_Container_Entries">
      {~T:PRSP-List-RecordListEntry-Template~}
    </tbody>
  </table>
  <!-- DefaultPackage end view template:  [PRSP-List-RecordList-Template-Table] -->
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

