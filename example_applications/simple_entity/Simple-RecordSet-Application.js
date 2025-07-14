const libPictRecordSet = require('../../source/Pict-Section-RecordSet.js');

class SimpleApplication extends libPictRecordSet.PictRecordSetApplication
{
}

module.exports = SimpleApplication;

module.exports.default_configuration.pict_configuration = (
	{
		"Product": "Simple Record Set",

		"PictApplicationConfiguration":
			{
				"AutoRenderMainViewportViewAfterInitialize": false
			},

		"Manifests": // Manifest'Ohs: Breakfast of Champions
		{
			"Bestsellers":
			{
				"Scope": "Bestsellers",
				"CoreEntity": "Book",
				"TitleTemplate": "Bestsellers ({~D:Record.RecordSet~} LoL)",
				"GlobalSolvers":
				[
					{
						"Ordinal": 0,
						"Expression": "AppData.AuthorsFavoriteNumber = AVG(RecordSubset[].IDBook)",
					},
					{
						"Ordinal": 1,
						"Expression": "AppData.AuthorsLeastFavoriteNumber = SUM(RecordSubset[].IDBook)",
					},
					{
						"Ordinal": 1,
						"Expression": "AppData.BookCount = COUNT(RecordSet[])",
					},
					{
						"Ordinal": 1,
						"Expression": "AppData.TotalLibraryValue = SUM(RecordSet[].Price)",
					},
				],
				"Descriptors":
				{
					"IDBook":
					{
						"Name": "Book Identifier",
						"Hash": "BookIdentifire",
					},
					"PublicationYear":
					{
						"Name": "PublicationYear",
						"Hash": "PublicationYear",
						"PictDashboard":
						{
							"Equation": "ROUND(SQRT(PublicationYear), 3)",
							"ValueTemplate": "{~D:Record.Payload.PublicationYear~} ({~SBR:Record.Data.PictDashboard.Equation:Record.Payload:Pict.PictSectionRecordSet.getManifest(Record.Data.ManifestHash)~})",
						}
					},
					"Title":
					{
						"Name": "Title",
						"Hash": "Title",
						"PictDashboard":
						{
							"ValueTemplate": "{~D:Record.Payload.Title~} ({~D:AppData.RSP-Provider-BookstoreInventory.Authors.length~} authors in cohort)"
						}
					},
					"AuthorBookCount":
					{
						"Name": "Author Book Count",
						"Hash": "AuthorBookCount",
					},
					"Authors":
					{
						"Name": "Authors",
						"Hash": "BookAuthors",
						"DataType": "Array",
						"PictDashboard":
						{
							"ValueTemplate": "{~PJU:, ^Name^Record.Payload.Authors~}"
						}
					},
					"AuthorCount":
					{
						"Name": "Number of Authors",
						"Hash": "AuthorCount",
						"DataType": "Number",
						"PictDashboard":
						{
							"EquationNamespaceScope": "Full",
							"Equation": "Payload.Authors.length + 0", //FIXME: having to + 0 here seems sketchy
							"Solvers":
							[
								{
									"Ordinal": 0,
									"Expression": "Price = ROUND(RANDOMFLOATBETWEEN(0.5, 40), 2)",
								},
								"AuthorCount = COS(Authors.length)",
							],
						}
					},
					"AuthorSineWave":
					{
						"Name": "Number of Authors in Orbit",
						"Hash": "AuthorSineWave",
						"DataType": "Number",
						"PictDashboard":
						{
							"Equation": "AuthorSineWave = ROUND(SIN(BookIdentifire / 100)^3,5)", //FIXME: having to + 0 here seems sketchy
							//"ValueTemplate": "{~D:Record.Payload.AuthorsInOrbit~}",
							"Solvers": [ "AuthorsInOrbit = SIN(Authors.length)" ],
						}
					}
				},
			},
			"Underdogs":
			{
				"Scope": "Underdogs",
				"CoreEntity": "Book",
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
						"PictDashboard":
						{
						}
					},
					"AuthorCount":
					{
						"Name": "Number of Authors",
						"Hash": "AuthorCount",
						"DataType": "Number",
						"PictDashboard":
						{
						}
					}
				},
			},
			"NewReleases":
			{
				"Scope": "NewReleases",
				"CoreEntity": "Book",
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
						"PictDashboard":
						{
						}
					},
					"AuthorCount":
					{
						"Name": "Number of Authors",
						"Hash": "AuthorCount",
						"DataType": "Number",
						"PictDashboard":
						{
						}
					}
				},
			}
		},
		"Filters":
		{
			"ExternalJoinBookByAuthor":
			{
				"Type": "ExternalJoinStringMatch",
				"ExternalFilterByColumns": [ "Name" ],

				"CoreConnectionColumn": "IDBook",

				"JoinTable": "BookAuthorJoin",
				"JoinTableExternalConnectionColumn": "IDAuthor",
				"JoinTableCoreConnectionColumn": "IDBook",

				"ExternalFilterByTable": "Author",
				"ExternalFilterByTableConnectionColumn": "IDAuthor"
			}
		},
		"FilterCriteria":
		{
			"FilterRecordsetByBookAndCreateDate":
			[
				{
					"FilterDefinitionHash": "ExternalJoinBookByAuthor",
					"FilterByColumn": "IDBook"
				},
				{
					"Type": "DateRange",
					"FilterByColumn": "CreateDate"
				},
				{
					"Type": "StringMatch",
					"FilterByColumn": "Genre"
				}
			],
			"FilterRecordsetByTitle":
			[
				{
					"Type": "StringMatch",
					"FilterByColumn": "Title"
				},
			]
		},

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

				"FilterExperiences":
				{
					"FilterByAuthorAndCreateDate":
					{
						"Ordinal": 1,
						"FilterCriteriaHash": "FilterRecordsetByBookAndCreateDate",
						"Default": true
					},
					"FilterByTitle":
					{
						"Ordinal": 2,
						"FilterCriteriaHash": "FilterRecordsetByTitle"
					}
				},

				"RecordSetListManifestOnly": false,

				"RecordSetListManifests": [ "Bestsellers", "Underdogs", "NewReleases" ],
				"RecordSetDashboardManifests": [ "Bestsellers" ],

				"RecordSetListHasExtraColumns": true,
				"RecordSetListExtraColumnsHeaderTemplate": "<th style=\"border-bottom: 1px solid #ccc; padding: 5px; background-color: #f2f2f2; color: #333;\">Cover</th>",
				"RecordSetListExtraColumnRowTemplate": "<td><img src=\"{~D:Record.Data.ImageURL~}\"></td>",

				"SearchFields": [ "Title" ],

				"RecordSetFilterURLTemplate-Default": "/PSRS/{~D:Record.RecordSet~}/List/FilteredTo/{~D:Record.FilterString~}",
				"RecordSetFilterURLTemplate-List": "/PSRS/{~D:Record.RecordSet~}/List/FilteredTo/{~D:Record.FilterString~}",
				"RecordSetFilterURLTemplate-Dashboard": "/PSRS/{~D:Record.RecordSet~}/Dashboard/FilteredTo/{~D:Record.FilterString~}",

				"RecordSetURLPrefix": "/1.0/"
			},
			{
				"RecordSet": "BookstoreInventory",
				"Title": "Bookstore Inventory",

				"RecordSetType": "MeadowEndpoint", // Could be "Custom" which would require a provider to already be created for the record set.
				"RecordSetMeadowEntity": "Book",   // This leverages the /Schema endpoint to get the record set columns.

				"RecordSetListManifestOnly": true,

				"RecordSetDashboardManifests": [ "Bestsellers", "Underdogs", "NewReleases" ],

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
					},
					{
						"Entity": "BookAuthorJoin",
						"Filter": "FBL~IDAuthor~INN~{~PJU:,^IDAuthor^Record.State.Authors~}",
						"Destination": "State.BookAuthorJoinsRev"
					},
					{
						"Entity": "Book",
						"Filter": "FBL~IDBook~INN~{~PJU:,^IDBook^Record.State.BookAuthorJoinsRev~}",
						"Destination": "State.BooksForAuthors"
					},
					{
						"Type": "MapJoin",
						"DestinationRecordSetAddress": "State.Authors",
						"DestinationJoinValue": "IDAuthor",
						"JoinJoinValueLHS": "IDAuthor",
						"Joins": "State.BookAuthorJoinsRev",
						"JoinJoinValueRHS": "IDBook",
						"JoinRecordSetAddress": "State.BooksForAuthors",
						"JoinValue": "IDBook",
						"RecordDestinationAddress": "Books"
					}
				],
				"AvailableVerbs": [ "Dashboard" ],

				"RecordSetListHasExtraColumns": true,
				"RecordSetListExtraColumnsHeaderTemplate": "<th style=\"border-bottom: 1px solid #ccc; padding: 5px; background-color: #f2f2f2; color: #333;\">Cover</th>",
				"RecordSetListExtraColumnRowTemplate": "<td><img src=\"{~D:Record.Data.ImageURL~}\"></td>",

				"SearchFields": [ "Title" ],

				"RecordSetFilterURLTemplate-Default": "/PSRS/{~D:Record.RecordSet~}/List/FilteredTo/{~D:Record.FilterString~}",
				"RecordSetFilterURLTemplate-List": "/PSRS/{~D:Record.RecordSet~}/List/FilteredTo/{~D:Record.FilterString~}",
				"RecordSetFilterURLTemplate-Dashboard": "/PSRS/{~D:Record.RecordSet~}/Dashboard/FilteredTo/{~D:Record.FilterString~}",
				//TODO: something like this to reduce boilerplate
				"RecordSetFilterURLTemplate-Dashboard-Specific": "/PSRS/{~D:Record.RecordSet~}/SpecificDashboard/$$DASHBOARD_HASH$$/FilteredTo/{~D:Record.FilterString~}",
				"RecordSetFilterURLTemplate-Dashboard-Bestsellers": "/PSRS/{~D:Record.RecordSet~}/SpecificDashboard/Bestsellers/FilteredTo/{~D:Record.FilterString~}",
				"RecordSetFilterURLTemplate-Dashboard-Underdogs": "/PSRS/{~D:Record.RecordSet~}/SpecificDashboard/Underdogs/FilteredTo/{~D:Record.FilterString~}",
				"RecordSetFilterURLTemplate-Dashboard-NewReleases": "/PSRS/{~D:Record.RecordSet~}/SpecificDashboard/NewReleases/FilteredTo/{~D:Record.FilterString~}",

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
