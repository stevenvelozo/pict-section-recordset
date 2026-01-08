const libPictProvider = require('pict-provider');

const _DEFAULT_PROVIDER_CONFIGURATION =
{
	ProviderIdentifier: 'FilterDataProvider',

	AutoInitialize: true,
	AutoInitializeOrdinal: 0,
};

class FilterDataProvider extends libPictProvider
{
	/**
	 * @param {import('pict')} pFable - The Fable instance
	 * @param {Record<string, any>} [pOptions] - The options for the provider
	 * @param {string} [pServiceHash] - The service hash for the provider
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		// This allows unit tests to run
		this.storageProvider = this;
		this.keyCache = {};
		if ((typeof(window) === 'object') && (typeof(window.localStorage) === 'object'))
		{
			this.storageProvider = window.localStorage;
		}

		this.mapOfFilterExperiencesByRecordSet = { };
		// what is this for??? = this.lastFilterExperienceHashMap = { };
	}

	onBeforeInitialize()
	{

		this.loadAllStoredFilterExperiencesIntoMap();
		return super.onBeforeInitialize();
	}

	/**
	 * Load all stored filter experiences into the internal map for quick access.
	 */
	loadAllStoredFilterExperiencesIntoMap()
	{
		for(let i = 0; i < this.storageProvider.length; i++)
		{
			const tmpKey = this.storageProvider.key(i);
			const match = tmpKey.match(/^Filter_Meta_(.+)_(.+)$/);
			if (match)
			{
				const recordSet = match[1];
				//const filterExperienceHash = match[2];
				if (!this.mapOfFilterExperiencesByRecordSet[recordSet])
				{
					this.mapOfFilterExperiencesByRecordSet[recordSet] = [];
				}
				this.mapOfFilterExperiencesByRecordSet[recordSet].push(JSON.parse(this.storageProvider.getItem(tmpKey)));
			}
		}
		return this.mapOfFilterExperiencesByRecordSet;
	}

	replaceFilterStateWithSelection(pRecordSet, pFilterExperienceHash)
	{
		/* 
		 1 - update hash in filterHashMap to point to new filter experience
		 2 - call saveFilterMeta() to update the last used filter experience hash
		 3 - replace the active filter state from the filter in the hashMap
		 */
		this.pict.log.info(`Replacing filter state for record set: ${pRecordSet} with filter experience hash: ${pFilterExperienceHash}`);
		return this.mapOfFilterExperiencesByRecordSet[pRecordSet]?.find((pFilter) => pFilter.FilterExperienceHash === pFilterExperienceHash) || null;
	}

	/**
	 * List all available Filters (from the Filter Meta data)
	 * 
	 * @param {string} pRecordSet - the record set to list the filters for
	 *
	 * @return Array<Record<string, any>> - a list of Filters as Index/FilterExperienceHash entries
	 */
	listAllFiltersExperiencesForRecordSet(pRecordSet)
	{
		return this.mapOfFilterExperiencesByRecordSet[pRecordSet] || [];
	}

	/**
	 * @param {string} pRecordSet - the record set to get the active filter experience for
	 *
	 * @return {Record<string, any>} - the active filter experience for the given record set
	 */
	getActiveFilterExperience(pRecordSet)
	{
		return this.pict.Bundle._ActiveFilterState?.[pRecordSet];
	}

	/**
	 * Check if a particular scope is in use.
	 *
	 * @param {string} pRecordSet - the record set
	 * @param {string} pFilterExperienceHash - the manyfest scope to check the existence of
	 *
	 * @return {boolean}
	 */
	checkFilterExists(pRecordSet, pFilterExperienceHash)
	{
		const filterExperience = this.getActiveFilterExperience(pRecordSet);
		if (filterExperience && filterExperience.FilterExperienceHash === pFilterExperienceHash)
		{
			return true;
		}
		// Make sure other tabs didn't do something funny.
		// Also.  This means users can do FUNNY BUSINESS and mess with the state if they have a 
		// crapton of tabs open and delete a manyfest in one tab and later this check happens.
		// Will not result in data loss but will result in flaky behavior.
		this.loadFilterMeta(pRecordSet, pFilterExperienceHash, false);
		const filtersList = this.mapOfFilterExperiencesByRecordSet[pRecordSet] || [];
		return filtersList.find((pFilter) => pFilter.FilterExperienceHash === pFilterExperienceHash) !== undefined;
	}

	/**
	 * Resolve a key in the LocalStorage keyspace for a filter experience for a given record set.
	 * 
	 * @param {string} pRecordSet - The record set to resolve a key for
	 * @param {string} pFilterExperienceHash - The scope to resolve a key for
	 *
	 * @return {string} A string that points to the record.
	 */
	getFilterStorageKey(pRecordSet, pFilterExperienceHash)
	{
		this.loadFilterMeta(pRecordSet, pFilterExperienceHash, false);
		// Default to the loaded manyfest if nothing is passed in.
		let tmpFilterExperienceHash = (typeof(pFilterExperienceHash) === 'string') ? pFilterExperienceHash : 'LATEST';
		return `Filter_Meta_${pRecordSet}_${tmpFilterExperienceHash}`;
	}

	/**
	 * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
	 *
	 * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
	 * @param {boolean} [pRender=false] - Whether or not to also render the list of Filters in the UI automatically
	 */
	saveFilterMeta(pRecordSet, pRender = false)
	{
		const filtersList = this.mapOfFilterExperiencesByRecordSet[pRecordSet] || [];
		const filterDisplayName = this.getCurrentFilterName(pRecordSet);
		const tmpFilterExperienceHash = filterDisplayName.replace(/[^a-zA-Z0-9_-]/g, '');
		//const lastFilterExperienceHash = this.lastFilterExperienceHashMap[pRecordSet] || 'LATEST'
		// Save the specific filter metadata
		if (tmpFilterExperienceHash !== 'LATEST')
		{
			// TODO: BUG: Gotta have a more complex merge happen here for multiple tabs
			this.storageProvider.setItem(`Filter_Meta_${pRecordSet}_${tmpFilterExperienceHash}`, JSON.stringify({ 
				//LastFilterExperienceHash: lastFilterExperienceHash, 
				RecordSet: pRecordSet,
				FilterList: filtersList,
				FilterDisplayName: filterDisplayName 
			}));
		}
		// also set LATEST to what we just saved so that it's always up to date for the default filter experience
		this.storageProvider.setItem(`Filter_Meta_${pRecordSet}_LATEST`, JSON.stringify({ 
			//LastFilterExperienceHash: lastFilterExperienceHash, 
			RecordSet: pRecordSet,
			FilterList: filtersList,
			FilterDisplayName: filterDisplayName 
		}));

		if (pRender && this.pict.views.FilterPersistenceView)
		{
			this.pict.views.FilterPersistenceView.render()
		}

		return true;
	}

	/**
	 * Get the current filter name from the UI input (or generate a default one)
	 * @param {string} pRecordSet - The record set to get the current filter name for
	 * @return {string} - The current filter name
	 */
	getCurrentFilterName(pRecordSet)
	{
		/* @type {HTMLInputElement} */
		const tmpInput = document.getElementById('FilterPersistenceView-CurrentFilterName');
		if (tmpInput && tmpInput[0] && (tmpInput[0].value.length > 0))
		{
			return tmpInput[0].value;
		}
		return 'Unnamed Filter for ' + pRecordSet;
	}

	/**
	 * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
	 *
	 * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
	 * @param {string} pFilterExperienceHash - The name of the filter to load; if not provided, the 'LATEST' filter will be loaded
	 * @param {boolean} [pRender=false] - Whether or not to also render the list of Filters in the UI automatically
	 *
	 * @return {Array<object>} The list of available Filters.
	 */
	loadFilterMeta(pRecordSet, pFilterExperienceHash, pRender = false)
	{
		const tmpFilterName = pFilterExperienceHash || 'LATEST';
		// We get this every time in case the user has multiple tabs open
		let tmpFilterMetaJSON = this.storageProvider.getItem(`Filter_Meta_${pRecordSet}_${tmpFilterName}`);
		let tmpFilterMeta = tmpFilterMetaJSON ? JSON.parse(tmpFilterMetaJSON) : { /*LastFilterExperienceHash: 'LATEST'*/ FilterList: [] };

		if (pRender && this.pict.views.FilterPersistenceView)
		{
			this.pict.views.FilterPersistenceView.render()
		}

		return tmpFilterMeta;
	}

	/**
	 * @param {string} pRecordSet - The record set to add the filter experience hash to
	 * @param {string} pFilterExperienceHash - The filter experience hash to add
	 * @param {boolean} [pRender=true] - Whether or not to also render the list of Filters in the UI automatically
	 *
	 * @return {boolean} True if the filter experience hash was added, false if it already exists.
	 */
	addFilterExperienceHashToFilterList(pRecordSet, pFilterExperienceHash, pRender)
	{
		let tmpRender = (typeof(pRender) === 'undefined') ? true : pRender;

		this.loadFilterMeta(pRecordSet, pFilterExperienceHash, false);

		const tmpFilterList = this.mapOfFilterExperiencesByRecordSet[pRecordSet] || [];

		let tmpFilterFilterExperienceHashIndex = tmpFilterList.indexOf(pFilterExperienceHash);

		if (tmpFilterFilterExperienceHashIndex >= 0)
		{
			return false;
		}
		const filtersList = this.mapOfFilterExperiencesByRecordSet[pRecordSet] || [];
		filtersList.push(pFilterExperienceHash);
		this.mapOfFilterExperiencesByRecordSet[pRecordSet] = filtersList;

		this.saveFilterMeta(pRecordSet, false);

		if (tmpRender && this.pict.views.FilterPersistenceView)
		{
			this.pict.views.FilterPersistenceView.render()
		}

		return true;
	}

	/**
	 * @param {string} pRecordSet - The record set to remove the filter experience hash from
	 * @param {string} pFilterExperienceHash - The filter experience hash to remove
	 * @param {boolean} [pRender=true] - Whether or not to also render the list of Filters in the UI automatically
	 */
	removeFilterExperienceHashFromFilterList(pRecordSet, pFilterExperienceHash, pRender)
	{
		let tmpRender = (typeof(pRender) === 'undefined') ? true : pRender;

		let tmpFilterList = this.loadFilterMeta(pRecordSet, pFilterExperienceHash, false);

		let tmpFilterFilterExperienceHashIndex = tmpFilterList.indexOf(pFilterExperienceHash);

		if (tmpFilterFilterExperienceHashIndex >= 0)
		{
			// Could use array splice but meh
			let tmpNewFilterList = [];

			for (let i = 0; i < tmpFilterList.length; i++)
			{
				if (tmpFilterList[i] != pFilterExperienceHash)
				{
					tmpNewFilterList.push(tmpFilterList[i]);
				}
			}

			this.mapOfFilterExperiencesByRecordSet[pRecordSet] = tmpNewFilterList;

			this.saveFilterMeta(pRecordSet, true);

			if (tmpRender && this.pict.views.FilterPersistenceView)
			{
				this.pict.views.FilterPersistenceView.render()
			}

			return true;
		}

		return false;
	}

	/**
	 * @param {string} pRecordSet - The record set to create a new filter for
	 * @param {string} [pFilterExperienceHash] - The filter experience hash to create a new filter for; if not provided, a new one will be generated
	 */
	newFilter(pRecordSet, pFilterExperienceHash)
	{
		let tmpFilterExperienceHash = ((typeof(pFilterExperienceHash) === 'string') && (pFilterExperienceHash.length > 0)) ? pFilterExperienceHash : false;

		if (!tmpFilterExperienceHash)
		{
			// Autogenerate a scope
			const filtersList = this.mapOfFilterExperiencesByRecordSet[pRecordSet] || [];
			let tmpProspectiveIndex = filtersList.length;

			// If a user has more than 10,000 manifests we need to talk.  In person.
			for (let i = 0; i < 10000; i++)
			{
				let tmpFilterFilterExperienceHash = `New Manifest ${tmpProspectiveIndex}`;

				if (!this.checkFilterExists(pRecordSet, tmpFilterFilterExperienceHash))
				{
					tmpFilterExperienceHash = tmpFilterFilterExperienceHash;
					break;
				}
			}
		}
		else
		{
			// Check to ensure the manyfest doesn't already exist.
			if (this.checkFilterExists(pRecordSet, tmpFilterExperienceHash))
			{
				this.log.warn(`Filter ${tmpFilterExperienceHash} already exists but it was explicitly requested by the user.  Loading insted.`);
				return this.loadFilter(pRecordSet, tmpFilterExperienceHash);
			}
		}

		// As far as I can tell this only happens if the user has more than 10,000 manifests
		if (!tmpFilterExperienceHash)
		{
			this.log.warn(`You have won the lottery.  Seriously.  Call us to learn more!  Please email steven@velozo.com for more details.`);
			tmpFilterExperienceHash = 'LotteryWinner';
		}

		// Now create the new manyfest
		let tmpNewManifest = JSON.parse(JSON.stringify(this.options.DefaultManifest));
		tmpNewManifest.FilterExperienceHash = tmpFilterExperienceHash;

		// Now save it.
		this.storageProvider.setItem(this.getFilterStorageKey(pRecordSet, tmpFilterExperienceHash), JSON.stringify(tmpNewManifest));
		this.addFilterExperienceHashToFilterList(pRecordSet, tmpFilterExperienceHash, true);

		// TODO: Do we load it?  Maaaaaaaybe.  Figure out the "autosave before load" workflow.

		this.loadFilter(pRecordSet, tmpFilterExperienceHash);
	}

	/**
	 * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
	 */
	saveFilter(pRecordSet)
	{
		let tmpFilterFilterExperienceHash = this.pict.Bundle._ActiveFilterState.FilterExperienceHash;
		// TODO: Should this be a .... merge?  Yikes.  Multiple tabs is bonkers.
		this.storageProvider.setItem(this.getFilterStorageKey(pRecordSet, tmpFilterFilterExperienceHash), JSON.stringify(this.pict.Bundle._ActiveFilterState));
		this.addFilterExperienceHashToFilterList(pRecordSet, tmpFilterFilterExperienceHash);
	}

	/**
	 * @param {string} pRecordSet - The record set to load the filter for
	 * @param {string} pFilterFilterExperienceHash - The filter experience hash to load; if not provided, the last used one will be loaded
	 */
	loadFilter(pRecordSet, pFilterFilterExperienceHash)
	{
		let tmpFilterJSON = this.storageProvider.getItem(this.getFilterStorageKey(pRecordSet, pFilterFilterExperienceHash));
		if (tmpFilterJSON)
		{
			this.pict.Bundle._ActiveFilterState = JSON.parse(tmpFilterJSON);
		}
		this.pict.providers.FilterRouter.postPersistNavigate();
	}

	/**
	 * @param {string} pKey - The key to get from the cache
	 *
	 * @return {any} - The value associated with the key, or false if not found
	 */
	getItem(pKey)
	{
		if (pKey in this.keyCache)
		{
			return this.keyCache[pKey];
		}
		return false;
	}

	/**
	 * @param {string} pKey - The key to set in the cache
	 * @param {any} pValue - The value to associate with the key
	 */
	setItem(pKey, pValue)
	{
		this.keyCache[pKey] = pValue;
		return true;
	}

	/**
	 * @param {string} pKey - The key to remove from the cache
	 *
	 * @return {boolean} - True if the item was removed, false if it was not found
	 */
	removeItem(pKey)
	{
		if (pKey in this.keyCache)
		{
			delete this.keyCache[pKey];
			return true;
		}
		return false;
	}
}

module.exports = FilterDataProvider;
module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;
