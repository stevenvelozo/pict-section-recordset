const libPictRecordSetRecordView = require('../RecordSet-RecordBaseView.js');

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
					Hash: 'PRSP-Read-RecordRead-Template',
					Template: /*html*/`
						<!-- DefaultPackage pict view template: [PRSP-Read-RecordRead-Template] -->
						<div>
							{~TSWP:PRSP-Read-RecordRead-Template-Row:Record.DisplayFields:Record.Record~}
						</div>
						{~T:PRSP-Read-RecordButtonBar-Template~}
						<!-- DefaultPackage end view template:  [PRSP-Read-RecordRead-Template] -->
					`
				},
				{
					Hash: 'PRSP-Read-RecordRead-Template-Row',
					Template: /*html*/`
						<!-- DefaultPackage pict view template: [PRSP-Read-RecordRead-Template] -->
						<div>
							<span style="font-style: italic;">{~D:Record.Data.DisplayName~}</span>
							<span style="font-weight: bold;">{~DVBK:Record.Payload:Record.Data.Key~}</span>
						</div>
						<!-- DefaultPackage end view template:  [PRSP-Read-RecordRead-Template] -->
					`
				},
				{
					Hash: 'PRSP-Read-RecordButtonBar-Template',
					Template: /*html*/`
						<style>
							.record-button-bar-hidden
							{
								display: none;
							}
							.record-button-bar
							{
								display: flex;
								margin-top: 15px;
							}
							.record-button-bar > button
							{
								margin-right: 10px;
							}
						</style>
						<div class="record-button-bar">
							<button id="PRSP-Read-CancelButton" type="button" onclick="_Pict.views['RSP-RecordSet-Read'].cancel()">Cancel</button>
							<button id="PRSP-Read-SaveButton" type="button" onclick="_Pict.views['RSP-RecordSet-Read'].save()">Save</button>
							<button id="PRSP-Read-EditButton" type="button" onclick="_Pict.views['RSP-RecordSet-Read'].edit()">Edit</button>
						</div>
					`
				},
				{
					Hash: 'PRSP-Read-RecordTab-Template',
					Template: /*html*/`<!-- Placeholder for tabs, something has gone wrong if this comment is rendered. -->`
				},
				{
					Hash: 'PRSP-Read-RecordTabNav-Template',
					Template: /*html*/`<!-- Placeholder for tabs, something has gone wrong if this comment is rendered. -->`
				},
				{
					Hash: 'PRSP-Read-Basic-Template',
					Template: /*html*/`
						<!-- DefaultPackage pict view template: [PRSP-Read-Basic-Template] -->
						<h1>{~D:Record.RecordSet~} {~D:Record.GUIDAddress~} [{~D:Record.RecordConfiguration.GUIDRecord~}]</h1>
						<!--
						{~DJ:Record~}
						-->
						<div>
							{~T:PRSP-Read-RecordRead-Template~}
						</div>
						<!-- DefaultPackage end view template:  [PRSP-Read-Basic-Template] -->
						`
				},
				{
					Hash: 'PRSP-Read-Split-Template',
					Template: /*html*/`
						<!-- DefaultPackage pict view template: [PRSP-Read-Split-Template] -->
						<h1>{~D:Record.RecordSet~} {~D:Record.GUIDAddress~} [{~D:Record.RecordConfiguration.GUIDRecord~}]</h1>
						<!--
						{~DJ:Record~}
						-->
						<style>
							.psrs-split-view
							{
								display: flex;
								height: 100%;
							}
							.psrs-left-panel
							{
								overflow: scroll;
							}
							.psrs-right-panel
							{
								overflow: scroll;
							}
							#psrs-resize
							{
								width: 1px; 
								padding-left: 10px;
								padding-right: 10px;
								cursor: col-resize;
							}
							#psrs-resize > div
							{
								width: 1px;
								height: 100%;
								background-color: rgba(0,0,0,0.5);
							}
							#PRSP-Read-Tab-Nav
							{
								display: flex;
								border-bottom: 1px solid rgba(0,0,0,0.5);
								margin-bottom: 20px;
								width: 100%;
							}
							.psrs-tab.is-active
							{
								border: 1px solid rgba(0,0,0,0.5);
							}
							.psrs-tab
							{
								border-right: 1px solid rgba(0,0,0,0.5);
								border-left: 1px solid rgba(0,0,0,0.5);
								padding: 10px;
							}
							.psrs-tab-body
							{
								display: none;
							}
							.psrs-tab-body.is-active
							{
								display: inherit;
							}
						</style>
						<div class="psrs-split-view">
							<div class="psrs-left-panel" style="min-width: 50%;">
								{~T:PRSP-Read-RecordRead-Template~}
							</div>
							<div id="psrs-resize">
								<div></div>
							</div>
							<div class="psrs-right-panel" style="width: 100%;">
								<div id="PRSP-Read-Tabs-Container">
									{~T:PRSP-Read-RecordTabNav-Template~}
									{~T:PRSP-Read-RecordTab-Template~}
								</div>
							</div>
						</div>
						<!-- DefaultPackage end view template:  [PRSP-Read-Split-Template] -->
						`
				},
				{
					Hash: 'PRSP-Read-Tab-Template',
					Template: /*html*/`
						<!-- DefaultPackage pict view template: [PRSP-Read-Tab-Template] -->
						<h1>{~D:Record.RecordSet~} {~D:Record.GUIDAddress~} [{~D:Record.RecordConfiguration.GUIDRecord~}]</h1>
						<!--
						{~DJ:Record~}
						-->
						<style>
							#PRSP-Read-Tab-Nav
							{
								display: flex;
								border-bottom: 1px solid rgba(0,0,0,0.5);
								margin-bottom: 20px;
								width: 100%;
							}
							.psrs-tab.is-active
							{
								border: 1px solid rgba(0,0,0,0.5);
							}
							.psrs-tab
							{
								padding: 10px;
								border-right: 1px solid rgba(0,0,0,0.5);
								border-left: 1px solid rgba(0,0,0,0.5);
							}
							.psrs-tab-body
							{
								display: none;
							}
							.psrs-tab-body.is-active
							{
								display: inherit;
							}
						</style>
						<div class="psrs-tab-view">
							<div id="PRSP-Read-Tabs-Container">
								{~T:PRSP-Read-RecordTabNav-Template~}
								{~T:PRSP-Read-RecordTab-Template~}
							</div>
						</div>
						<!-- DefaultPackage end view template:  [PRSP-Read-Tab-Template] -->
						`
				},
				{
					Hash: 'PRSP-Read-Link-Name-Template',
					Template: `View`
				},
				{
					Hash: 'PRSP-Read-Link-URL-Template',
					// TODO: Double payload pattern...
					Template: `#/PSRS/{~D:Record.Payload.Payload.RecordSet~}/View/{~DVBK:Record.Payload.Data:Record.Payload.Payload.GUIDAddress~}`
				},
			],

		Renderables:
			[
				{
					RenderableHash: 'PRSP_Renderable_Read_Basic',
					TemplateHash: 'PRSP-Read-Basic-Template',
					DestinationAddress: '#PRSP_Container',
					RenderMethod: 'replace'
				},
				{
					RenderableHash: 'PRSP_Renderable_Read_Split',
					TemplateHash: 'PRSP-Read-Split-Template',
					DestinationAddress: '#PRSP_Container',
					RenderMethod: 'replace'
				},
				{
					RenderableHash: 'PRSP_Renderable_Read_Tab',
					TemplateHash: 'PRSP-Read-Tab-Template',
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

		this.layoutType = 'Basic';
		this.action = 'View';
		this.tabs = [];
		this.RecordSet = null;
		this.providerHash = null;
		this.activeTab = null;
		this.mouseHandler = null;
		this.manifest = null;
		this.defaultManifest = null;
		this.GUID = null;
	}

	initializeDragListener()
	{
		let isResizing = false;
		const handleMouseMove = (event) =>
		{
			const resizer = document.getElementById("psrs-resize");
			const leftPanel = document.querySelector(".psrs-left-panel");
			const rightPanel = document.querySelector(".psrs-right-panel");
			if (!isResizing || !(resizer.parentNode instanceof HTMLElement && leftPanel instanceof HTMLElement && rightPanel instanceof HTMLElement))
			{
				return;
			}
			const containerRect = resizer.parentNode.getBoundingClientRect();
			const newLeftWidth = event.clientX - containerRect.left;
			const newRightWidth = containerRect.width - newLeftWidth - resizer.offsetWidth;
			leftPanel.style.width = `${newLeftWidth}px`;
			leftPanel.style.minWidth = `${newLeftWidth}px`;
			rightPanel.style.width = `${newRightWidth}px`;
		}
		if (!this.mouseHandler)
		{
			this.mouseHandler = (event) =>
			{
				isResizing = true;
				document.body.style.userSelect = "none";
				document.addEventListener("mousemove", handleMouseMove);
				document.addEventListener("mouseup", () =>
				{
					isResizing = false;
					document.body.style.userSelect = "";
					document.removeEventListener("mousemove", handleMouseMove);
				});
			};
		}
		const resizer = document.getElementById("psrs-resize");
		resizer.removeEventListener('mousedown', this.mouseHandler);
		resizer.addEventListener("mousedown", this.mouseHandler);
	}

	onAfterRender(pRenderable)
	{
		if (this.layoutType == 'Split')
		{
			this.initializeDragListener();
		}
		
		return super.onAfterRender(pRenderable);
	}

	handleRecordSetReadRoute(pRoutePayload)
	{
		if (typeof(pRoutePayload) != 'object')
		{
			throw new Error(`Pict RecordSet Read view route handler called with invalid route payload.`);
		}

		this.action = 'View';
		const tmpProviderConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations[pRoutePayload.data.RecordSet];
		this.layoutType = tmpProviderConfiguration?.ReadLayout || 'Basic'; 
		const tmpProviderHash = `RSP-Provider-${pRoutePayload.data.RecordSet}`;

		tmpProviderConfiguration.RoutePayload = pRoutePayload;
		tmpProviderConfiguration.RecordSet = pRoutePayload.data.RecordSet;
		tmpProviderConfiguration.GUIDRecord = pRoutePayload.data.GUIDRecord;

		return this.renderRead(tmpProviderConfiguration, tmpProviderHash, pRoutePayload.data.GUIDRecord);
	}

	handleRecordSetEditRoute(pRoutePayload)
	{
		if (typeof(pRoutePayload) != 'object')
		{
			throw new Error(`Pict RecordSet Read view route handler called with invalid route payload.`);
		}

		this.action = 'Edit';
		const tmpProviderConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations[pRoutePayload.data.RecordSet];
		this.layoutType = tmpProviderConfiguration?.ReadLayout || 'Basic'; 
		const tmpProviderHash = `RSP-Provider-${pRoutePayload.data.RecordSet}`;

		tmpProviderConfiguration.RoutePayload = pRoutePayload;
		tmpProviderConfiguration.RecordSet = pRoutePayload.data.RecordSet;
		tmpProviderConfiguration.GUIDRecord = pRoutePayload.data.GUIDRecord;

		return this.renderRead(tmpProviderConfiguration, tmpProviderHash, pRoutePayload.data.GUIDRecord);
	}

	addRoutes(pPictRouter)
	{
		pPictRouter.addRoute('/PSRS/:RecordSet/View/:GUIDRecord', this.handleRecordSetReadRoute.bind(this));
		pPictRouter.addRoute('/PSRS/:RecordSet/Edit/:GUIDRecord', this.handleRecordSetEditRoute.bind(this));
		return true;
	}

	async cancel()
	{
		await this.onBeforeView();
		this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${ this.RecordSet }/View/${ this.GUID }`);
	}

	async save()
	{
		await this.onBeforeSave();
		await this.pict.providers[this.providerHash].updateRecord(this.pict.AppData[`${ this.RecordSet }Details`]);
		await this.onBeforeView();
		this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${ this.RecordSet }/View/${ this.GUID }`);
	}

	async edit()
	{
		await this.onBeforeEdit();
		this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${ this.RecordSet }/Edit/${ this.GUID }`);
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

	async onBeforeEdit()
	{
		// Hook that is called when transitioning to edit mode. 
	}

	async onBeforeSave()
	{
		// Hook that is called before saving.
	}

	async onBeforeView()
	{
		// Hook that is called when transitioning to view mode. 
	}

	async onBeforeTabChange()
	{
		// Hook that is called when transitioning between tabs.
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

		this.GUID = pRecordGUID;

		if (pRecordConfiguration.RecordSet !== this.RecordSet)
		{
			this.RecordSet = pRecordConfiguration.RecordSet;
			this.activeTab = null;
		}

		this.providerHash = pProviderHash;

		// If the record configuration does not have a GUID, try to infer one from the RecordSet name
		// TODO: This should be coming from the schema but that can come after we discuss how we deal with default routing
		tmpRecordReadData.GUIDAddress = `GUID${ this.pict.providers[pProviderHash].options.Entity }`;

		tmpRecordReadData.Record = await this.pict.providers[pProviderHash].getRecordByGUID(pRecordGUID);
		tmpRecordReadData.RecordSchema = await this.pict.providers[pProviderHash].getRecordSchema();
		this.pict.AppData[`${ tmpRecordReadData.RecordSet }Details`] = tmpRecordReadData.Record;

		if (pRecordConfiguration.RecordSetReadManifestOnly)
		{
			this.pict.TemplateProvider.addTemplate(`PRSP-Read-RecordRead-Template`, /*html*/`
				<!-- Manifest dynamic pict template: [PRSP-Read-RecordRead-Template] -->
				<div>${ this._generateManifestTemplate(pRecordConfiguration, 'RecordRead', null, true) }</div>
				{~T:PRSP-Read-RecordButtonBar-Template~}
				<!-- Manifest dynamic pict end template: [PRSP-Read-RecordRead-Template] -->
			`);
		}
		else
		{
			// Construct a default manifest based on the RecordSchema:
			this.defaultManifest = 
			{
				"Form": "DefaultManifest",
				"Scope": "Default",
				"Descriptors": {},
				"Sections": 
				[
					{
						"Name": "",
						"Hash": "DefaultSection",
						"Solvers": [],
						"ShowTitle": false,
						"Groups": [
							{
								"Name": "",
								"Hash": "DefaultGroup",
								"Rows": [],
								"RecordSetSolvers": [],
								"ShowTitle": false
							}
						]
					}
				]
			}
			let rowCounter = 1;
			for (const p of Object.keys(tmpRecordReadData.RecordSchema.properties))
			{
				const exclusionSet = [`ID${ this.pict.providers[this.providerHash].options.Entity  }`, `GUID${ this.pict.providers[this.providerHash].options.Entity  }`, 'CreatingIDUser', 'UpdatingIDUser', 'DeletingIDUser', 'Deleted', 'CreateDate', 'UpdateDate', 'DeleteDate', 'Deleted'];
				if (exclusionSet.includes(p))
				{
					continue;
				}
				const tmpDescriptor =
				{
					"Name": `${ this.pict.providers[pProviderHash].getHumanReadableFieldName?.() || p }`,
					"Hash": `${ this.pict.providers[this.providerHash].options.Entity  }-${ p }`,
					"DataType": "String",
					"PictForm": 
					{
						"Row": `${ rowCounter }`,
						"Section": "DefaultSection",
						"Group": "DefaultGroup"
					}
				};
				rowCounter += 1;
				switch (tmpRecordReadData.RecordSchema.properties[p].type)
				{
					case 'string':
					case 'autoguid':
						tmpDescriptor.DataType = 'String';
						break;
					case 'datetime':
					case 'date':
					case 'createdate':
					case 'updatedate':
						tmpDescriptor.DataType = 'String';
						tmpDescriptor.PictForm.InputType = 'DateTime'
						break;
					case 'boolean':
					case 'deleted':
						tmpDescriptor.DataType = 'Boolean';
					case 'integer':
					case 'decimal':
					case 'autoidentity':
					case 'createiduser':
					case 'updateiduser':
					case 'deleteiduser':
						tmpDescriptor.DataType = 'Number';
						break;
					default:
						tmpDescriptor.DataType = 'String';
				}

				this.defaultManifest.Descriptors[`${ tmpRecordReadData.RecordSet }Details.${ p }`] = tmpDescriptor;
			}
			this.pict.TemplateProvider.addTemplate(`PRSP-Read-RecordRead-Template`, /*html*/`
				<!-- Manifest dynamic pict template: [PRSP-Read-RecordRead-Template] -->
				<div>${ this._generateManifestTemplate(pRecordConfiguration, 'RecordRead', null, true, this.action, true) }</div>
				{~T:PRSP-Read-RecordButtonBar-Template~}
				<!-- Manifest dynamic pict end template: [PRSP-Read-RecordRead-Template] -->
			`);
		}

		if (this.layoutType !== 'Basic')
		{
			this.tabs = await this._structureTabs(pRecordConfiguration, tmpRecordReadData.Record);
			this.pict.TemplateProvider.addTemplate('PRSP-Read-RecordTab-Template', /*html*/`
				<!-- DefaultPackage pict view template: [PRSP-Read-RecordTab-Template] -->
				${ this.tabs.map((t) => t.Template).join('') }
				<!-- DefaultPackage end view template:  [PRSP-Read-RecordTab-Template] -->
			`);
			this.pict.TemplateProvider.addTemplate('PRSP-Read-RecordTabNav-Template', /*html*/`
				<!-- DefaultPackage pict view template: [PRSP-Read-RecordTabNav-Template] -->
				<div id="PRSP-Read-Tab-Nav">
					${ this.tabs.map((t) => t.TabTemplate).join('') }
				</div>
				<!-- DefaultPackage end view template:  [PRSP-Read-RecordTabNav-Template] -->
			`);
		}

		tmpRecordReadData = this.onBeforeRenderRead(tmpRecordReadData);

		this.renderAsync(`PRSP_Renderable_Read_${ this.layoutType }`, tmpRecordReadData.RenderDestination, tmpRecordReadData,
			async function (pError)
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
				for (const s of this.manifest?.Sections || [])
				{
					this.pict.views[`PictSectionForm-${ s.Hash }`].render();
					this.pict.views[`PictSectionForm-${ s.Hash }`].marshalToView();
				}
				for (const t of this.tabs)
				{
					if (t.renderAsync)
					{
						await t.renderAsync();
					}
					else
					{
						t.render();
					}
				}
				if (this.action == 'Edit')
				{
					document.getElementById('PRSP-Read-EditButton').classList.add('record-button-bar-hidden');
					document.getElementById('PRSP-Read-SaveButton').classList.remove('record-button-bar-hidden');
					document.getElementById('PRSP-Read-CancelButton').classList.remove('record-button-bar-hidden');
				}
				else
				{
					document.getElementById('PRSP-Read-EditButton').classList.remove('record-button-bar-hidden');
					document.getElementById('PRSP-Read-SaveButton').classList.add('record-button-bar-hidden');
					document.getElementById('PRSP-Read-CancelButton').classList.add('record-button-bar-hidden');
				}
				this.setTab(this.activeTab || this.tabs?.[0]?.Hash);
				return true;
			}.bind(this));
	}

	async setTab(t)
	{
		if (this.activeTab !== t)
		{
			await this.onBeforeTabChange();
		}
		this.activeTab = t;
		const tabSet = document.querySelectorAll('.psrs-tab');
		const tabBodySet = document.querySelectorAll('.psrs-tab-body');
		for (const tb of tabSet)
		{
			tb.classList.remove('is-active');
			if (tb.id == `PSRS-TabNav-${ t }`)
			{
				tb.classList.add('is-active');
			}
		}
		for (const tb of tabBodySet)
		{
			tb.classList.remove('is-active');
			if (tb.id == `PSRS-Tab-${ t }`)
			{
				tb.classList.add('is-active');
			}
		}
	}

	_generateManifestTemplate(config, section, specificManifest, setBaseManifest, action = this.action, useDefaultManifest)
	{
		// Look for a manifest by the action (if there is no specific manifest passed) and fallback to view if the action manifest isn't present.
		const tmpManifestHash = specificManifest || config[`RecordSetReadDefaultManifest${ action }`] || config[`RecordSetReadManifests${ action }`]?.[0] || config[`RecordSetReadDefaultManifestView`] || config[`RecordSetReadManifestsView`]?.[0];
		// Make sure the copy of the manifest doesn't mutate the original (for read only handling).
		const tmpManifest = JSON.parse(JSON.stringify(useDefaultManifest ? this.defaultManifest : this.pict.PictSectionRecordSet.getManifest(tmpManifestHash)));
		if (!tmpManifest)
		{
			this.pict.log.error(`RecordSetRead: No manifest found for ${ config.RecordSet }. Read Render failed.`);
			return '';
		}
		if (!tmpManifest.Descriptors)
		{
			this.pict.log.error(`RecordSetRead: No manifest descriptors found for manifest ${ tmpManifestHash }. Read Render failed.`);
			return '';
		}
		else if (action == 'View' && !config.RecordSetReadOverrideReadOnly)
		{
			// If we are in view mode, apply the read only type unless overriden.
			for (const x of Object.keys(tmpManifest.Descriptors))
			{
				if (!tmpManifest.Descriptors[x].PictForm)
				{
					tmpManifest.Descriptors[x].PictForm = {};
				}
				tmpManifest.Descriptors[x].PictForm.InputType = 'ReadOnly';
			}
		}
		if (setBaseManifest)
		{
			this.manifest = tmpManifest;
		}
		let sectionsTemplate = '';
		// Clear any stale views in PictSectionForm before reinstantiating (if we don't the read only state doesn't get cleared).
		for (const s of tmpManifest?.Sections || [])
		{
			delete this.pict.views[`PictSectionForm-${ s.Hash }`]
		}
		this.pict.views.PictFormMetacontroller.bootstrapPictFormViewsFromManifest(tmpManifest);

		for (const pickList of tmpManifest?.PickLists || [])
		{
			this.pict.providers.DynamicMetaLists.rebuildListByHash(pickList.Hash);
		}

		for (const s of tmpManifest?.Sections || [])
		{
			const viewSectionID = `PSRS-Read-${ section }-Section-${ s.Hash }`;
			sectionsTemplate += /*html*/`<div id="${ viewSectionID }"></div>`;
			this.pict.views[`PictSectionForm-${ s.Hash }`].viewMarshalDestination = 'AppData';
			this.pict.views[`PictSectionForm-${ s.Hash }`].options.DefaultDestinationAddress = `#${ viewSectionID }`;
			this.pict.views[`PictSectionForm-${ s.Hash }`].rebuildCustomTemplate();
		}
		return sectionsTemplate
	}

	async _structureTabs(config, record)
	{
		const validTabs = config.ReadLayout == 'Tab' ? 
		[
			{
				Type: 'Record',
				RecordSet: config.RecordSet,
				Title: config.RecordSetReadTabTitle || 'Record',
				Hash: 'Record',
				Template: /*html*/`
					<div id="PSRS-Tab-Record" class="psrs-tab-body">{~T:PRSP-Read-RecordRead-Template~}</div>
				`,
				TabTemplate: /*html*/`
					<div class="psrs-tab" id="PSRS-TabNav-Record" onclick="_Pict.views['RSP-RecordSet-Read'].setTab('Record')">${ config.RecordSetReadTabTitle || 'Record' }</div>
				`,
				render: () => {}
			}
		] : [];

		for (const t of config.RecordSetReadTabs)
		{
			if (!t.Title)
			{
				this.pict.log.info('Skipping tab that is missing title.');
				continue;
			}
			if (!t.Hash)
			{
				t.Hash = t.Title.replaceAll(' ', '');
			}
			if (t.Type == 'Manifest' || t.Type == 'AttachedRecord')
			{
				if (t.Type == 'AttachedRecord')
				{
					const getMethod = async (remote, id) => {
						if (this.pict.providers[`RSP-Provider-${ remote }`])
						{
							return await this.pict.providers[`RSP-Provider-${ remote }`].getRecord(id);
						}
						else
						{
							return await new Promise((resolve, reject) =>
							{
								this.pict.EntityProvider.getEntity(remote, id, (pError, pResult) =>
								{
									if (pError)
									{
										resolve(null);
									}
									resolve(pResult);
								});
							});
						}
					};

					const getJoin = async (remote, field, value) => {
						let result = null;
						if (this.pict.providers[`RSP-Provider-${ remote }`])
						{
							result = await this.pict.providers[`RSP-Provider-${ remote }`].getRecordsInline(`FBV~${ field }~EQ~${ value }`);
						}
						else
						{
							result = await new Promise((resolve, reject) =>
							{
								this.pict.EntityProvider.getEntitySet(remote, `FBV~${ field }~EQ~${ value }`, (pError, pResult) =>
								{
									if (pError)
									{
										resolve(null);
									}
									resolve(pResult);
								});
							});
						}
						return result?.[0] || null;
					};
					
					if (!t.RecordSet)
					{
						this.pict.log.info(`Skipping attached record tab because no recordset was included.`);
					}
					const recordSetConfig = this.pict.PictSectionRecordSet.recordSetProviderConfigurations[t.RecordSet];
					if (!recordSetConfig)
					{
						this.pict.log.info(`Skipping attached record tab because recordset ${ t.RecordSet } is not registered.`);
						continue;
					}
					t.Manifest = recordSetConfig.RecordSetReadDefaultManifestView || recordSetConfig.RecordSetReadManifestsView?.[0];
					if (!t.JoinField)
					{
						t.JoinField = `ID${ recordSetConfig.RecordSetMeadowEntity || recordSetConfig.RecordSet }`;
					}
					if (t.JoiningRecordSet)
					{
						if (!t.BaseField)
						{
							t.BaseField = `ID${ config.RecordSetMeadowEntity || config.RecordSet }`;
						}
						if (!record[t.BaseField])
						{
							this.pict.log.info(`Skipping attached record tab because field ${ t.BaseField } does not exist on this record.`);
							continue;
						}
						const tempJoin = await getJoin(t.JoiningRecordSet, t.BaseField, record[t.BaseField]);
						if (!tempJoin?.[t.JoinField])
						{
							this.pict.log.info(`Skipping attached record tab because joining field ${ t.JoinField } does not exist on this record.`);
							continue;
						}
						const tempRecord = await getMethod(recordSetConfig.RecordSetMeadowEntity || recordSetConfig.RecordSet, tempJoin[t.JoinField]);
						this.pict.AppData[`${ t.RecordSet }Details`] = tempRecord;
					}
					else
					{
						if (!record[t.Joinfield])
						{
							this.pict.log.info(`Skipping attached record tab because joining field ${ t.JoinField } does not exist on this record.`);
							continue;
						}
						const tempRecord = await getMethod(recordSetConfig.RecordSetMeadowEntity || recordSetConfig.RecordSet, record[t.Joinfield]);
						this.pict.AppData[`${ t.RecordSet }Details`] = tempRecord;
					}
				}
				if (!t.Manifest)
				{
					this.pict.log.info(`Skipping manifest tab because no manifest was included.`);
					continue;
				}
				const tmpManifest = this.pict.PictSectionRecordSet.getManifest(t.Manifest);
				if (!tmpManifest)
				{
					this.pict.log.info(`Skipping manifest tab because manifest ${ t.Manifest } is not registered.`);
					continue;
				}
				t.Template = /*html*/`
					<div id="PSRS-Tab-${ t.Hash }" class="psrs-tab-body">${ this._generateManifestTemplate(config, 'RecordTab', t.Manifest, false, 'View') }</div>
				`;
				t.TabTemplate = /*html*/`
					<div class="psrs-tab" id="PSRS-TabNav-${ t.Hash }" onclick="_Pict.views['RSP-RecordSet-Read'].setTab('${ t.Hash }')">${ t.Title }</div>
				`;
				t.render = () =>
				{
					// @ts-ignore
					for (const s of tmpManifest?.Sections || [])
					{
						this.pict.views[`PictSectionForm-${ s.Hash }`].render();
						this.pict.views[`PictSectionForm-${ s.Hash }`].marshalToView();
					}
				};
				validTabs.push(t);
			}
			else if (t.Type == 'View')
			{
				if (!t.View)
				{
					this.pict.log.info(`Skipping view tab because no view was included.`);
					continue;
				}
				const tmpView = this.pict.views[t.View];
				if (!tmpView)
				{
					this.pict.log.info(`Skipping view tab because view ${ t.View } is not registered.`);
					continue;
				}
				t.Template = /*html*/`
					<div id="PSRS-Tab-${ t.Hash }" class="psrs-tab-body"></div>
				`;
				t.TabTemplate = /*html*/`
					<div class="psrs-tab" id="PSRS-TabNav-${ t.Hash }" onclick="_Pict.views['RSP-RecordSet-Read'].setTab('${ t.Hash }')">${ t.Title }</div>
				`;
				tmpView.options.DefaultDestinationAddress = `#PSRS-Tab-${ t.Hash }`;
				t.render = () =>
				{
					this.pict.views[`${ t.View }`].renderAsync();
				};
				validTabs.push(t);
			}
		}
		return validTabs;
	}

	onInitialize()
	{

		// Add the route templates for the read view
		this.pict.PictSectionRecordSet.addRecordLinkTemplate('PRSP-Read-Link-Name-Template', 'PRSP-Read-Link-URL-Template', true);

		return super.onInitialize();
	}
}

module.exports = viewRecordSetRead;

module.exports.default_configuration = _DEFAULT_CONFIGURATION__Read;

