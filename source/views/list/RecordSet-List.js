const libPictRecordSetRecordView = require('../RecordSet-RecordBaseView.js');

const viewHeaderList = require('./RecordSet-List-HeaderList.js');
const viewTitle = require('./RecordSet-List-Title.js');
const viewFilters = require('../RecordSet-Filters.js');
const viewPaginationTop = require('./RecordSet-List-PaginationTop.js');
const viewRecordList = require('./RecordSet-List-RecordList.js');
const viewRecordListHeader = require('./RecordSet-List-RecordListHeader.js');
const viewRecordListEntry = require('./RecordSet-List-RecordListEntry.js');
const viewPaginationBottom = require('./RecordSet-List-PaginationBottom.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION__List = (
	{
		ViewIdentifier: 'PRSP-List',

		DefaultRenderable: 'PRSP_Renderable_List',
		DefaultDestinationAddress: '#PRSP_Container',
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
					Hash: 'PRSP-List-Template',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-List-Template] -->
	<section id="PRSP_List_Container">
		{~V:PRSP-List-Title~}
		{~V:PRSP-List-HeaderList~}
		{~FV:PRSP-Filters:List~}
		{~V:PRSP-List-PaginationTop~}
		{~V:PRSP-List-RecordList~}
		{~V:PRSP-List-PaginationBottom~}
	</section>
	<!-- DefaultPackage end view template:  [PRSP-List-Template] -->
	`
				},
				{
					Hash: 'PRSP-List-Template-Record',
					Template: /*html*/`
	<!-- DefaultPackage end view template:  [PRSP-List-Template] -->
	`
				}
			],

		Renderables:
			[
				{
					RenderableHash: 'PRSP_Renderable_List',
					TemplateHash: 'PRSP-List-Template',
					DestinationAddress: '#PRSP_Container',
					RenderMethod: 'replace'
				}
			],

		Manifests: {}
	});

class viewRecordSetList extends libPictRecordSetRecordView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION__List, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.childViews = {
			headerList: null,
			title: null,
			paginationTop: null,
			recordList: null,
			recordListHeader: null,
			recordListEntry: null,
			paginationBottom: null
		};
	}

	handleRecordSetListRoute(pRoutePayload)
	{
		if (typeof(pRoutePayload) != 'object')
		{
			throw new Error(`Pict RecordSet List view route handler called with invalid route payload.`);
		}

		//_Pict.PictSectionRecordSet.recordSetProviderConfigurations['Book'], 'RSP-Provider-Book'
		// FIXME: Not in love with this but good enough to start.
		// FIXME: Typescript mumbo jumbo
		// if (!('PictSectionRecordSet' in this.pict))
		// {
		// 	return false;
		// }
		const tmpProviderConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations[pRoutePayload.data.RecordSet];
		const tmpProviderHash = `RSP-Provider-${pRoutePayload.data.RecordSet}`;

		const tmpFilterString = pRoutePayload.data.FilterString || '';

		const tmpOffset = pRoutePayload.data.Offset ? pRoutePayload.data.Offset : 0;
		const tmpPageSize = pRoutePayload.data.PageSize ? pRoutePayload.data.PageSize : 100;

		return this.renderList(tmpProviderConfiguration, tmpProviderHash, tmpFilterString, tmpOffset, tmpPageSize);
	}

	addRoutes(pPictRouter)
	{
		pPictRouter.router.on('/PSRS/:RecordSet/List/FilteredTo/:FilterString/:Offset/:PageSize', this.handleRecordSetListRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/List/FilteredTo/:FilterString', this.handleRecordSetListRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/List/:Offset/:PageSize', this.handleRecordSetListRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/List/:Offset', this.handleRecordSetListRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/List', this.handleRecordSetListRoute.bind(this));
		pPictRouter.router.resolve();
		return true;
	}

	onBeforeRenderList(pRecordListData)
	{
		return pRecordListData;
	}

	dynamicallyGenerateColumns(pRecordListData)
	{
		pRecordListData.TableCells = [];
		const tmpEntity = pRecordListData.RecordSetConfiguration.Entity;
		this.excludedByDefaultCells = [
			'ID' + tmpEntity,
			'GUID' + tmpEntity,
			'CreateDate',
			'CreatingIDUser',
			'DeleteDate',
			'Deleted',
			'DeletingIDUser',
			'UpdateDate',
			'UpdatingIDUser',
		];

		const tmpSchema = pRecordListData.RecordSchema;
		const tmpProperties = tmpSchema?.properties;
		// loop throught the schema and add the columns to the tableCells
		for (const tmpColumn in tmpProperties)
		{
			if (tmpProperties.hasOwnProperty(tmpColumn))
			{
				// Check if the column is excluded by the default list of columns (or is not a GUID/ID)
				if (this.excludedByDefaultCells.includes(tmpColumn) === false)
				{
					pRecordListData.TableCells.push({
						'Key': tmpColumn,
						'DisplayName': tmpProperties?.[tmpColumn].title || tmpColumn,
					});
				}
			}
		}
		return pRecordListData;
	}

	async renderList(pRecordSetConfiguration, pProviderHash, pFilterString, pOffset, pPageSize)
	{
		// Get the records
		if (!(pProviderHash in this.pict.providers))
		{
			this.pict.log.error(`RecordSetList: No provider found for ${pProviderHash} in ${pRecordSetConfiguration.RecordSet}.  List Render failed.`);
			return false;
		}

		let tmpRecordListData =
		{
			"Title": pRecordSetConfiguration.Title || pRecordSetConfiguration.RecordSet,

			"RecordSet": pRecordSetConfiguration.RecordSet,
			"RecordSetConfiguration": pRecordSetConfiguration,

			"RenderDestination": this.options.DefaultDestinationAddress,

			"FilterString": pFilterString ? encodeURIComponent(pFilterString) : undefined,

			"Records": { "Records": [] },
			"TotalRecordCount": { "Count": -1 },

			"Offset": pOffset || 0,
			"PageSize": pPageSize || 100,
		};

		// TODO: There are still problems with the way these have nested data.  Discuss how we might move that around
		// Fetch the records
		const [ tmpRecords, tmpTotalRecordCount, tmpRecordSchema ] = await Promise.all([
			this.pict.providers[pProviderHash].getRecords(tmpRecordListData),
			this.pict.providers[pProviderHash].getRecordSetCount(tmpRecordListData),
			this.pict.providers[pProviderHash].getRecordSchema(),
		]);
		tmpRecordListData.Records = tmpRecords;
		// Get the total record count
		tmpRecordListData.TotalRecordCount = tmpTotalRecordCount;
		// Get the record schema
		tmpRecordListData.RecordSchema = tmpRecordSchema;

		// TODO: This should be coming from the schema but that can come after we discuss how we deal with default routing
		tmpRecordListData.GUIDAddress = `GUID${this.pict.providers[pProviderHash].options.Entity}`;

		// Get the "page end record number" for the current page (e.g. for messaging like Record 700 to 800 of 75,000)
		tmpRecordListData.PageEnd = parseInt(tmpRecordListData.Offset) + tmpRecordListData.Records.Records.length;

		// Compute the number of pages total
		tmpRecordListData.PageCount = Math.ceil(tmpRecordListData.TotalRecordCount.Count / tmpRecordListData.PageSize);

		// Generate each page's links.
		// TODO: This is fast and cool; any reason not to?
		// Get "bookmarks" as references to the array of page links.
		tmpRecordListData.PageLinkBookmarks = (
			{
				Current: Math.floor(tmpRecordListData.Offset / tmpRecordListData.PageSize)
			});
		tmpRecordListData.PageLinks = [];
		for (let i = 0; i < tmpRecordListData.PageCount; i++)
		{
			if (tmpRecordListData.FilterString)
			{
				tmpRecordListData.PageLinks.push(
					{
						Page: i + 1,
						RelativeOffset: i - tmpRecordListData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/List/FilteredTo/${tmpRecordListData.FilterString}/${i * tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
					});
			}
			else
			{
				tmpRecordListData.PageLinks.push(
					{
						Page: i + 1,
						RelativeOffset: i - tmpRecordListData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/List/${i * tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
					});
			}
		}

		//FIXME: short-term workaround to not blow up the tempplate rendering with way too many links
		const linkRangeStart = Math.max(0, tmpRecordListData.PageLinkBookmarks.Current - 10);
		const linkRangeEnd = Math.min(tmpRecordListData.PageLinks.length, tmpRecordListData.PageLinkBookmarks.Current + 10);
		tmpRecordListData.PageLinksLimited = tmpRecordListData.PageLinks.slice(linkRangeStart, linkRangeEnd);
		if (linkRangeStart > 0)
		{
			if (tmpRecordListData.FilterString)
			{
				tmpRecordListData.PageLinksLimited.unshift(
					{
						Page: 1,
						RelativeOffset: -tmpRecordListData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/List/FilteredTo/${tmpRecordListData.FilterString}/${tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
					});
			}
			else
			{
				tmpRecordListData.PageLinksLimited.unshift(
					{
						Page: 1,
						RelativeOffset: -tmpRecordListData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/List/${0}/${tmpRecordListData.PageSize}`
					});
			}
		}
		if (linkRangeEnd < tmpRecordListData.PageLinks.length)
		{
			if (tmpRecordListData.FilterString)
			{
				tmpRecordListData.PageLinksLimited.push(
					{
						Page: tmpRecordListData.PageCount,
						RelativeOffset: (tmpRecordListData.PageCount - 1) - tmpRecordListData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/List/FilteredTo/${tmpRecordListData.FilterString}/${(tmpRecordListData.PageCount - 1) * tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
					});
			}
			else
			{
				tmpRecordListData.PageLinksLimited.push(
					{
						Page: tmpRecordListData.PageCount,
						RelativeOffset: (tmpRecordListData.PageCount - 1) - tmpRecordListData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/List/${(tmpRecordListData.PageCount - 1) * tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
					});
			}
		}

		tmpRecordListData.PageLinkBookmarks.Previous = tmpRecordListData.PageLinkBookmarks.Current - 1;
		tmpRecordListData.PageLinkBookmarks.Next = tmpRecordListData.PageLinkBookmarks.Current + 1;
		tmpRecordListData.PageLinkBookmarks.ShowPreviousLink = true;
		tmpRecordListData.PageLinkBookmarks.ShowNextLink = true;
		if (tmpRecordListData.PageLinkBookmarks.Previous < 0)
		{
			tmpRecordListData.PageLinkBookmarks.PreviousLink = false;
			tmpRecordListData.PageLinkBookmarks.ShowPreviousLink = false;
		}
		else
		{
			tmpRecordListData.PageLinkBookmarks.PreviousLink = tmpRecordListData.PageLinks[tmpRecordListData.PageLinkBookmarks.Previous];
		}
		if (tmpRecordListData.PageLinkBookmarks.Next >= tmpRecordListData.PageLinks.length)
		{
			tmpRecordListData.PageLinkBookmarks.NextLink = false;
			tmpRecordListData.PageLinkBookmarks.ShowNextLink = false;
		}
		else
		{
			tmpRecordListData.PageLinkBookmarks.NextLink = tmpRecordListData.PageLinks[tmpRecordListData.PageLinkBookmarks.Next];
		}

		// Put code here to preprocess columns into other data parts.
		if (tmpRecordListData.RecordSetConfiguration.hasOwnProperty('RecordSetListColumns'))
		{
			tmpRecordListData.TableCells = tmpRecordListData.RecordSetConfiguration.RecordSetListColumns.map((key) =>
				{
					if (typeof key === 'object')
					{
						if (!key.DisplayName)
						{
							key.DisplayName = key.Key; //FIXME: use schema?
						}
						if (!key.ManifestHash)
						{
							key.ManifestHash = 'Default';
						}
						return key;
					}
					return {
						Key: key,
						DisplayName: key, //FIXME: use schema?
						ManifestHash: 'Default',
						PictDashboard:
						{
							ValueTemplate: '{~DVBK:Record.Payload:Record.Data.Key~}',
						},
					};
				});
		}
		else
		{
			this.dynamicallyGenerateColumns(tmpRecordListData);
		}
		tmpRecordListData = this.onBeforeRenderList(tmpRecordListData);

		this.renderAsync('PRSP_Renderable_List', tmpRecordListData.RenderDestination, tmpRecordListData,
			function (pError)
			{
				if (pError)
				{
					this.pict.log.error(`RecordSetList: Error rendering list ${pError}`, tmpRecordListData);
					return false;
				}

				if (this.pict.LogNoisiness > 0)
				{
					this.pict.log.info(`RecordSetList: Rendered list ${tmpRecordListData.RecordSet} with ${tmpRecordListData.Records.Records.length} records.`, tmpRecordListData);
				}
				else
				{
					this.pict.log.info(`RecordSetList: Rendered list ${tmpRecordListData.RecordSet} with ${tmpRecordListData.Records.Records.length} records.`);
				}
				return true;
			}.bind(this));
	}

	onInitialize()
	{
		this.childViews.headerList = this.pict.addView('PRSP-List-HeaderList', viewHeaderList.default_configuration, viewHeaderList);
		this.childViews.title = this.pict.addView('PRSP-List-Title', viewTitle.default_configuration, viewTitle);
		this.childViews.filters = this.pict.views['PRSP-Filters'] || this.pict.addView('PRSP-Filters', { }, viewFilters);
		this.childViews.paginationTop = this.pict.addView('PRSP-List-PaginationTop', viewPaginationTop.default_configuration, viewPaginationTop);
		this.childViews.recordList = this.pict.addView('PRSP-List-RecordList', viewRecordList.default_configuration, viewRecordList);
		this.childViews.recordListHeader = this.pict.addView('PRSP-List-RecordListHeader', viewRecordListHeader.default_configuration, viewRecordListHeader);
		this.childViews.recordListEntry = this.pict.addView('PRSP-List-RecordListEntry', viewRecordListEntry.default_configuration, viewRecordListEntry);
		this.childViews.paginationBottom = this.pict.addView('PRSP-List-PaginationBottom', viewPaginationBottom.default_configuration, viewPaginationBottom);

		// Initialize the subviews
		this.childViews.headerList.initialize();
		this.childViews.title.initialize();
		this.childViews.paginationTop.initialize();
		this.childViews.recordList.initialize();
		this.childViews.recordListHeader.initialize();
		this.childViews.recordListEntry.initialize();
		this.childViews.paginationBottom.initialize();

		return super.onInitialize();
	}
}

module.exports = viewRecordSetList;

module.exports.default_configuration = _DEFAULT_CONFIGURATION__List;

