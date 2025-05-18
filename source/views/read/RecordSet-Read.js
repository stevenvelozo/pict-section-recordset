const libPictRecordSetRecordView = require('../RecordSet-RecordBaseView.js');


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

class viewRecordSetRead extends libPictRecordSetRecordView
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

	async renderRead(pRecordConfiguration, pProviderHash, pFilterString, pOffset, pPageSize)
	{
		// Get the records
		if (!(pProviderHash in this.pict.providers))
		{
			this.pict.log.error(`RecordSetRead: No provider found for ${pProviderHash} in ${pRecordConfiguration.RecordSet}.  Read Render failed.`);
			return false;
		}

		let tmpRecordReadData =
			{
				"RecordSet": pRecordConfiguration.RecordSet,

				"RecordConfiguration": pRecordConfiguration,

				"RenderDestination": this.options.DefaultDestinationAddress,

				"Record": false,
			};

		// If the record configuration does not have a GUID, try to infer one from the RecordSet name
		if (!tmpRecordReadData.RecordConfiguration.GUIDAddress)
		{
			// So this will be something like "GUIDBook" or "GUIDAuthor"
			tmpRecordReadData.RecordConfiguration.GUIDAddress = `GUID${pRecordConfiguration.RecordSet}`;
		}

		tmpRecordReadData.Records = await this.pict.providers[pProviderHash].getRecords({Offset:tmpRecordReadData.Offset, PageSize:tmpRecordReadData.PageSize});
		tmpRecordReadData.TotalRecordCount = await this.pict.providers[pProviderHash].getRecordSetCount({Offset:tmpRecordReadData.Offset, PageSize:tmpRecordReadData.PageSize});
		tmpRecordReadData.RecordSchema = this.pict.providers[pProviderHash].recordSchema;

		tmpRecordReadData = this.onBeforeRenderRead(tmpRecordReadData);

		// If there isn't a title template passed in as part of the configuration,, create one.
		if (!tmpRecordReadData.RecordConfiguration.TitleTemplate)
		{
			// This dynamically grabs the guid address and tries to pull it from the record
			tmpRecordReadData.RecordConfiguration.TitleTemplate = `{~D:Record.RecordSet~} GUID [{~D:Record.Record.${tmpRecordReadData.RecordConfiguration.GUIDAddress}}] `;
		}


		this.renderAsync('PRSP_Renderable_Read', tmpRecordReadData.RenderDestination, tmpRecordReadData,
			function (pError)
			{
				if (pError)
				{
					this.pict.log.error(`RecordSetRead: Error rendering read ${pError}`, tmpRecordReadData);
					return false;
				}

				if (this.pict.LogNoisiness > 0)
				{
					this.pict.log.info(`RecordSetRead: Rendered read ${tmpRecordReadData.RecordSet} with ${tmpRecordReadData.RecordConfiguration.GUIDAddress} []`, tmpRecordReadData);
				}
				else
				{
					this.pict.log.info(`RecordSetRead: Rendered read ${tmpRecordReadData.RecordSet} with ${tmpRecordReadData.RecordConfiguration.GUIDAddress} []`);
				}
				return true;
			}.bind(this));
	}

	onInitialize()
	{
		this.childViews.headerRead = this.pict.addView('PRSP-Read-HeaderRead', viewHeaderRead.default_configuration, viewHeaderRead);
		this.childViews.recordRead = this.pict.addView('PRSP-Read-RecordRead', viewRecordRead.default_configuration, viewRecordRead);
		this.childViews.recordReadExtra = this.pict.addView('PRSP-Read-RecordReadExtra', viewRecordReadExtra.default_configuration, viewRecordReadExtra);
		this.childViews.tabBarRead = this.pict.addView('PRSP-Read-TabBarRead', viewTabBarRead.default_configuration, viewTabBarRead);

		// // Initialize the subviews
		this.childViews.headerRead.initialize();
		this.childViews.recordRead.initialize();
		this.childViews.recordReadExtra.initialize();
		this.childViews.tabBarRead.initialize();

		return super.onInitialize();
	}
}

module.exports = viewRecordSetRead;

module.exports.default_configuration = _DEFAULT_CONFIGURATION__Read;

