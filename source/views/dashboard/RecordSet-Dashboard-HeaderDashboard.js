const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_Dashboard_HeaderDashboard = (
  {
    ViewIdentifier: 'PRSP-Dashboard-HeaderDashboard',

    DefaultRenderable: 'PRSP_Renderable_HeaderDashboard',
    DefaultDestinationAddress: '#PRSP_HeaderDashboard_Container',
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
          Hash: 'PRSP-Dashboard-HeaderDashboard-Template',
          Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-HeaderDashboard-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-HeaderDashboard-Template] -->
	`
        }
      ],

    Renderables:
      [
        {
          RenderableHash: 'PRSP_Renderable_HeaderDashboard',
          TemplateHash: 'PRSP-Dashboard-HeaderDashboard-Template',
          DestinationAddress: '#PRSP_HeaderDashboard_Container',
          RenderMethod: 'replace'
        }
      ],

    Manifests: {}
  });

class viewRecordSetDashboardHeaderDashboard extends libPictView
{
  constructor(pFable, pOptions, pServiceHash)
  {
    let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_Dashboard_HeaderDashboard, pOptions);
    super(pFable, tmpOptions, pServiceHash);
  }
}

module.exports = viewRecordSetDashboardHeaderDashboard;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_Dashboard_HeaderDashboard;

