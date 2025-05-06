const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Dashboard_RecordSetDashboard = (
  {
    ViewIdentifier: 'PRSP-Dashboard-RecordSetDashboard',

    DefaultRenderable: 'PRSP_Renderable_RecordSetDashboard',
    DefaultDestinationAddress: '#PRSP_RecordSetDashboard_Container',
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
          Hash: 'PRSP-Dashboard-RecordSetDashboard-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-RecordSetDashboard-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-RecordSetDashboard-Template] -->
	`
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_RecordSetDashboard',
          TemplateHash: 'PRSP-Dashboard-RecordSetDashboard-Template',
          DestinationAddress: '#PRSP_RecordSetDashboard_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetDashboardRecordSetDashboard extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Dashboard_RecordSetDashboard, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetDashboardRecordSetDashboard;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Dashboard_RecordSetDashboard;

