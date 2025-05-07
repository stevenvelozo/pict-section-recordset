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
		{~T:PRSP-List-Template-Header-Template~}
		{~T:PRSP-List-Template-Filter-Template~}
		{~T:PRSP-List-PaginationTop-Template~}
		{~T:PRSP-List-Template-RecordList~}
		{~T:PRSP-List-PaginationBottom-Template~}
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

	onInitialize()
	{
		this.childViews.headerList = this.pict.addView('PRSP-List-HeaderList', this.options, viewHeaderList);
		this.childViews.title = this.pict.addView('PRSP-List-Title', this.options, viewTitle);
		this.childViews.paginationTop = this.pict.addView('PRSP-List-PaginationTop', this.options, viewPaginationTop);
		this.childViews.recordList = this.pict.addView('PRSP-List-RecordList', this.options, viewRecordList);
		this.childViews.recordListHeader = this.pict.addView('PRSP-List-RecordListHeader', this.options, viewRecordListHeader);
		this.childViews.recordListEntry = this.pict.addView('PRSP-List-RecordListEntry', this.options, viewRecordListEntry);
		this.childViews.paginationBottom = this.pict.addView('PRSP-List-PaginationBottom', this.options, viewPaginationBottom);

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

