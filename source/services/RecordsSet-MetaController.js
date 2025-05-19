const libFableServiceProviderBase = require('fable-serviceproviderbase');

const viewRecordSetList = require('../views/list/RecordSet-List.js');
const viewRecordSetEdit = require('../views/edit/RecordSet-Edit.js');
const viewRecordSetRead = require('../views/read/RecordSet-Read.js');
const viewRecordSetDashboard = require('../views/dashboard/RecordSet-Dashboard.js');

//_Pict.addProvider('BooksProvider', { Entity: 'Book', URLPrefix: 'http://www.datadebase.com:8086/1.0/' }, require('../source/providers/RecordSet-RecordProvider-MeadowEndpoints.js'));
const providerBase = require('../providers/RecordSet-RecordProvider-Base.js');
const providerMeadowEndpoints = require('../providers/RecordSet-RecordProvider-MeadowEndpoints.js');

const providerLinkManager = require('../providers/RecordSet-Link-Manager.js');

const providerRouter = require('../providers/RecordSet-Router.js');

const _DEFAULT_CONFIGURATION =
	{
		DefaultMeadowURLPrefix: '/1.0/'
	};

class RecordSetMetacontroller extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		/** @type {import('pict') & { addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any }} */
		this.fable;
		/** @type {any} */
		this.log;
		/** @type {any} */
		this.options;
		/** @type {string} */
		this.UUID;

		this.childViews = {
			list: null,
			edit: null,
			read: null,
			dashboard: null
		};

		this.recordSetProviders = {};
		this.recordSetProviderConfigurations = {};

		this.recordSetListConfigurations = {};

		this.has_initialized = false;
	}

	/*
		"DefaultRecordSetConfigurations":
			[
				{
					"RecordSet": "Book",

					"RecordSetType": "MeadowEndpoint", // Could be "Custom" which would require a provider to already be created for the record set.
					"RecordSetMeadowEntity": "Book",   // This leverages the /Schema endpoint to get the record set columns.

					"RecordSetURLPrefix": "http://www.datadebase.com:8086/1.0/"
				},
				{
					"RecordSet": "Author",

					"RecordSetType": "MeadowEndpoint",
					"RecordSetMeadowEntity": "Author",

					"RecordSetURLPrefix": "http://www.datadebase.com:8086/1.0/"
				},
				{
					"RecordSet": "RandomizedValues",

					"RecordSetType": "Custom" // This means the `PS-RSP-RandomizedValues` provider will be checked for to get records.
				}
			]
	 */
	loadRecordSetConfiguration(pRecordSetConfiguration)
	{
		if (typeof pRecordSetConfiguration !== 'object')
		{
			this.fable.log.error(`RecordSetMetacontroller: ${this.UUID} loadRecordSetConfiguration called with invalid configuration.`);
			return false;
		}
		if ((!('RecordSet' in pRecordSetConfiguration)) || (pRecordSetConfiguration.RecordSet === ''))
		{
			this.fable.log.error(`RecordSetMetacontroller: ${this.UUID} loadRecordSetConfiguration called with invalid configuration. Missing RecordSet.`);
			return false;
		}

		let tmpExtraColumnHeaderTemplateHash = `RecordSet-List-ExtraColumnHeader-${pRecordSetConfiguration.RecordSet}`;
		pRecordSetConfiguration.RecordSetListExtraColumnsHeaderTemplateHash = tmpExtraColumnHeaderTemplateHash;
		let tmpExtraColumnRowTemplateHash = `RecordSet-List-ExtraColumnRow-${pRecordSetConfiguration.RecordSet}`;
		pRecordSetConfiguration.RecordSetListExtraColumnRowTemplateHash = tmpExtraColumnRowTemplateHash;
		if (pRecordSetConfiguration.RecordSetListHasExtraColumns)
		{
			let tmpRecordSetExtraColumnHeaderTemplate = pRecordSetConfiguration.RecordSetListExtraColumnsHeaderTemplate;
			if (tmpRecordSetExtraColumnHeaderTemplate === undefined)
			{
				tmpRecordSetExtraColumnHeaderTemplate = '';
			}
			let tmpRecordSetExtraColumnRowTemplate = pRecordSetConfiguration.RecordSetListExtraColumnRowTemplate;
			if (tmpRecordSetExtraColumnRowTemplate === undefined)
			{
				tmpRecordSetExtraColumnRowTemplate = '';
			}
			this.fable.TemplateProvider.addTemplate(tmpExtraColumnHeaderTemplateHash, tmpRecordSetExtraColumnHeaderTemplate);
			this.fable.TemplateProvider.addTemplate(tmpExtraColumnRowTemplateHash, tmpRecordSetExtraColumnRowTemplate);
		}
		else
		{
			this.fable.TemplateProvider.addTemplate(tmpExtraColumnHeaderTemplateHash, '');
			this.fable.TemplateProvider.addTemplate(tmpExtraColumnRowTemplateHash, '');
		}

		let tmpProvider = false;

		const providerConfiguration = Object.assign({}, {Hash: `RSP-Provider-${pRecordSetConfiguration.RecordSet}`}, pRecordSetConfiguration);
		this.recordSetProviderConfigurations[providerConfiguration.RecordSet] = providerConfiguration;

		switch (pRecordSetConfiguration.RecordSetType)
		{
			case 'MeadowEndpoint':
				// Create a Meadow Endpoints provider
				// Allow the Record Set to optionally point to a different entity
				if (`RecordSetMeadowEntity` in pRecordSetConfiguration)
				{
					providerConfiguration.Entity = pRecordSetConfiguration.RecordSetMeadowEntity;
				}
				else
				{
					providerConfiguration.Entity = pRecordSetConfiguration.RecordSet;
				}
				// Default the URLPrefix to the base URLPrefix
				if (`RecordSetURLPrefix` in pRecordSetConfiguration)
				{
					providerConfiguration.URLPrefix = pRecordSetConfiguration.RecordSetURLPrefix;
				}
				else
				{
					providerConfiguration.URLPrefix = '/1.0/';
				}
				tmpProvider = this.recordSetProviders[pRecordSetConfiguration.RecordSet] = this.fable.addProvider(providerConfiguration.Hash, providerConfiguration, providerMeadowEndpoints);
				break;
			default:
			case 'Custom':
				// Create a custom provider				
				if (`ProviderHash` in providerConfiguration)
				{
					if (!(providerConfiguration.ProviderHash in this.fable.servicesMap))
					{
						this.fable.log.error(`RecordSetMetacontroller: ${this.UUID} loadRecordSetConfiguration called with invalid configuration. ProviderHash ${providerConfiguration.ProviderHash} not found.  Falling back to base.`);
						tmpProvider = this.recordSetProviders[providerConfiguration.RecordSet] = this.fable.servicesMap[providerConfiguration.ProviderHash];
					}
					else
					{
						tmpProvider = this.recordSetProviders[providerConfiguration.RecordSet] = this.fable.addProvider(providerConfiguration.Hash, providerConfiguration, providerBase);
					}
				}
				else
				{
					tmpProvider = this.recordSetProviders[providerConfiguration.RecordSet] = this.fable.addProvider(providerConfiguration.Hash, providerConfiguration, providerBase);
				}
				break;
		}

		return tmpProvider;
	}

	loadRecordSetConfigurationArray(pRecordSetConfigurationArray)
	{
		if (!Array.isArray(pRecordSetConfigurationArray))
		{
			this.fable.log.error(`RecordSetMetacontroller: ${this.UUID} loadRecordSetConfigurationArray called with invalid configuration.`);
			return false;
		}
		if (pRecordSetConfigurationArray.length === 0)
		{
			this.fable.log.error(`RecordSetMetacontroller: ${this.UUID} loadRecordSetConfigurationArray called with empty configuration.`);
			return false;
		}
		for (let i = 0; i < pRecordSetConfigurationArray.length; i++)
		{
			if (!this.loadRecordSetConfiguration(pRecordSetConfigurationArray[i]))
			{
				this.fable.log.error(`RecordSetMetacontroller: ${this.UUID} loadRecordSetConfigurationArray called with invalid configuration:`,pRecordSetConfigurationArray[i]);
			}
		}
	}

	loadRecordSetDynamcally(pRecordSet, pEntity, pDefaultFilter)
	{
		if (typeof(pRecordSet) === 'object')
		{
			const tmpRecordSetProviderHash = `RSP-Provider-${pRecordSet.RecordSet}`;
			this.loadRecordSetConfiguration(pRecordSet);

			return this.fable.providers[tmpRecordSetProviderHash].initializeAsync((pError) =>
				{
					this.log.trace(`RecordSet [${pRecordSet.RecordSet} dynamically loaded.`);
				})
		}

		if (typeof(pRecordSet) === 'string')
		{
			const tmpRecordSet = pRecordSet;
			const tmpRecordSetProviderHash = `RSP-Provider-${tmpRecordSet}`;

			const tmpEntity = (typeof(pEntity) === 'string') ? pEntity : tmpRecordSet;
			const tmpDefaultFilter = (typeof(pDefaultFilter) === 'string') ? pDefaultFilter : '';
			const tmpRecordSetConfiguration = {
				"RecordSet": tmpRecordSet,


				"RecordSetType": "MeadowEndpoint",
				"RecordSetMeadowEntity": tmpEntity,
				"RecordSetDefaultFilter": tmpDefaultFilter,

				"RecordSetURLPrefix": "/1.0/"
			};

			this.loadRecordSetConfiguration(tmpRecordSetConfiguration);
			return this.fable.providers[tmpRecordSetProviderHash].initializeAsync(
				(pError) =>
				{
					this.log.trace(`RecordSet [${tmpRecordSetConfiguration.RecordSet} dynamically loaded.`);
				});
		}

		this.log.error(`RecordSet MetaController loadRecordSetDynamically called with invalid parameter (expected an Object or String - parameter was ${typeof(pRecordSet)}.`);
		return false;
	}

	handleLoadDynamicRecordSetRoute(pRoutePayload)
	{
		if (typeof(pRoutePayload) != 'object')
		{
			throw new Error(`Pict RecordSet List view route handler called with invalid route payload.`);
		}

		const tmpRecordSet = pRoutePayload.data.RecordSet;

		const tmpEntity = pRoutePayload.data.Entity ? pRoutePayload.data.Entity : tmpRecordSet;
		const tmpDefaultFilter = pRoutePayload.data.DefaultFilter ? pRoutePayload.data.DefaultFilter : '';

		return this.loadRecordSetDynamcally(tmpRecordSet, tmpEntity, tmpDefaultFilter);
	}

	addRoutes(pPictRouter)
	{
		pPictRouter.addRoute('/PSRS/:RecordSet/LoadDynamic', this.handleLoadDynamicRecordSetRoute.bind(this));
		pPictRouter.addRoute('/PSRS/:RecordSet/LoadDynamic/:Entity', this.handleLoadDynamicRecordSetRoute.bind(this));
		pPictRouter.addRoute('/PSRS/:RecordSet/LoadDynamic/:Entity/:DefaultFilter', this.handleLoadDynamicRecordSetRoute.bind(this));
		return true;
	}

	addRecordLinkTemplate(pNameTemplate, pURLTemplate, pDefault)
	{
		return this.fable.providers.RecordSetLinkManager.addRecordLinkTemplate(pNameTemplate, pURLTemplate, pDefault);
	}

	initialize()
	{
		if (this.has_initialized)
		{
			this.fable.log.warn(`RecordSetMetacontroller: ${this.UUID} already initialized and initialized was called a second time.`);
			return this;
		}

		this.fable.addProvider('RecordSetLinkManager', {}, providerLinkManager);

		// Add the subviews internally and externally
		this.childViews.list = this.fable.addView('RSP-RecordSet-List', this.options, viewRecordSetList);
		this.childViews.edit = this.fable.addView('RSP-RecordSet-Edit', this.options, viewRecordSetEdit);
		this.childViews.read = this.fable.addView('RSP-RecordSet-Read', this.options, viewRecordSetRead);
		this.childViews.dashboard = this.fable.addView('RSP-RecordSet-Dashboard', this.options, viewRecordSetDashboard);

		// Initialize the subviews
		this.childViews.list.initialize();
		this.childViews.edit.initialize();
		this.childViews.read.initialize();
		this.childViews.dashboard.initialize();

		// Now initialize the router

		if (this.fable.settings.hasOwnProperty('DefaultRecordSetConfigurations'))
		{
			this.loadRecordSetConfigurationArray(this.fable.settings.DefaultRecordSetConfigurations);
		}

		this.has_initialized = true;

		// Load pict-router if it isn't loaded
		if (!('RecordSetRouter' in this.fable.providers))
		{
			this.fable.addProvider('RecordSetRouter', {}, providerRouter);
			this.fable.providers.RecordSetRouter.initialize();
		}

		return true;
	}
}

module.exports = RecordSetMetacontroller;

RecordSetMetacontroller.default_configuration = _DEFAULT_CONFIGURATION;
