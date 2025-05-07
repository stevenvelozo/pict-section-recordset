const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION__List = (
  {
    ViewIdentifier: 'PRSP-List',

    DefaultRenderable: 'PRSP_Renderable_List',
    DefaultDestinationAddress: '#PRSP_List_Container',
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
          Hash: 'PRSP-List-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-List-Template] -->
  <section id="PRSP_List_Container">
    {~T:PRSP-List-Template-Header-Template~}
    {~T:PRSP-List-Template-Filter-Template~}
    {~T:PRSP-List-PaginationTop-Template~}
    {~T:PRSP-List-Template-RecordList~}
    {~T:PRSP-List-PaginationBottom-Template~}
  </section>
  <!-- DefaultPackage end view template:  [PRSP-List-Template] -->
  `
        },
        {
          Hash: 'PRSP-List-Template-Record',
          Template: /*html*/`
	<!-- DefaultPackage end view template:  [PRSP-List-Template] -->
	`
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_List',
          TemplateHash: 'PRSP-List-Template',
          DestinationAddress: '#PRSP_List_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetList extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION__List, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetList;

module.exports.default_configuration = _DEFAULT_CONFIGURATION__List;

