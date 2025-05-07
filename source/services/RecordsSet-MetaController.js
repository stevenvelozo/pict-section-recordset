const libFableServiceProviderBase = require('fable-serviceproviderbase');

const viewRecordSetList = require('../views/list/RecordSet-List.js');
const viewRecordSetEdit = require('../views/edit/RecordSet-Edit.js');
const viewRecordSetRead = require('../views/read/RecordSet-Read.js');
const viewRecordSetDashboard = require('../views/dashboard/RecordSet-Dashboard.js');

//_Pict.addProvider('BooksProvider', { Entity: 'Book', URLPrefix: 'http://www.datadebase.com:8086/1.0/' }, require('../source/providers/RecordSet-RecordProvider-MeadowEndpoints.js'));
const providerBase = require('../providers/RecordSet-RecordProvider-Base.js');
const providerMeadowEndpoints = require('../providers/RecordSet-RecordProvider-MeadowEndpoints.js');

const providerPictRouter = require('pict-router');

const { type } = require('os');

class RecordSetMetacontroller extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		// Intersect default options, parent constructor, service information
		super(pFable, pOptions, pServiceHash);

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
				if (`URLPrefix` in pRecordSetConfiguration)
				{
					providerConfiguration.URLPrefix = pRecordSetConfiguration.RecordSetURLPrefix;
				}
				else
				{
					providerConfiguration.URLPrefix = '/1.0/';
				}
				this.recordSetProviders[pRecordSetConfiguration.RecordSet] = this.fable.addProvider(providerConfiguration.Hash, providerConfiguration, providerMeadowEndpoints);
				break;
			default:
			case 'Custom':
				// Create a custom provider				
				if (`ProviderHash` in providerConfiguration)
				{
					if (!(providerConfiguration.ProviderHash in this.fable.servicesMap))
					{
						this.fable.log.error(`RecordSetMetacontroller: ${this.UUID} loadRecordSetConfiguration called with invalid configuration. ProviderHash ${providerConfiguration.ProviderHash} not found.  Falling back to base.`);
						this.recordSetProviders[providerConfiguration.RecordSet] = this.fable.servicesMap[providerConfiguration.ProviderHash];
					}
					else
					{
						this.recordSetProviders[providerConfiguration.RecordSet] = this.fable.addProvider(providerConfiguration.Hash, providerConfiguration, providerBase);
					}
				}
				else
				{
					this.recordSetProviders[providerConfiguration.RecordSet] = this.fable.addProvider(providerConfiguration.Hash, providerConfiguration, providerBase);
				}
				break;
		}

		return true;
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

	initialize()
	{
		if (this.has_initialized)
		{
			this.fable.log.warn(`RecordSetMetacontroller: ${this.UUID} already initialized and initialized was called a second time.`);
			return this;
		}

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

		if (this.fable.settings.hasOwnProperty('DefaultRecordSetConfigurations'))
		{
			this.loadRecordSetConfigurationArray(this.fable.settings.DefaultRecordSetConfigurations);
		}

		// Load pict-router if it isn't loaded
		if (!('Pict-Router' in this.fable.providers))
		{
			this.fable.addProvider('Pict-Router', {}, providerPictRouter);
		}

		this.has_initialized = true;

		return this;
	}
}

module.exports = RecordSetMetacontroller;

RecordSetMetacontroller.default_configuration = { };
