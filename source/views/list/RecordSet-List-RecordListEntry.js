const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_List_RecordListEntry = (
  {
    ViewIdentifier: 'PRSP-List-RecordListEntry',

    DefaultRenderable: 'PRSP_Renderable_RecordListEntry',
    DefaultDestinationAddress: '#PRSP_RecordListEntry_Container',
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
          Hash: 'PRSP-List-RecordListEntry-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-List-RecordListEntry-Template] -->
  {~T:PRSP-List-RecordListEntry-Template-Entry~}
	<!-- DefaultPackage end view template:  [PRSP-List-RecordListEntry-Template] -->
	`
        },
        {
          Hash: 'PRSP-List-RecordListEntry-Template-Entry',
          Template: /*html*/`
  <tr>
    {~TSWP:PRSP-List-RecordListEntry-Template-Entry-Cell:Context[0].Record.TableCells:Record~}
  </tr>
  `
        },
        {
          Hash: 'PRSP-List-RecordListEntry-Template-Entry-Cell',
          Template: /*html*/`
  <td>
    <!--{DVBK:Record.Payload:WatValHere?~}-->
    {~D:PRSP-List-RecordListEntry-Template-Entry-Cell-Datum:Record.Key:Record.Payload~}
  </td>
  `
        },
        {
          Hash: 'PRSP-List-RecordListEntry-Template-Entry-Cell-Datum',
          Template: /*html*/`
  {~D:Record.DisplayName~}
  `
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_RecordListEntry',
          TemplateHash: 'PRSP-List-RecordListEntry-Template',
          DestinationAddress: '#PRSP_RecordListEntry_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetListRecordListEntry extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_List_RecordListEntry, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetListRecordListEntry;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_List_RecordListEntry;

