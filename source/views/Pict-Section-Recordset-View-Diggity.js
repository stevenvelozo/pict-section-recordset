const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_PictSectionRecordset_Diggity = (
	{
		ViewIdentifier: 'PictSectionRecordsetDiggity',

		DefaultRenderable: 'PictSectionRecordset-Diggity',
		DefaultDestinationAddress: '#PictSectionRecordset_Diggity_Container',
		DefaultTemplateRecordAddress: false,

		// If this is set to true, when the App initializes this will.
		// While the App initializes, initialize will be called.
		AutoInitialize: true,
		AutoInitializeOrdinal: 0,

		// If this is set to true, when the App autorenders (on load) this will.
		// After the App initializes, render will be called.
		AutoRender: true,
		AutoRenderOrdinal: 0,

		AutoSolveWithApp: true,
		AutoSolveOrdinal: 0,

		CSS: false,
		CSSPriority: 500,

		Templates:
		[
			{
				Hash: 'PictSectionRecordset-Diggity-Template',
				Template: /*html*/`
	<!-- PictSectionRecordset pict view template: [PictSectionRecordset-Diggity-Template] -->
	<!-- PictSectionRecordset end view template:  [PictSectionRecordset-Diggity-Template] -->
	`
			}
		],

		Renderables:
		[
			{
				RenderableHash: 'PictSectionRecordset-Diggity',
				TemplateHash: 'PictSectionRecordset-Diggity-Template',
				DestinationAddress: '#PictSectionRecordset_Diggity_Container',
				RenderMethod: 'replace'
			}
		],

		Manifests: {}
	});

class PictSectionRecordsetDiggity extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_PictSectionRecordset_Diggity, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}
}

module.exports = PictSectionRecordsetDiggity;

/*
	# Quackage Boilerplate Usage:

	To add this view to the app, add the following code:

	// Require the Diggity view class prototype
	const libPictSectionRecordsetDiggityView = require(`${__dirname}/views/PictSectionRecordset-View-Diggity.js`);

	// Add the Diggity view to the pict application
	this.pict.addView('PictSectionRecordsetDiggity', {}, libPictSectionRecordsetDiggityView);

	// Profit!
*/

/**************************************
 * PictSectionRecordsetDiggity Default View Configuration
 **************************************/
module.exports.default_configuration = _DEFAULT_CONFIGURATION_PictSectionRecordset_Diggity;