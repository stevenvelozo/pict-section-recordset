const libPictView = require('pict-view');

const viewHeaderList = require('./RecordSet-List-HeaderList.js');
const viewTitle = require('./RecordSet-List-Title.js');
const viewPaginationTop = require('./RecordSet-List-PaginationTop.js');
const viewRecordList = require('./RecordSet-List-RecordList.js');
const viewRecordListHeader = require('./RecordSet-List-RecordListHeader.js');
const viewRecordListEntry = require('./RecordSet-List-RecordListEntry.js');
const viewPaginationBottom = require('./RecordSet-List-PaginationBottom.js');

const _DEFAULT_CONFIGURATION__List = (
	{
		ViewIdentifier: 'PRSP-List',

		DefaultRenderable: 'PRSP_Renderable_List',
		DefaultDestinationAddress: '#PRSP_List_Container',
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
					DestinationAddress: '#PRSP_List_Container',
					RenderMethod: 'replace'
				}
			],

		Manifests: {}
	});

class viewRecordSetList extends libPictView
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

	async renderList(pRecordSetConfiguration, pProviderHash, pFilterString, pOffset, pPageSize)
	{
		// Get the records
		if (!(pProviderHash in this.pict.providers))
		{
			this.pict.log.error(`RecordSetList: No provider found for ${pProviderHash} in ${pRecordSetConfiguration.RecordSet}.  List Render failed.`);
			return false;
		}

		let tmpResponse =
			{
				"Title": pRecordSetConfiguration.RecordSet,

				"RecordSet": pRecordSetConfiguration.RecordSet,
				"RecordSetConfiguration": pRecordSetConfiguration,

				"RenderDestination": this.options.DefaultDestinationAddress,

				"FilterString": pFilterString || '',

				"Records": [],
				"TotalRecordCount": -1,

				"Offset": pOffset || 0,
				"PageSize": pPageSize || 100
			};

		tmpResponse.Records = await this.pict.providers[pProviderHash].getRecords({Offset:tmpResponse.Offset, PageSize:tmpResponse.PageSize});
		tmpResponse.TotalRecordCount = await this.pict.providers[pProviderHash].getRecordSetCount({Offset:tmpResponse.Offset, PageSize:tmpResponse.PageSize});
		tmpResponse.RecordSchema = this.pict.providers[pProviderHash].recordSchema;

		this.renderAsync('PRSP_Renderable_List', tmpResponse.RenderDestination, tmpResponse,
			function (pError)
			{
				if (pError)
				{
					this.pict.log.error(`RecordSetList: Error rendering list ${pError}`, tmpResponse);
					return false;
				}

				if (this.pict.LogNoisiness > 0)
				{
					this.pict.log.info(`RecordSetList: Rendered list ${tmpResponse.RecordSet} with ${tmpResponse.Records.length} records.`, tmpResponse);
				}
				else
				{
					this.pict.log.info(`RecordSetList: Rendered list ${tmpResponse.RecordSet} with ${tmpResponse.Records.length} records.`);
				}
				return true;
			}.bind(this));
	}

	onInitialize()
	{
		this.childViews.headerList = this.pict.addView('PRSP-List-HeaderList', viewHeaderList.default_configuration, viewHeaderList);
		this.childViews.title = this.pict.addView('PRSP-List-Title', viewTitle.default_configuration, viewTitle);
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

