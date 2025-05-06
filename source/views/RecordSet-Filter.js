const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_SUBSET_Filter = (
  {
    ViewIdentifier: 'PRSP-SUBSET-Filter',

    DefaultRenderable: 'PRSP_Renderable_Filter',
    DefaultDestinationAddress: '#PRSP_Filter_Container',
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
          Hash: 'PRSP-SUBSET-Filter-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filter-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-SUBSET-Filter-Template] -->
	`
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_Filter',
          TemplateHash: 'PRSP-SUBSET-Filter-Template',
          DestinationAddress: '#PRSP_Filter_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetSUBSETFilter extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_SUBSET_Filter, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetSUBSETFilter;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_SUBSET_Filter;

