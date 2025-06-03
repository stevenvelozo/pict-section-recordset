const libPictRecordSetRecordView = require('../RecordSet-RecordBaseView.js');


const viewHeaderRead = require('./RecordSet-Read-HeaderRead.js');
const viewRecordRead = require('./RecordSet-Read-RecordRead.js');
const viewRecordReadExtra = require('./RecordSet-Read-RecordReadExtra.js');
const viewTabBarRead = require('./RecordSet-Read-TabBarRead.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION__Read = (
	{
		ViewIdentifier: 'PRSP-Read',

		DefaultRenderable: 'PRSP_Renderable_Read',
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
					Hash: 'PRSP-Read-Template',
					Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Read-Template] -->
	<h1>{~D:Record.RecordSet~} {~D:Record.GUIDAddress~} [{~D:Record.RecordConfiguration.GUIDRecord~}]</h1>
	<!--
	{~DJ:Record~}
	-->
	{~T:PRSP-Read-RecordRead-Template~}
	<!-- DefaultPackage end view template:  [PRSP-Read-Template] -->
	`
				},
				{
					Hash: 'PRSP-Read-Link-Name-Template',
					Template: `View`
				},
				{
					Hash: 'PRSP-Read-Link-URL-Template',
					// TODO: Double payload pattern...
					Template: `#/PSRS/{~D:Record.Payload.Payload.RecordSet~}/Read/{~DVBK:Record.Payload.Data:Record.Payload.Payload.GUIDAddress~}`
				},
			],

		Renderables:
			[
				{
					RenderableHash: 'PRSP_Renderable_Read',
					TemplateHash: 'PRSP-Read-Template',
					DestinationAddress: '#PRSP_Container',
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
			viewHeaderRead: null,
			viewTabBarRead: null,
			viewRecordRead: null,
			viewRecordReadExtra: null
		};
	}


	handleRecordSetReadRoute(pRoutePayload)
	{
		if (typeof(pRoutePayload) != 'object')
		{
			throw new Error(`Pict RecordSet Read view route handler called with invalid route payload.`);
		}

		const tmpProviderConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations[pRoutePayload.data.RecordSet];
		const tmpProviderHash = `RSP-Provider-${pRoutePayload.data.RecordSet}`;

		tmpProviderConfiguration.RoutePayload = pRoutePayload;
		tmpProviderConfiguration.RecordSet = pRoutePayload.data.RecordSet;
		tmpProviderConfiguration.GUIDRecord = pRoutePayload.data.GUIDRecord;

		return this.renderRead(tmpProviderConfiguration, tmpProviderHash, pRoutePayload.data.GUIDRecord);
	}

	addRoutes(pPictRouter)
	{
		pPictRouter.addRoute('/PSRS/:RecordSet/Read/:GUIDRecord', this.handleRecordSetReadRoute.bind(this));
		return true;
	}

	onBeforeRenderRead(pRecordReadData)
	{
		this.formatDisplayData(pRecordReadData);
		return pRecordReadData;
	}

	formatDisplayData(pRecordListData)
	{
		pRecordListData.DisplayFields = [];
		const tmpSchema = pRecordListData.RecordSchema;
		const tmpProperties = tmpSchema?.properties;
		// loop throught the schema and add the columns to the tableCells -- just show all for now.
		for (const tmpColumn in tmpProperties)
		{
			pRecordListData.DisplayFields.push({
				'Key': tmpColumn,
				'DisplayName': tmpProperties?.[tmpColumn].title || tmpColumn,
			});
		}
		return pRecordListData;
	}

	async renderRead(pRecordConfiguration, pProviderHash, pRecordGUID)
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
		// TODO: This should be coming from the schema but that can come after we discuss how we deal with default routing
		tmpRecordReadData.GUIDAddress = `GUID${this.pict.providers[pProviderHash].options.Entity}`;

		tmpRecordReadData.Record = await this.pict.providers[pProviderHash].getRecordByGUID(pRecordGUID);
		tmpRecordReadData.RecordSchema = await this.pict.providers[pProviderHash].getRecordSchema();

		tmpRecordReadData = this.onBeforeRenderRead(tmpRecordReadData);

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
					this.pict.log.info(`RecordSetRead: Rendered read ${tmpRecordReadData.RecordSet} with ${tmpRecordReadData.RecordConfiguration.GUIDRecord} []`, tmpRecordReadData);
				}
				else
				{
					this.pict.log.info(`RecordSetRead: Rendered read ${tmpRecordReadData.RecordSet} with ${tmpRecordReadData.RecordConfiguration.GUIDRecord} []`);
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

		// Add the route templates for the read view
		this.pict.PictSectionRecordSet.addRecordLinkTemplate('PRSP-Read-Link-Name-Template', 'PRSP-Read-Link-URL-Template', true);

		return super.onInitialize();
	}
}

module.exports = viewRecordSetRead;

module.exports.default_configuration = _DEFAULT_CONFIGURATION__Read;

