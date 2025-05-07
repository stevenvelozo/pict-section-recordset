const libPictRecordSet = require('../../source/Pict-Section-RecordSet.js');
//const libPictSectionForm = require('pict-section-recordset');

module.exports = libPictRecordSet.PictRecordSetApplication;

module.exports.default_configuration.pict_configuration = (
	{
		"Product": "Simple Record Set",

		"PictApplicationConfiguration":
			{
				"AutoRenderMainViewportViewAfterInitialize": false
			},

		"DefaultRecordSetConfigurations":
			[
				{
					"RecordSet": "Book",

					"RecordSetType": "MeadowEndpoint", // Could be "Custom" which would require a provider to already be created for the record set.
					"RecordSetMeadowEntity": "Book",   // This leverages the /Schema endpoint to get the record set columns.

					"RecordSetURLPrefix": "/1.0/"
				},
				{
					"RecordSet": "Author",

					"RecordSetType": "MeadowEndpoint",
					"RecordSetMeadowEntity": "Author",

					"RecordSetURLPrefix": "/1.0/"
				},
				{
					"RecordSet": "RandomizedValues",

					"RecordSetType": "Custom" // This means the `PS-RSP-RandomizedValues` provider will be checked for to get records.
				}
			]
		});
