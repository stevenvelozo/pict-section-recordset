const libPictRecordSetRecordView = require('../RecordSet-RecordBaseView.js');

const viewHeaderDashboard = require('./RecordSet-Dashboard-HeaderDashboard.js');
const viewTitle = require('./RecordSet-Dashboard-Title.js');
const viewFilters = require('../RecordSet-Filter.js');
const viewPaginationTop = require('./RecordSet-Dashboard-PaginationTop.js');
const viewRecordList = require('./RecordSet-Dashboard-RecordList.js');
const viewRecordListHeader = require('./RecordSet-Dashboard-RecordListHeader.js');
const viewRecordListEntry = require('./RecordSet-Dashboard-RecordListEntry.js');
const viewPaginationBottom = require('./RecordSet-Dashboard-PaginationBottom.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION__Dashboard = (
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
					Hash: 'PRSP-Dashboard-Template',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Dashboard-Template] -->
	<section id="PRSP_List_Container">
		{~V:PRSP-Dashboard-Title~}
		{~V:PRSP-Dashboard-HeaderDashboard~}
		{~FV:PRSP-Filters:Dashboard~}
		{~V:PRSP-Dashboard-PaginationTop~}
		{~V:PRSP-Dashboard-RecordList~}
		{~V:PRSP-Dashboard-PaginationBottom~}
	</section>
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-Template] -->
	`
				},
				{
					Hash: 'PRSP-Dashboard-Template-Record',
					Template: /*html*/`
	<!-- DefaultPackage end view template:  [PRSP-Dashboard-Template] -->
	`
				},
				{
					Hash: 'PRSP-Dashboard-Filter-URL',
					Template: /*html*/`#/PSRS/{~D:Record.Filter.RecordSet~}/DashboardFilteredTo/{~D:Record.Filter.FilterString~}`
				}
			],

		Renderables:
			[
				{
					RenderableHash: 'PRSP_Renderable_List',
					TemplateHash: 'PRSP-Dashboard-Template',
					DestinationAddress: '#PRSP_Container',
					RenderMethod: 'replace'
				}
			],

		Manifests: {}
	});

class viewRecordSetDashboard extends libPictRecordSetRecordView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION__Dashboard, pOptions);
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

	handleRecordSetDashboardRoute(pRoutePayload)
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

	/**
	 * @param {import('pict-router')} pPictRouter
	 */
	addRoutes(pPictRouter)
	{
		pPictRouter.router.on('/PSRS/:RecordSet/DashboardFilteredTo/:FilterString/:Offset/:PageSize', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/DashboardFilteredTo/:FilterString', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/Dashboard/:Offset/:PageSize', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/Dashboard/:Offset', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/Dashboard', this.handleRecordSetDashboardRoute.bind(this));
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
			this.pict.log.error(`RecordSetDashboard: No provider found for ${pProviderHash} in ${pRecordSetConfiguration.RecordSet}.  List Render failed.`);
			return false;
		}

		let tmpRecordListData =
		{
			"Title": pRecordSetConfiguration.RecordSet,

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
		tmpRecordListData.Records = await this.pict.providers[pProviderHash].getDecoratedRecords(tmpRecordListData);
		// Get the total record count
		tmpRecordListData.TotalRecordCount = await this.pict.providers[pProviderHash].getRecordSetCount(tmpRecordListData);
		// Get the record schema
		tmpRecordListData.RecordSchema = await this.pict.providers[pProviderHash].getRecordSchema();

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
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/DashboardFilteredTo/${tmpRecordListData.FilterString}/${i * tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
					});
			}
			else
			{
				tmpRecordListData.PageLinks.push(
					{
						Page: i + 1,
						RelativeOffset: i - tmpRecordListData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/Dashboard/${i * tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
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
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/DashboardFilteredTo/${tmpRecordListData.FilterString}/${tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
					});
			}
			else
			{
				tmpRecordListData.PageLinksLimited.unshift(
					{
						Page: 1,
						RelativeOffset: -tmpRecordListData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/Dashboard/${0}/${tmpRecordListData.PageSize}`
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
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/DashboardFilteredTo/${tmpRecordListData.FilterString}/${(tmpRecordListData.PageCount - 1) * tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
					});
			}
			else
			{
				tmpRecordListData.PageLinksLimited.push(
					{
						Page: tmpRecordListData.PageCount,
						RelativeOffset: (tmpRecordListData.PageCount - 1) - tmpRecordListData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordListData.RecordSet}/Dashboard/${(tmpRecordListData.PageCount - 1) * tmpRecordListData.PageSize}/${tmpRecordListData.PageSize}`
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
			tmpRecordListData.TableCells = tmpRecordListData.RecordSetConfiguration.RecordSetListColumns;
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
					this.pict.log.error(`RecordSetDashboard: Error rendering list ${pError}`, tmpRecordListData);
					return false;
				}

				if (this.pict.LogNoisiness > 0)
				{
					this.pict.log.info(`RecordSetDashboard: Rendered list ${tmpRecordListData.RecordSet} with ${tmpRecordListData.Records.Records.length} records.`, tmpRecordListData);
				}
				else
				{
					this.pict.log.info(`RecordSetDashboard: Rendered list ${tmpRecordListData.RecordSet} with ${tmpRecordListData.Records.Records.length} records.`);
				}
				return true;
			}.bind(this));
	}

	onInitialize()
	{
		this.childViews.headerList = this.pict.addView('PRSP-Dashboard-HeaderDashboard', viewHeaderDashboard.default_configuration, viewHeaderDashboard);
		this.childViews.title = this.pict.addView('PRSP-Dashboard-Title', viewTitle.default_configuration, viewTitle);
		this.childViews.filters = this.pict.views['PRSP-Filters'] || this.pict.addView('PRSP-Filters', { }, viewFilters);
		this.childViews.paginationTop = this.pict.addView('PRSP-Dashboard-PaginationTop', viewPaginationTop.default_configuration, viewPaginationTop);
		this.childViews.recordList = this.pict.addView('PRSP-Dashboard-RecordList', viewRecordList.default_configuration, viewRecordList);
		this.childViews.recordListHeader = this.pict.addView('PRSP-Dashboard-RecordListHeader', viewRecordListHeader.default_configuration, viewRecordListHeader);
		this.childViews.recordListEntry = this.pict.addView('PRSP-Dashboard-RecordListEntry', viewRecordListEntry.default_configuration, viewRecordListEntry);
		this.childViews.paginationBottom = this.pict.addView('PRSP-Dashboard-PaginationBottom', viewPaginationBottom.default_configuration, viewPaginationBottom);

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

module.exports = viewRecordSetDashboard;

module.exports.default_configuration = _DEFAULT_CONFIGURATION__Dashboard;

