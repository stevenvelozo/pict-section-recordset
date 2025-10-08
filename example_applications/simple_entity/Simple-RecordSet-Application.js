const libPictRecordSet = require('../../source/Pict-Section-RecordSet.js');

const BaseFilterView = require('../../source/views/filters/RecordSet-Filter-ExternalJoinSelectedValueList.js');

const CustomViewConfig =
{
	ViewIdentifier: 'PRSP-FilterType-ExternalJoinSelectedValueList-MyCoolView',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-SelectedValueList-Template-Custom',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-SelectedValueList-Template] -->
	<table>
		<tbody>
		<td valign="top">{~T:PRSP-Filter-ExternalJoin-SelectedValueList-SearchResults-Custom~}</td>
		<td>
			<button onclick="_Pict.views['{~D:Context[0].Hash~}'].handleAdd(event, '{~D:Record.ClauseAddress~}', '{~D:Record.Hash~}')">--&gt;</button>
			<button onclick="_Pict.views['{~D:Context[0].Hash~}'].handleRemove(event, '{~D:Record.ClauseAddress~}', '{~D:Record.Hash~}')">&lt;--</button>
		</td>
		<td valign="top">{~T:PRSP-Filter-ExternalJoin-SelectedValueList-SelectedValues-Custom~}</td>
		</tbody>
	</table>
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-SelectedValueList-Template] -->
`
		},
		{
			Hash: 'PRSP-Filter-ExternalJoin-SelectedValueList-SearchResults-Custom',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-SearchResults] -->
	<form id="PRSP_Filter_{~D:Record.Hash~}_Search_Form" onsubmit="_Pict.views['{~D:Context[0].Hash~}'].performSearch(event, '{~D:Record.ClauseAddress~}', '{~D:Record.Hash~}'); return false;">
		<input id="PRSP_Filter_{~D:Record.Hash~}_Search_Value" type="text" placeholder="Search..." value="{~D:Record.SearchInputValue~}" />
		<button type="submit" id="PRSP_Filter_{~D:Record.Hash~}_Button_Search" onclick="_Pict.views['{~D:Context[0].Hash~}'].performSearch(event, '{~D:Record.ClauseAddress~}', '{~D:Record.Hash~}')">Search</button>
	</form>
	<label>{~D:Record.Label~}</label>
	<select id="PRSP_Filter_{~D:Record.Hash~}_ResultsList" size="25">
		{~TSWP:PRSP-Filter-ExternalJoin-SelectedValueList-SearchResults-Entry-Custom:Record.SearchResults:Record~}
	</select>
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-SearchResults] -->
`
		},
		{
			Hash: 'PRSP-Filter-ExternalJoin-SelectedValueList-SelectedValues-Custom',
			Template: /*html*/`
	<!-- DefaultPackage view template:	[PRSP-Filter-ExternalJoin-SelectedValueList-SelectedValues] -->
	<label>Selection</label>
	<select id="PRSP_Filter_{~D:Record.Hash~}_SelectedValuesSelect" size="25">
		{~TSWP:PRSP-Filter-ExternalJoin-SelectedValueList-SelectedValues-Entry-Custom:Record.SelectedValues:Record~}
	</select>
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-SelectedValueList-SelectedValues] -->
`
		},
		{
			Hash: 'PRSP-Filter-ExternalJoin-SelectedValueList-SearchResults-Entry-Custom',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-SelectedValueList-Template] -->
	<option value="{~DVBK:Record.Data:Record.Payload.ExternalFilterTableLookupColumn~}">{~TFA:Record.Payload.ExternalRecordDisplayTemplate:Record~}</option>
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-SelectedValueList-Template] -->
`
		},
		{
			Hash: 'PRSP-Filter-ExternalJoin-SelectedValueList-SelectedValues-Entry-Custom',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-SelectedValueList-SelectedValues-Entry] -->
	<option value="{~DVBK:Record.Data:Record.Payload.ExternalFilterTableLookupColumn~}">{~TFA:Record.Payload.ExternalRecordDisplayTemplate:Record~}</option>
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-SelectedValueList-SelectedValues-Entry] -->
`
		}
	],
};

class CustomFilterView extends BaseFilterView
{
	getFilterFormTemplate()
	{
		return 'PRSP-Filter-ExternalJoin-SelectedValueList-Template-Custom';
	}

	handleAdd(pEvent, pClauseInformaryAddress, pClauseHash)
	{
		pEvent.preventDefault();
		const tmpClause = this.getInformaryScopedValue(pClauseInformaryAddress);
		if (!tmpClause)
		{
			this.pict.log.error(`[Filter-ExternalJoinSelectedValueList]  No clause found for address: ${pClauseInformaryAddress}`);
			return;
		}
		const tmpRecordLookupValue = this.pict.ContentAssignment.readContent(`#PRSP_Filter_${tmpClause.Hash}_ResultsList`);
		const tmpRecordLookupColumn = tmpClause.ExternalFilterTableLookupColumn || `ID${tmpClause.ExternalFilterByTable}`;
		const tmpRecordToAdd = tmpClause.SearchResults.find((r) => r[tmpRecordLookupColumn] == tmpRecordLookupValue);
		if (!tmpRecordToAdd)
		{
			this.pict.log.error(`[Filter-ExternalJoinSelectedValueList]  No record found for value: ${tmpRecordLookupValue} in search results.`);
			return;
		}
		if (!tmpClause.SelectedValues)
		{
			tmpClause.SelectedValues = [];
		}
		if (tmpClause.SelectedValues.some((pSV) => pSV[tmpRecordLookupColumn] == tmpRecordLookupValue))
		{
			return;
		}
		const tmpValue = tmpRecordToAdd[tmpClause.ExternalFilterByTableConnectionColumn];
		if (tmpValue == null)
		{
			this.pict.log.error(`[Filter-ExternalJoinSelectedValueList]  No value found for column: ${tmpClause.ExternalFilterByTableConnectionColumn} in record: ${JSON.stringify(tmpRecordToAdd)}`);
			return;
		}
		tmpClause.SelectedValues.push(tmpRecordToAdd);
		if (!tmpClause.Values)
		{
			tmpClause.Values = [];
		}
		if (!tmpClause.Values.some((pV) => pV == tmpValue))
		{
			tmpClause.Values.push(tmpValue);
		}
		const tmpRecord = Object.assign({ ClauseAddress: pClauseInformaryAddress }, tmpClause);
		this.prepareRecord(tmpRecord);
		const tmpDestinationAddress = `#PRSP_Filter_Container_${pClauseHash}`;
		this.render(null, tmpDestinationAddress, tmpRecord);
	}

	handleRemove(pEvent, pClauseInformaryAddress, pClauseHash)
	{
		pEvent.preventDefault();
		const tmpClause = this.getInformaryScopedValue(pClauseInformaryAddress);
		if (!tmpClause)
		{
			this.pict.log.error(`[Filter-ExternalJoinSelectedValueList]  No clause found for address: ${pClauseInformaryAddress}`);
			return;
		}
		const tmpRecordLookupValue = this.pict.ContentAssignment.readContent(`#PRSP_Filter_${tmpClause.Hash}_SelectedValuesSelect`);
		const tmpRecordLookupColumn = tmpClause.ExternalFilterTableLookupColumn || `ID${tmpClause.ExternalFilterByTable}`;
		const tmpRecordIndexToRemove = tmpClause.SelectedValues.findIndex((r) => r[tmpRecordLookupColumn] == tmpRecordLookupValue);
		if (tmpRecordIndexToRemove < 0)
		{
			this.pict.log.error(`[Filter-ExternalJoinSelectedValueList]  No record found to remove for value: ${tmpRecordLookupValue}`);
			return;
		}
		const tmpRecordToRemove = tmpClause.SelectedValues.splice(tmpRecordIndexToRemove, 1)[0];
		const tmpValue = tmpRecordToRemove[tmpClause.ExternalFilterByTableConnectionColumn];
		tmpClause.Values = tmpClause.Values.filter((pV) => pV !== tmpValue);
		const tmpRecord = Object.assign({ ClauseAddress: pClauseInformaryAddress }, tmpClause);
		this.prepareRecord(tmpRecord);
		const tmpDestinationAddress = `#PRSP_Filter_Container_${pClauseHash}`;
		this.render(null, tmpDestinationAddress, tmpRecord);
	}
}

CustomFilterView.default_configuration = Object.assign({}, BaseFilterView.default_configuration, CustomViewConfig);

class SimpleApplication extends libPictRecordSet.PictRecordSetApplication
{
	onInitialize()
	{
		this.pict.addView('PRSP-FilterType-ExternalJoinSelectedValueList-MyCoolView', {}, CustomFilterView);
		this.pict.addView('SpecialBookView', 
        {
            "ViewIdentifier": "SpecialBookView",

            "DefaultRenderable": "SpecialBookView",
            "DefaultDestinationAddress": "#Placeholder",
            "IncludeInMetacontrollerOperations": true,

            "AutoRender": false,

            "Templates": [
                {
                    "Hash": "SpecialBookView-Content",
                    "Template": /*html*/`
						<div>
							This is a special book view, here's some text: <br />
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</div>
					`
                }
            ],
            "Renderables": [
                {
                    "RenderableHash": "SpecialBookView",
                    "TemplateHash": "SpecialBookView-Content"
                }
            ]
        });

		return super.onInitialize();
	}
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
			"Book-View":
			{
				"Form": "BookViewManifest",
				"Scope": "Book-View",
				"Descriptors": 
				{
					"BookDetails.Title": 
					{
						"Name": "Title",
						"Hash": "ViewBookName",
						"DataType": "String",
						"PictForm": 
						{
							"Row": "1",
							"Section": "BookView",
							"Group": "BookView"
						}
					},
					"BookDetails.Genre": 
					{
						"Name": "Genre",
						"Hash": "ViewBookGenre",
						"DataType": "String",
						"PictForm": 
						{
							"Row": "1",
							"Section": "BookView",
							"Group": "BookView"
						}
					},
					"BookDetails.ISBN": 
					{
						"Name": "ISBN",
						"Hash": "ViewBookISBN",
						"DataType": "String",
						"PictForm": 
						{
							"Row": "2",
							"Section": "BookView",
							"Group": "BookView"
						}
					}
				},
				"Sections": 
				[
					{
						"Name": "Book View",
						"Hash": "BookView",
						"Solvers": [],
						"ShowTitle": false,
						"Groups": [
							{
								"Name": "Book View",
								"Hash": "BookView",
								"Rows": [],
								"RecordSetSolvers": [],
								"ShowTitle": false
							}
						]
					}
				]
			},
			"Author-View":
			{
				"Form": "AuthorViewManifest",
				"Scope": "Author-View",
				"Descriptors": 
				{
					"AuthorDetails.Name": 
					{
						"Name": "Author Name",
						"Hash": "ViewAuthorName",
						"DataType": "String",
						"PictForm": 
						{
							"Row": "1",
							"Section": "AuthorView",
							"Group": "AuthorView"
						}
					},
				},
				"Sections": 
				[
					{
						"Name": "Author View",
						"Hash": "AuthorView",
						"Solvers": [],
						"ShowTitle": false,
						"Groups": [
							{
								"Name": "Author View",
								"Hash": "AuthorView",
								"Rows": [],
								"RecordSetSolvers": [],
								"ShowTitle": false
							}
						]
					}
				]
			},
			"AuthorMetadata":
			{
				"Form": "AuthorMetadataManifest",
				"Scope": "AuthorMetadata",
				"Descriptors": 
				{
					"AuthorDetails.GUIDAuthor": 
					{
						"Name": "Author GUID",
						"Hash": "ViewGUIDAuthor",
						"DataType": "String",
						"PictForm": 
						{
							"Row": "1",
							"Section": "AuthorMetadata",
							"Group": "AuthorMetadata"
						}
					},
					"AuthorDetails.IDAuthor": 
					{
						"Name": "ID Author",
						"Hash": "ViewIDAuthor",
						"DataType": "String",
						"PictForm": 
						{
							"Row": "1",
							"Section": "AuthorMetadata",
							"Group": "AuthorMetadata"
						}
					},
				},
				"Sections": 
				[
					{
						"Name": "Author Metadata",
						"Hash": "AuthorMetadata",
						"Solvers": [],
						"ShowTitle": false,
						"Groups": [
							{
								"Name": "Author Metadata",
								"Hash": "AuthorMetadata",
								"Rows": [],
								"RecordSetSolvers": [],
								"ShowTitle": false
							}
						]
					}
				]
			},
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
						"Hash": "BookIdentifier",
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
							"Equation": "AuthorSineWave = ROUND(SIN(BookIdentifier / 100)^3,5)", //FIXME: having to + 0 here seems sketchy
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
						"DataType": "String",
						"PictDashboard":
						{
						}
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
				"Label": "Author's Name",
				"Type": "ExternalJoinStringMatch",
				"ExternalFilterByColumns": [ "Name" ],
				"DisplayName": "Author's Name",

				"CoreConnectionColumn": "IDBook",

				"JoinTable": "BookAuthorJoin",
				"JoinTableExternalConnectionColumn": "IDAuthor",
				"JoinTableCoreConnectionColumn": "IDBook",

				"ExternalFilterByTable": "Author",
				"ExternalFilterByTableConnectionColumn": "IDAuthor"
			},
			"ExternalJoinBookBySelectedAuthors":
			{
				"Label": "Authors",
				"Type": "ExternalJoinSelectedValueList",
				"ExternalFilterByColumns": [ "Name", "GUIDAuthor" ],

				"MaximumSelectedExternalRecords": 5,
				"ExternalRecordDisplayTemplate": "{~D:Record.Data.Name~}",

				"CoreConnectionColumn": "IDBook",

				"JoinTable": "BookAuthorJoin",
				"JoinTableExternalConnectionColumn": "IDAuthor",
				"JoinTableCoreConnectionColumn": "IDBook",

				"ExternalFilterByTable": "Author",
				"ExternalFilterByTableConnectionColumn": "IDAuthor",
				"CustomFilterViewHash": "MyCoolView"
			},
			"InternalJoinBySelectedJoinIDs":
			{
				"Label": "Join IDs (internal test)",
				"Type": "InternalJoinSelectedValue",
				"ExternalFilterByColumns": [ "IDBookAuthorJoin" ],

				"ExternalRecordDisplayTemplate": "{~D:Record.Data.IDBookAuthorJoin~} [{~D:Record.Data.IDBook~} &lt;-&gt; {~D:Record.Data.IDAuthor~}]",

				"CoreConnectionColumn": "IDBook",

				"RemoteTable": "BookAuthorJoin",
				"JoinExternalConnectionColumn": "IDBook",
				"JoinInternalConnectionColumn": "IDBook"
			}
		},
		"FilterCriteria":
		{
			"FilterRecordsetByBookAndCreateDate":
			[
				{
					"FilterDefinitionHash": "ExternalJoinBookBySelectedAuthors",
					"FilterByColumn": "IDBook"
				},
				{
					"FilterDefinitionHash": "InternalJoinBySelectedJoinIDs",
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

				"RecordSetIgnoreFilterFields": [ "Deleted", "DeletingIDUser", "DeleteDate", "UpdateDate" ],

				"RecordSetFieldFilterClauses":
				{
					"Title":
					[
						{ "FilterKey": "Title", "ClauseKey": "TitleMatch", "Label": "Book Title Custom Filter", "Type": "StringMatch", "FilterByColumn": "Title", "ExactMatch": true }
					]
				},

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

				"RecordSetReadManifestOnly": true,
				"RecordSetReadManifests": [ "Book-View" ],

				"ReadLayout": "Split",

				"RecordSetReadTabs": 
				[
					{
						Type: "AttachedRecord",
						RecordSet: "Author",
						Title: "Author",
						JoiningRecordSet: "BookAuthorJoin"
					},
					{
						Type: "Manifest",
						Manifest: "AuthorMetadata",
						Title: "Author Metadata"
					},
					{
						Type: "View",
						View: "SpecialBookView",
						Title: "More Book Info"
					}
				],

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

				"RecordSetDashboardManifestOnly": true,

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

				"RecordSetURLPrefix": "/1.0/",

				"RecordSetReadManifestOnly": true,
				"RecordSetReadManifests": [ "Author-View" ],

				"ReadLayout": "Tab",
				"RecordSetReadTabTitle": "Author",

				"RecordSetReadTabs": 
				[
					{
						Type: "Manifest",
						Manifest: "AuthorMetadata",
						Title: "Author Metadata"
					}
				],

			},
			{
				"RecordSet": "RandomizedValues",

				"RecordSetType": "Custom" // This means the `PS-RSP-RandomizedValues` provider will be checked for to get records.
			}
		]
	});
