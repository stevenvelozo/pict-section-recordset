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
			return;
			throw new Error(`Pict RecordSet List view route handler called with invalid route payload.`);
		}
		if (!pRoutePayload.data || !pRoutePayload.data.RecordSet)
		{
			return;
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

		if (pRoutePayload.data.DashboardHash)
		{
			return this.renderSpecificDashboard(pRoutePayload.data.DashboardHash, tmpProviderConfiguration, tmpProviderHash, tmpFilterString, tmpOffset, tmpPageSize);
		}
		return this.renderDashboard(tmpProviderConfiguration, tmpProviderHash, tmpFilterString, tmpOffset, tmpPageSize);
	}

	/**
	 * @param {import('pict-router')} pPictRouter
	 */
	addRoutes(pPictRouter)
	{
		pPictRouter.router.on('/PSRS/:RecordSet/Dashboard/FilteredTo/:FilterString/:Offset/:PageSize', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/Dashboard/FilteredTo/:FilterString', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/Dashboard/:Offset/:PageSize', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/Dashboard/:Offset', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/Dashboard', this.handleRecordSetDashboardRoute.bind(this));

		pPictRouter.router.on('/PSRS/:RecordSet/SpecificDashboard/:DashboardHash/FilteredTo/:FilterString/:Offset/:PageSize', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/SpecificDashboard/:DashboardHash/FilteredTo/:FilterString', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/SpecificDashboard/:DashboardHash/:Offset/:PageSize', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/SpecificDashboard/:DashboardHash/:Offset', this.handleRecordSetDashboardRoute.bind(this));
		pPictRouter.router.on('/PSRS/:RecordSet/SpecificDashboard/:DashboardHash', this.handleRecordSetDashboardRoute.bind(this));
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

	/**
	 * @param {string} pDashboardHash
	 * @param {Record<string, any>} pRecordSetConfiguration
	 * @param {string} pProviderHash
	 * @param {string} pFilterString
	 * @param {number} pOffset
	 * @param {number} pPageSize
	 *
	 * @return {Promise<void>}
	 */
	async renderSpecificDashboard(pDashboardHash, pRecordSetConfiguration, pProviderHash, pFilterString, pOffset, pPageSize)
	{
		// Get the records
		if (!(pProviderHash in this.pict.providers))
		{
			this.pict.log.error(`RecordSetDashboard: No provider found for ${pProviderHash} in ${pRecordSetConfiguration.RecordSet}.  List Render failed.`);
			return;
		}

		let tmpManifest;
		if (pDashboardHash)
		{
			tmpManifest = this.pict.PictSectionRecordSet.manifests[pDashboardHash];
		}
		let tmpTitle = pRecordSetConfiguration.Title || pRecordSetConfiguration.RecordSet;
		if (tmpManifest && tmpManifest.TitleTemplate)
		{
			tmpTitle = this.pict.parseTemplate(tmpManifest.TitleTemplate, pRecordSetConfiguration);
		}

		let tmpRecordDashboardData =
		{
			"Title": tmpTitle,

			"RecordSet": pRecordSetConfiguration.RecordSet,
			"RecordSetConfiguration": pRecordSetConfiguration,

			"RenderDestination": this.options.DefaultDestinationAddress,

			"FilterString": pFilterString ? encodeURIComponent(pFilterString) : undefined,

			"Records": { "Records": [] },
			"TotalRecordCount": { "Count": -1 },

			"Offset": pOffset || 0,
			"PageSize": pPageSize || 100,
			"DashboardHash": pDashboardHash,
		};

		// TODO: There are still problems with the way these have nested data.  Discuss how we might move that around
		// Fetch the records
		tmpRecordDashboardData.Records = await this.pict.providers[pProviderHash].getDecoratedRecords(tmpRecordDashboardData);
		// Get the total record count
		tmpRecordDashboardData.TotalRecordCount = await this.pict.providers[pProviderHash].getRecordSetCount(tmpRecordDashboardData);
		// Get the record schema
		tmpRecordDashboardData.RecordSchema = await this.pict.providers[pProviderHash].getRecordSchema();

		// TODO: This should be coming from the schema but that can come after we discuss how we deal with default routing
		tmpRecordDashboardData.GUIDAddress = `GUID${this.pict.providers[pProviderHash].options.Entity}`;

		// Get the "page end record number" for the current page (e.g. for messaging like Record 700 to 800 of 75,000)
		tmpRecordDashboardData.PageEnd = parseInt(tmpRecordDashboardData.Offset) + tmpRecordDashboardData.Records.Records.length;

		// Compute the number of pages total
		tmpRecordDashboardData.PageCount = Math.ceil(tmpRecordDashboardData.TotalRecordCount.Count / tmpRecordDashboardData.PageSize);

		// Generate each page's links.
		// TODO: This is fast and cool; any reason not to?
		// Get "bookmarks" as references to the array of page links.
		tmpRecordDashboardData.PageLinkBookmarks = (
			{
				Current: Math.floor(tmpRecordDashboardData.Offset / tmpRecordDashboardData.PageSize)
			});
		tmpRecordDashboardData.PageLinks = [];
		for (let i = 0; i < tmpRecordDashboardData.PageCount; i++)
		{
			if (tmpRecordDashboardData.FilterString)
			{
				tmpRecordDashboardData.PageLinks.push(
					{
						Page: i + 1,
						RelativeOffset: i - tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/SpecificDashboard/${pDashboardHash}/FilteredTo/${tmpRecordDashboardData.FilterString}/${i * tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
			else
			{
				tmpRecordDashboardData.PageLinks.push(
					{
						Page: i + 1,
						RelativeOffset: i - tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/SpecificDashboard/${pDashboardHash}/${i * tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
		}

		//FIXME: short-term workaround to not blow up the tempplate rendering with way too many links
		const linkRangeStart = Math.max(0, tmpRecordDashboardData.PageLinkBookmarks.Current - 10);
		const linkRangeEnd = Math.min(tmpRecordDashboardData.PageLinks.length, tmpRecordDashboardData.PageLinkBookmarks.Current + 10);
		tmpRecordDashboardData.PageLinksLimited = tmpRecordDashboardData.PageLinks.slice(linkRangeStart, linkRangeEnd);
		if (linkRangeStart > 0)
		{
			if (tmpRecordDashboardData.FilterString)
			{
				tmpRecordDashboardData.PageLinksLimited.unshift(
					{
						Page: 1,
						RelativeOffset: -tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/SpecificDashboard/${pDashboardHash}/FilteredTo/${tmpRecordDashboardData.FilterString}/${tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
			else
			{
				tmpRecordDashboardData.PageLinksLimited.unshift(
					{
						Page: 1,
						RelativeOffset: -tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/SpecificDashboard/${pDashboardHash}/0/${tmpRecordDashboardData.PageSize}`
					});
			}
		}
		if (linkRangeEnd < tmpRecordDashboardData.PageLinks.length)
		{
			if (tmpRecordDashboardData.FilterString)
			{
				tmpRecordDashboardData.PageLinksLimited.push(
					{
						Page: tmpRecordDashboardData.PageCount,
						RelativeOffset: (tmpRecordDashboardData.PageCount - 1) - tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/SpecificDashboard/${pDashboardHash}/FilteredTo/${tmpRecordDashboardData.FilterString}/${(tmpRecordDashboardData.PageCount - 1) * tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
			else
			{
				tmpRecordDashboardData.PageLinksLimited.push(
					{
						Page: tmpRecordDashboardData.PageCount,
						RelativeOffset: (tmpRecordDashboardData.PageCount - 1) - tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/SpecificDashboard/${pDashboardHash}/${(tmpRecordDashboardData.PageCount - 1) * tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
		}

		tmpRecordDashboardData.PageLinkBookmarks.Previous = tmpRecordDashboardData.PageLinkBookmarks.Current - 1;
		tmpRecordDashboardData.PageLinkBookmarks.Next = tmpRecordDashboardData.PageLinkBookmarks.Current + 1;
		tmpRecordDashboardData.PageLinkBookmarks.ShowPreviousLink = true;
		tmpRecordDashboardData.PageLinkBookmarks.ShowNextLink = true;
		if (tmpRecordDashboardData.PageLinkBookmarks.Previous < 0)
		{
			tmpRecordDashboardData.PageLinkBookmarks.PreviousLink = false;
			tmpRecordDashboardData.PageLinkBookmarks.ShowPreviousLink = false;
		}
		else
		{
			tmpRecordDashboardData.PageLinkBookmarks.PreviousLink = tmpRecordDashboardData.PageLinks[tmpRecordDashboardData.PageLinkBookmarks.Previous];
		}
		if (tmpRecordDashboardData.PageLinkBookmarks.Next >= tmpRecordDashboardData.PageLinks.length)
		{
			tmpRecordDashboardData.PageLinkBookmarks.NextLink = false;
			tmpRecordDashboardData.PageLinkBookmarks.ShowNextLink = false;
		}
		else
		{
			tmpRecordDashboardData.PageLinkBookmarks.NextLink = tmpRecordDashboardData.PageLinks[tmpRecordDashboardData.PageLinkBookmarks.Next];
		}

		if (pDashboardHash)
		{
			tmpRecordDashboardData.TableCells = this.pict.PictSectionRecordSet.manifests[pDashboardHash]?.TableCells;
		}
		if (!tmpRecordDashboardData.TableCells)
		{
			tmpRecordDashboardData.TableCells = [];
			// Put code here to preprocess columns into other data parts.
			/*
				"RecordSetListManifestOnly": false,

				"RecordSetListManifests": [ "Bestsellers", "Underdogs", "NewReleases" ],
				"RecordSetDashboardManifests": [ "Bestsellers" ],
			 */
			if (tmpRecordDashboardData.RecordSetConfiguration.hasOwnProperty('RecordSetListColumns'))
			{
				tmpRecordDashboardData.TableCells = tmpRecordDashboardData.RecordSetConfiguration.RecordSetListColumns;
			}
			else
			{
				this.dynamicallyGenerateColumns(tmpRecordDashboardData);
			}
		}

		tmpRecordDashboardData = this.onBeforeRenderList(tmpRecordDashboardData);

		this.renderAsync('PRSP_Renderable_List', tmpRecordDashboardData.RenderDestination, tmpRecordDashboardData,
			function (pError)
			{
				if (pError)
				{
					this.pict.log.error(`RecordSetDashboard: Error rendering list ${pError}`, tmpRecordDashboardData);
					return;
				}

				if (this.pict.LogNoisiness > 0)
				{
					this.pict.log.info(`RecordSetDashboard: Rendered list ${tmpRecordDashboardData.RecordSet} with ${tmpRecordDashboardData.Records.Records.length} records.`, tmpRecordDashboardData);
				}
				else
				{
					this.pict.log.info(`RecordSetDashboard: Rendered list ${tmpRecordDashboardData.RecordSet} with ${tmpRecordDashboardData.Records.Records.length} records.`);
				}
			}.bind(this));
	}

	/**
	 * @param {Record<string, any>} pRecordSetConfiguration
	 * @param {string} pProviderHash
	 * @param {string} pFilterString
	 * @param {number} pOffset
	 * @param {number} pPageSize
	 *
	 * @return {Promise<void>}
	 */
	async renderDashboard(pRecordSetConfiguration, pProviderHash, pFilterString, pOffset, pPageSize)
	{
		// Get the records
		if (!(pProviderHash in this.pict.providers))
		{
			this.pict.log.error(`RecordSetDashboard: No provider found for ${pProviderHash} in ${pRecordSetConfiguration.RecordSet}.  List Render failed.`);
			return;
		}

		let tmpRecordDashboardData =
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
			this.pict.providers[pProviderHash].getRecords(tmpRecordDashboardData),
			this.pict.providers[pProviderHash].getRecordSetCount(tmpRecordDashboardData),
			this.pict.providers[pProviderHash].getRecordSchema(),
		]);
		tmpRecordDashboardData.Records = tmpRecords;
		// Get the total record count
		tmpRecordDashboardData.TotalRecordCount = tmpTotalRecordCount;
		// Get the record schema
		tmpRecordDashboardData.RecordSchema = tmpRecordSchema;

		// TODO: This should be coming from the schema but that can come after we discuss how we deal with default routing
		tmpRecordDashboardData.GUIDAddress = `GUID${this.pict.providers[pProviderHash].options.Entity}`;

		// Get the "page end record number" for the current page (e.g. for messaging like Record 700 to 800 of 75,000)
		tmpRecordDashboardData.PageEnd = parseInt(tmpRecordDashboardData.Offset) + tmpRecordDashboardData.Records.Records.length;

		// Compute the number of pages total
		tmpRecordDashboardData.PageCount = Math.ceil(tmpRecordDashboardData.TotalRecordCount.Count / tmpRecordDashboardData.PageSize);

		// Generate each page's links.
		// TODO: This is fast and cool; any reason not to?
		// Get "bookmarks" as references to the array of page links.
		tmpRecordDashboardData.PageLinkBookmarks = (
			{
				Current: Math.floor(tmpRecordDashboardData.Offset / tmpRecordDashboardData.PageSize)
			});
		tmpRecordDashboardData.PageLinks = [];
		for (let i = 0; i < tmpRecordDashboardData.PageCount; i++)
		{
			if (tmpRecordDashboardData.FilterString)
			{
				tmpRecordDashboardData.PageLinks.push(
					{
						Page: i + 1,
						RelativeOffset: i - tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/Dashboard/FilteredTo/${tmpRecordDashboardData.FilterString}/${i * tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
			else
			{
				tmpRecordDashboardData.PageLinks.push(
					{
						Page: i + 1,
						RelativeOffset: i - tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/Dashboard/${i * tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
		}

		//FIXME: short-term workaround to not blow up the tempplate rendering with way too many links
		const linkRangeStart = Math.max(0, tmpRecordDashboardData.PageLinkBookmarks.Current - 10);
		const linkRangeEnd = Math.min(tmpRecordDashboardData.PageLinks.length, tmpRecordDashboardData.PageLinkBookmarks.Current + 10);
		tmpRecordDashboardData.PageLinksLimited = tmpRecordDashboardData.PageLinks.slice(linkRangeStart, linkRangeEnd);
		if (linkRangeStart > 0)
		{
			if (tmpRecordDashboardData.FilterString)
			{
				tmpRecordDashboardData.PageLinksLimited.unshift(
					{
						Page: 1,
						RelativeOffset: -tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/Dashboard/FilteredTo/${tmpRecordDashboardData.FilterString}/${tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
			else
			{
				tmpRecordDashboardData.PageLinksLimited.unshift(
					{
						Page: 1,
						RelativeOffset: -tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/Dashboard/${0}/${tmpRecordDashboardData.PageSize}`
					});
			}
		}
		if (linkRangeEnd < tmpRecordDashboardData.PageLinks.length)
		{
			if (tmpRecordDashboardData.FilterString)
			{
				tmpRecordDashboardData.PageLinksLimited.push(
					{
						Page: tmpRecordDashboardData.PageCount,
						RelativeOffset: (tmpRecordDashboardData.PageCount - 1) - tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/Dashboard/FilteredTo/${tmpRecordDashboardData.FilterString}/${(tmpRecordDashboardData.PageCount - 1) * tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
			else
			{
				tmpRecordDashboardData.PageLinksLimited.push(
					{
						Page: tmpRecordDashboardData.PageCount,
						RelativeOffset: (tmpRecordDashboardData.PageCount - 1) - tmpRecordDashboardData.PageLinkBookmarks.Current,
						URL: `#/PSRS/${tmpRecordDashboardData.RecordSet}/Dashboard/${(tmpRecordDashboardData.PageCount - 1) * tmpRecordDashboardData.PageSize}/${tmpRecordDashboardData.PageSize}`
					});
			}
		}

		tmpRecordDashboardData.PageLinkBookmarks.Previous = tmpRecordDashboardData.PageLinkBookmarks.Current - 1;
		tmpRecordDashboardData.PageLinkBookmarks.Next = tmpRecordDashboardData.PageLinkBookmarks.Current + 1;
		tmpRecordDashboardData.PageLinkBookmarks.ShowPreviousLink = true;
		tmpRecordDashboardData.PageLinkBookmarks.ShowNextLink = true;
		if (tmpRecordDashboardData.PageLinkBookmarks.Previous < 0)
		{
			tmpRecordDashboardData.PageLinkBookmarks.PreviousLink = false;
			tmpRecordDashboardData.PageLinkBookmarks.ShowPreviousLink = false;
		}
		else
		{
			tmpRecordDashboardData.PageLinkBookmarks.PreviousLink = tmpRecordDashboardData.PageLinks[tmpRecordDashboardData.PageLinkBookmarks.Previous];
		}
		if (tmpRecordDashboardData.PageLinkBookmarks.Next >= tmpRecordDashboardData.PageLinks.length)
		{
			tmpRecordDashboardData.PageLinkBookmarks.NextLink = false;
			tmpRecordDashboardData.PageLinkBookmarks.ShowNextLink = false;
		}
		else
		{
			tmpRecordDashboardData.PageLinkBookmarks.NextLink = tmpRecordDashboardData.PageLinks[tmpRecordDashboardData.PageLinkBookmarks.Next];
		}

		tmpRecordDashboardData.TableCells = [];
		// Put code here to preprocess columns into other data parts.
		/*
			"RecordSetListManifestOnly": false,

			"RecordSetListManifests": [ "Bestsellers", "Underdogs", "NewReleases" ],
			"RecordSetDashboardManifests": [ "Bestsellers" ],
		 */
		if (tmpRecordDashboardData.RecordSetConfiguration.hasOwnProperty('RecordSetListColumns'))
		{
			tmpRecordDashboardData.TableCells = tmpRecordDashboardData.RecordSetConfiguration.RecordSetListColumns;
		}
		else
		{
			this.dynamicallyGenerateColumns(tmpRecordDashboardData);
		}

		tmpRecordDashboardData = this.onBeforeRenderList(tmpRecordDashboardData);

		this.renderAsync('PRSP_Renderable_List', tmpRecordDashboardData.RenderDestination, tmpRecordDashboardData,
			function (pError)
			{
				if (pError)
				{
					this.pict.log.error(`RecordSetDashboard: Error rendering list ${pError}`, tmpRecordDashboardData);
					return;
				}

				if (this.pict.LogNoisiness > 0)
				{
					this.pict.log.info(`RecordSetDashboard: Rendered list ${tmpRecordDashboardData.RecordSet} with ${tmpRecordDashboardData.Records.Records.length} records.`, tmpRecordDashboardData);
				}
				else
				{
					this.pict.log.info(`RecordSetDashboard: Rendered list ${tmpRecordDashboardData.RecordSet} with ${tmpRecordDashboardData.Records.Records.length} records.`);
				}
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

