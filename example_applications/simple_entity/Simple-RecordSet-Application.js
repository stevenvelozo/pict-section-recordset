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

		"DefaultDashboards":
		[
			{
				"Scope": "Bookstore",
				"CoreEntity": "Book",
				"RecordDecorationConfiguration":
				[
					{
						"Entity": "BookAuthorJoin",
						"Filter": "FBL~IDBook~INN~{~PJU:,^IDBook^Record.State.CoreEntityRecordSubset~}",
						"Destination": "State.BookAuthorJoins"
					},
					{
						"Entity": "Author",
						"Filter": "FBL~IDAuthor~INN~{~PJU:,^IDAuthor^Record.State.BookAuthorJoins~}",
						"Destination": "State.Authors"
					},
					{
						"Type": "MapJoin",
						"DestinationRecordSetAddress": "State.CoreEntityRecordSubset",
						"DestinationJoinValue": "IDBook",
						"JoinJoinValueLHS": "IDBook",
						"Joins": "State.BookAuthorJoins",
						"JoinJoinValueRHS": "IDAuthor",
						"JoinRecordSetAddress": "State.Authors",
						"JoinValue": "IDAuthor",
						"RecordDestinationAddress": "Authors"
					}
				],
				"Descriptors":
				{
					"Title":
					{
						"Name": "Title",
						"Hash": "Title",
						"DataType": "String"
					},
					"Authors":
					{
						"Name": "Authors",
						"Hash": "Authors",
						"PictForm":
						{
							"InputType": "ReadOnly",
						}
					},
					"AuthorCount":
					{
						"Name": "Number of Authors",
						"Hash": "AuthorCount",
						"DataType": "Number",
						"PictForm":
						{
							"InputType": "ReadOnly"
						}
					}
				}
			},
			{
				"Scope": "AuthorSummary",
				"Descriptors":
				{
				}
			}
		],
		"DefaultRecordSetConfigurations":
			[
				{
					"RecordSet": "Book",

					"RecordSetType": "MeadowEndpoint", // Could be "Custom" which would require a provider to already be created for the record set.
					"RecordSetMeadowEntity": "Book",   // This leverages the /Schema endpoint to get the record set columns.

					"RecordSetListColumns": [
						{
							"Key": "Title",
							"DisplayName": "Title"
						},
						{
							"Key": "Genre",
							"DisplayName": "Genre"
						},
						{
							"Key": "ISBN",
							"DisplayName": "Int'l SBN"
						}
					],

					"RecordSetListHasExtraColumns": true,
					"RecordSetListExtraColumnsHeaderTemplate": "<th style=\"border-bottom: 1px solid #ccc; padding: 5px; background-color: #f2f2f2; color: #333;\">Cover</th>",
					"RecordSetListExtraColumnRowTemplate": "<td><img src=\"{~D:Record.Data.ImageURL~}\"></td>",

					"SearchFields": [ "Title" ],

					"RecordSetFilterURLTemplate-Default": "/PSRS/{~D:Record.RecordSet~}/ListFilteredTo/{~D:Record.FilterString~}",
					"RecordSetFilterURLTemplate-List": "/PSRS/{~D:Record.RecordSet~}/ListFilteredTo/{~D:Record.FilterString~}",
					"RecordSetFilterURLTemplate-Dashboard": "/PSRS/{~D:Record.RecordSet~}/DashboardFilteredTo/{~D:Record.FilterString~}",

					"RecordSetURLPrefix": "/1.0/"
				},
				{
					"RecordSet": "BookstoreInventory",

					"RecordSetType": "MeadowEndpoint", // Could be "Custom" which would require a provider to already be created for the record set.
					"RecordSetMeadowEntity": "Book",   // This leverages the /Schema endpoint to get the record set columns.
					"RecordDecorationConfiguration":
					[
						{
							"Entity": "BookAuthorJoin",
							"Filter": "FBL~IDBook~INN~{~PJU:,^IDBook^Record.State.CoreEntityRecordSubset~}",
							"Destination": "State.BookAuthorJoins"
						},
						{
							"Entity": "Author",
							"Filter": "FBL~IDAuthor~INN~{~PJU:,^IDAuthor^Record.State.BookAuthorJoins~}",
							"Destination": "State.Authors"
						},
						{
							"Type": "MapJoin",
							"DestinationRecordSetAddress": "State.CoreEntityRecordSubset",
							"DestinationJoinValue": "IDBook",
							"JoinJoinValueLHS": "IDBook",
							"Joins": "State.BookAuthorJoins",
							"JoinJoinValueRHS": "IDAuthor",
							"JoinRecordSetAddress": "State.Authors",
							"JoinValue": "IDAuthor",
							"RecordDestinationAddress": "Authors"
						}
					],
					"AvailableVerbs": [ "Dashboard" ],

					"RecordSetListHasExtraColumns": true,
					"RecordSetListExtraColumnsHeaderTemplate": "<th style=\"border-bottom: 1px solid #ccc; padding: 5px; background-color: #f2f2f2; color: #333;\">Cover</th>",
					"RecordSetListExtraColumnRowTemplate": "<td><img src=\"{~D:Record.Data.ImageURL~}\"></td>",

					"SearchFields": [ "Title" ],

					"RecordSetFilterURLTemplate-Default": "/PSRS/{~D:Record.RecordSet~}/ListFilteredTo/{~D:Record.FilterString~}",
					"RecordSetFilterURLTemplate-List": "/PSRS/{~D:Record.RecordSet~}/ListFilteredTo/{~D:Record.FilterString~}",
					"RecordSetFilterURLTemplate-Dashboard": "/PSRS/{~D:Record.RecordSet~}/DashboardFilteredTo/{~D:Record.FilterString~}",

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
