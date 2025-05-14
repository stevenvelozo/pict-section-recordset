const libPictView = require('pict-view');

const viewHeaderRead = require('./RecordSet-Read-HeaderRead.js');
const viewRecordRead = require('./RecordSet-Read-RecordRead.js');
const viewRecordReadExtra = require('./RecordSet-Read-RecordReadExtra.js');
const viewTabBarRead = require('./RecordSet-Read-TabBarRead.js');

const _DEFAULT_CONFIGURATION__Read = (
	{
		ViewIdentifier: 'PRSP-Read',

		DefaultRenderable: 'PRSP_Renderable_Read',
		DefaultDestinationAddress: '#PRSP_Read_Container',
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
					Hash: 'PRSP-Read-Template',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Read-Template] -->
	<!-- DefaultPackage end view template:  [PRSP-Read-Template] -->
	`
				}
			],

		Renderables:
			[
				{
					RenderableHash: 'PRSP_Renderable_Read',
					TemplateHash: 'PRSP-Read-Template',
					DestinationAddress: '#PRSP_Read_Container',
					RenderMethod: 'replace'
				}
			],

		Manifests: {}
	});

class viewRecordSetRead extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION__Read, pOptions);
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

	onBeforeRenderRead(pRecordReadData)
	{
		return pRecordReadData;
	}

	onInitialize()
	{
		// this.childViews.headerList = this.pict.addView('PRSP-List-HeaderList', viewHeaderList.default_configuration, viewHeaderList);
		// this.childViews.title = this.pict.addView('PRSP-List-Title', viewTitle.default_configuration, viewTitle);
		// this.childViews.paginationTop = this.pict.addView('PRSP-List-PaginationTop', viewPaginationTop.default_configuration, viewPaginationTop);
		// this.childViews.recordList = this.pict.addView('PRSP-List-RecordList', viewRecordList.default_configuration, viewRecordList);
		// this.childViews.recordListHeader = this.pict.addView('PRSP-List-RecordListHeader', viewRecordListHeader.default_configuration, viewRecordListHeader);
		// this.childViews.recordListEntry = this.pict.addView('PRSP-List-RecordListEntry', viewRecordListEntry.default_configuration, viewRecordListEntry);
		// this.childViews.paginationBottom = this.pict.addView('PRSP-List-PaginationBottom', viewPaginationBottom.default_configuration, viewPaginationBottom);

		// // Initialize the subviews
		// this.childViews.headerList.initialize();
		// this.childViews.title.initialize();
		// this.childViews.paginationTop.initialize();
		// this.childViews.recordList.initialize();
		// this.childViews.recordListHeader.initialize();
		// this.childViews.recordListEntry.initialize();
		// this.childViews.paginationBottom.initialize();

		return super.onInitialize();
	}
}

module.exports = viewRecordSetRead;

module.exports.default_configuration = _DEFAULT_CONFIGURATION__Read;

