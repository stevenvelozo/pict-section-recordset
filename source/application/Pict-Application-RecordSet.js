const libPictApplication = require('pict-application');
const libPictSectionForm = require('pict-section-form');

const libPictSectionRecordSet = require('../Pict-Section-RecordSet.js');
const libDynamicSolver = require('../providers/RecordSet-DynamicRecordsetSolver.js');
const libPictDynamicFormDependencyManager = require('pict-section-form').PictDynamicFormDependencyManager;

/**
 * Represents a PictSectionRecordSetApplication.
 *
 * This is the automagic controller for a dynamic record set application.
 *
 * @class
 * @extends libPictApplication
 */
class PictSectionRecordSetApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		/** @type {import('pict') & import('fable')} */
		this.pict;
		// Add the pict recordset meta controller service
		this.pict.addServiceType('PictSectionRecordSet', libPictSectionRecordSet);
		//FIXME: this is probably wrong, but needed for now?
		this.pict.addServiceType('PictSectionForm', libPictSectionForm);

		this.fable.addProviderSingleton('DynamicRecordsetSolver', libDynamicSolver.default_configuration, libDynamicSolver);

		// add the dependencies for dynamic controls
		this.fable.addAndInstantiateSingletonService('PictDynamicFormDependencyManager', libPictDynamicFormDependencyManager.default_configuration, libPictDynamicFormDependencyManager);
	}

	onInitialize()
	{
		// Add the PictSectionRecordSet service
		this.pict.instantiateServiceProvider('PictSectionRecordSet', this.options);
		// Initialize the views for the foundation metacontroller service
		this.pict.PictSectionRecordSet.initialize();

		// Initialize the parent class
		return super.onInitialize();
	}

	onAfterInitialize()
	{
		if (this.pict.CSSMap)
		{
			this.pict.CSSMap.injectCSS();
		}
		// Now add the routes
		this.pict.providers.RecordSetRouter.addRoutes(this.fable.providers.RecordSetRouter.pictRouter);

		return super.onAfterInitialize();
	}
};

module.exports = PictSectionRecordSetApplication

/** @type {Record<string, any>} */
module.exports.default_configuration = (
{
	"Name": "A Simple Pict RecordSet Application",
	"Hash": "PictRecordSetApplication",

	//"MainViewportViewIdentifier": "PictRecordSetPrimaryView",

	"pict_configuration":
		{
			"Product": "DefaultPictRecordSetApplication",
		}
});
