const libPictApplication = require('pict-application');

const libPictSectionRecordSet = require('../Pict-Section-RecordSet.js');

/**
 * Represents a PictSectionFormApplication.
 *
 * This is the automagic controller for a dyncamic form application.
 *
 * @class
 * @extends libPictApplication
 */
class PictSectionFormApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		/** @type {import('pict') & import('fable')} */
		this.pict;
		// Add the pict recordset meta controller service
		this.pict.addServiceType('PictSectionRecordSet', libPictSectionRecordSet);
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
};

module.exports = PictSectionFormApplication

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
