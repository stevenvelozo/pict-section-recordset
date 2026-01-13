const libPictProvider = require('pict-provider');

const _DEFAULT_PROVIDER_CONFIGURATION =
{
	ProviderIdentifier: 'FilterDataProvider',
	AutoInitialize: true,
	AutoInitializeOrdinal: 0,
};

/** Terminology for Filter Data Provider (to avoid confusion):
 * A "Record Set" is a collection of records that can be filtered.
 * A "Filter Experience" is a saved state of filters for a given record set.
 * A "Filter Experience Hash" is a unique identifier for a Filter Experience (display name converted to a hash).
 * A "Filter Experience Encoded URL Param" is the URL-encoded representation of the filter state for a Filter Experience.
 * A "Filter Display Name" is a user-friendly name for a Filter Experience to select/view in the UI.
 * A "Filter List" is a list of all saved filters in the "Filter Experience" for a given Record Set.
 * A "Filter Meta" is the metadata associated with a Filter Experience, including the Filter List and Filter Display Name.
 */

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
		this.defaultFilterExperienceOnLoad = null;
	}

	onBeforeInitialize()
	{
		return super.onBeforeInitialize();
	}

	/**
	 * List all available Filters (from the Filter Meta data) for a given record set and return them as an array of filter meta objects.
	 * @param {string} pRecordSet - the record set to list the filters for
	 * @param {string} pViewContext - the current view context	 
	 * @return {Array<object>} - An array of filter meta objects for the given record set.
	 */
	getAllFiltersExperiencesForRecordSet(pRecordSet, pViewContext)
	{
		let tmpFilterExperiences = [];
		for (const recordSet in this.storageProvider)
		{
			if (recordSet.startsWith(`Filter_Meta_${pRecordSet}_${pViewContext}_`))
			{
				const tmpFilterMetaJSON = this.storageProvider.getItem(recordSet);
				if (tmpFilterMetaJSON)
				{
					const tmpFilterMeta = JSON.parse(tmpFilterMetaJSON);
					tmpFilterExperiences.push(tmpFilterMeta);
				}
			}
		}
		return tmpFilterExperiences;
	}

	/**
	 * Resolve a key in the LocalStorage keyspace for a filter experience for a given record set.
	 * @param {string} pRecordSet - The record set to resolve a key for
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The scope to resolve a key for
	 *
	 * @return {string} A string that points to the record.
	 */
	getFilterStorageKey(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		let tmpFilterExperienceHash = (typeof(pFilterExperienceHash) === 'string') ? pFilterExperienceHash : 'LATEST';
		return `Filter_Meta_${pRecordSet}_${pViewContext}_${tmpFilterExperienceHash}`;
	}

	/**
	 * Check if a filter experience exists for a given record set and filter experience hash.
	 * @param {string} pRecordSet - The record set to check.
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The filter experience hash to check.
	 * @return {boolean} - True if the filter experience exists, false otherwise.
	 */
	checkIfFilterExperienceExists(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		const tmpKey = this.getFilterStorageKey(pRecordSet, pViewContext, pFilterExperienceHash);
		const tmpFilterMetaJSON = this.storageProvider.getItem(tmpKey);
		return (tmpFilterMetaJSON !== null);
	}
	
	/**
	 * Re-render all views affected by a filter change.
	 * @param {object} tmpFilterMeta - The filter meta record that was changed/added.
	 */
	navigateToFilterExperienceRoute(tmpFilterMeta)
	{
		// go to the new url with the filter experience encoded param
		if (tmpFilterMeta.FilterExperienceEncodedURLParam && tmpFilterMeta.FilterExperienceEncodedURLParam.length > 0)
		{
			this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${tmpFilterMeta.RecordSet}/${tmpFilterMeta.ViewContext}/FilterExperience/${tmpFilterMeta.FilterExperienceEncodedURLParam}`);
		}
		else
		{
			console.warn('No FilterExperienceEncodedURLParam found for the current filter experience; navigating to base record set URL.');
			this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${tmpFilterMeta.RecordSet}/${tmpFilterMeta.ViewContext}`);
		}
	}

	/**
	 * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
	 * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
	 * @param {string} pViewContext - The current view context
	 * @return {boolean} - Returns true when the settings have been saved.
	 */
	saveFilterMeta(pRecordSet, pViewContext)
	{
		const activeFilterExperienceClauses = this.pict.Bundle._ActiveFilterState[pRecordSet]?.FilterClauses || [];
		const filterDisplayName = this.getCurrentFilterName({ FilterClauses: activeFilterExperienceClauses });
		const tmpFilterExperienceHash = filterDisplayName.replace(/[^a-zA-Z0-9_-]/g, '');

		if (this.checkIfFilterExperienceExists(pRecordSet, pViewContext, tmpFilterExperienceHash))
		{
			this.pict.log.info(`Filter experience with hash 'Filter_Meta_${pRecordSet}_${pViewContext}_${tmpFilterExperienceHash}' already exists for record set ${pRecordSet}. Overwriting.`);
			// TODO: add a confirmation dialog in the UI and compare before overwriting?
		}

		// TODO: BUG: Gotta have a more complex merge happen here for multiple tabs
		const newFilterExperience = { 
			RecordSet: pRecordSet,
			ViewContext: pViewContext,
			FilterClauses: activeFilterExperienceClauses,
			FilterDisplayName: filterDisplayName,
			FilterExperienceHash: tmpFilterExperienceHash,
			FilterExperienceEncodedURLParam: window.location.hash.split('/FilterExperience/')?.[1] || '',
			LastModifiedDate: new Date().toISOString(),
		}
		// Save the specific filter metadata to localStorage
		this.storageProvider.setItem(`Filter_Meta_${pRecordSet}_${pViewContext}_${tmpFilterExperienceHash}`, JSON.stringify(newFilterExperience));
		// Also update the reserved "LATEST" item to what we just saved, so that 'Filter_Meta_${pRecordSet}_LATEST' is always current for the default filter experience on load
		this.storageProvider.setItem(`Filter_Meta_${pRecordSet}_${pViewContext}_LATEST`, JSON.stringify({ 
			...newFilterExperience, 
			FilterExperienceHash: 'LATEST', 
			ExcludedFromSelection: true 
		}));
		return true;
	}

	/**
	 * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
	 * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The name of the filter to load; if not provided, the 'LATEST' filter will be loaded
	 * @return {boolean} - Returns true when the filter experience has been loaded.
	 */
	loadFilterMeta(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		// We get this every time in case the user has multiple tabs open
		const tmpKey = this.getFilterStorageKey(pRecordSet, pViewContext, pFilterExperienceHash);
		const tmpFilterExperienceJSON = this.storageProvider.getItem(tmpKey);
		let tmpFilterExperience = tmpFilterExperienceJSON ? JSON.parse(tmpFilterExperienceJSON) : null;
		if (!tmpFilterExperience)
		{
			this.pict.log.warn(`No filter experience available to remove for record set: ${pRecordSet} with filter experience hash: ${pFilterExperienceHash}`);
			return false;
		}
		// update the current filter name in the UI
		this.setCurrentFilterName(tmpFilterExperience, pRecordSet, pViewContext);
		// re-render views if needed
		this.navigateToFilterExperienceRoute(tmpFilterExperience);
		return true;
	}

	/**
	 * Remove a filter meta from storage for a given record set and filter experience hash.
	 * @param {string} pRecordSet - The record set to remove the filter for
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The filter experience hash to remove
	 * @return {boolean} - Returns true when the filter meta has been removed.
	 */
	removeFilterMeta(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		// TODO: add confirmation dialog in the UI before removing?
		const tmpKey = this.getFilterStorageKey(pRecordSet, pViewContext, pFilterExperienceHash);
		const tmpFilterExperienceJSON = this.storageProvider.getItem(tmpKey);
		let tmpFilterExperience = tmpFilterExperienceJSON ? JSON.parse(tmpFilterExperienceJSON) : null;
		if (!tmpFilterExperience)
		{
			this.pict.log.warn(`No filter experience available to remove for record set: ${pRecordSet} with filter experience hash: ${pFilterExperienceHash}`);
			return false;
		}
		// check if the filter being removed is the current active filter; if so, reset to base record set URL
		if (this.isCurrentFilterExperienceHash(pRecordSet, pViewContext, pFilterExperienceHash))
		{
			this.pict.log.info(`The filter experience being removed is the current active filter. Navigating to base record set URL.`);
			this.pict.views['PRSP-Filters'].handleReset(null, pRecordSet, pViewContext);
		}
		// remove the filter meta from localStorage
		this.storageProvider.removeItem(tmpKey);

		return true;
	}

	/**
	 * Check if the given filter experience hash is the current active filter for the given record set.
	 * @param {string} pRecordSet - The record set to check.
	 * @param {string} pViewContext - The current view context.
	 * @param {string} pFilterExperienceHash - The filter experience hash to check.
	 * @return {boolean} - True if the given filter experience hash is the current active filter, false otherwise.
	 */
	isCurrentFilterExperienceHash(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		// NOTE: Could be an confusing issue if we have the same URL param with different display names
		const tmpExperienceURLParam = window.location.hash.split('/FilterExperience/')?.[1] || '';
		// look in the map for the filter experience with the given hash
		const filterExperiences = this.getAllFiltersExperiencesForRecordSet(pRecordSet, pViewContext) || [];
		const matchingExperience = filterExperiences.find((pExperience) => pExperience.FilterExperienceHash === pFilterExperienceHash);
		if (matchingExperience && (matchingExperience.FilterExperienceEncodedURLParam === tmpExperienceURLParam))
		{
			return true;
		}
		return false;
	}
	
	/**
	 * Get the current filter name from the UI input (or generate a default one)
	 * @param {object} pFilterExperience - The filter experience to get the current filter name for
	 * @return {string} - The current filter name
	 */
	getCurrentFilterName(pFilterExperience)
	{
		/* @type {HTMLInputElement} */
		const tmpValue = this.pict.ContentAssignment.readContent('#FilterPersistenceView-CurrentFilterNameInput');
		if (tmpValue && tmpValue.trim().length > 0)
		{
			return tmpValue.trim();
		}
		return this.generateContextualDefaultFilterName(pFilterExperience);
	}

	/**
	 * Set the current filter name in the UI input
	 * @param {object} [pFilterExperience] - The filter experience to set the current filter name for
	 * @param {string} [pViewContext] - The current view context
	 * @param {string} [pRecordSet] - The record set to set the filter name for
	 * @param {string} [pNewName] - The new name to set
	 * @return {boolean} - Returns true when the name has been set
	 */
	setCurrentFilterName(pFilterExperience, pRecordSet, pViewContext, pNewName)
	{
		const tmpDisplayName = pNewName || this.generateContextualDefaultFilterName(pFilterExperience, pRecordSet, pViewContext);
		this.pict.ContentAssignment.assignContent('#FilterPersistenceView-CurrentFilterNameInput', tmpDisplayName);
		return true;
	}

	/**
	 * Using the information in the FilterClauses, try to generate a contextual default filter name for the display name of the current experience.
	 *
	 * @param {object} pFilterExperience - The filter experience to generate the default filter name for
	 * @param {string} [pRecordSet] - The current record set
	 * @param {string} [pViewContext] - The current view context
	 * @return {string} - The generated default filter name
	 */
	generateContextualDefaultFilterName(pFilterExperience, pRecordSet, pViewContext)
	{	
		// if there is a display name, use that
		if (pFilterExperience && pFilterExperience.FilterDisplayName && pFilterExperience.FilterDisplayName.length > 0)
		{
			return pFilterExperience.FilterDisplayName;
		}
		// otherwise, generate one based on the clauses
		const tmpRecordSet = pFilterExperience?.RecordSet || pRecordSet || '';
		const tmpClauses = pFilterExperience?.FilterClauses || this.pict.Bundle._ActiveFilterState[tmpRecordSet]?.FilterClauses || [];
		if (tmpClauses && tmpClauses.length > 0)
		{
			const clauseSummaries = tmpClauses.map((clause) => {
				return `${clause.Label} ${clause.ExactMatch ? 'IS' : 'CONTAINS'} ${clause.Value}`;
			});
			return `${clauseSummaries.join(' AND ')}`;
		}
		// give up, fall back to default name
		return 'New Filter';
	}

	/**
	 * Set the default filter experience to load on application load for a given record set and filter experience hash.
	 * @param {string} pRecordSet - The record set to set the default filter experience for
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The filter experience hash to set as default on load
	 * @param {boolean} pSetAsDefault - Whether to set as default or not
	 * @return {boolean} - Returns true when the default filter experience has been set
	 */
	setDefaultFilterExperienceOnLoad(pRecordSet, pViewContext, pFilterExperienceHash, pSetAsDefault)
	{
		const tmpStorageKey = this.getFilterStorageKey(pRecordSet, pViewContext, pFilterExperienceHash);
		const tmpFilterExperienceJSON = this.storageProvider.getItem(tmpStorageKey);
		let tmpFilterExperience = tmpFilterExperienceJSON ? JSON.parse(tmpFilterExperienceJSON) : null;
		if (!tmpFilterExperience)
		{
			this.pict.log.warn(`No filter experience available to set as default for record set: ${pRecordSet} with filter experience hash: ${pFilterExperienceHash}`);
			return false;
		}
		// if already default, do nothing
		if (pSetAsDefault && this.isDefaultFilterExperienceOnLoad(pRecordSet, pViewContext, tmpFilterExperience))
		{
			this.pict.log.info(`Filter experience 'Filter_Meta_${pRecordSet}_${pViewContext}_${pFilterExperienceHash}' is already set as default on load. No action taken.`);
			return true;
		}
		// if unsetting default, but not currently default, do nothing
		if (!pSetAsDefault && !this.isDefaultFilterExperienceOnLoad(pRecordSet, pViewContext, tmpFilterExperience))
		{
			this.pict.log.info(`Filter experience 'Filter_Meta_${pRecordSet}_${pViewContext}_${pFilterExperienceHash}' is not currently set as default on load. No action taken.`);
			return true;
		}
		this.defaultFilterExperienceOnLoad = pSetAsDefault ? tmpFilterExperience : null;
		return true;
	}

	/**
	 * @return {object} - The default filter experience to load on application load
	 */
	getDefaultFilterExperienceOnLoad()
	{
		return this.defaultFilterExperienceOnLoad;
	}

	/**
	 * Check if the given filter experience is the default filter experience to load on application load for the given record set and view context.
	 * @param {string} pRecordSet - The record set to check
	 * @param {string} pViewContext - The current view context
	 * @param {object} pFilterExperience - The filter experience to check
	 * @return {boolean} - True if the given filter experience is the default filter experience on load, false otherwise
	 */
	isDefaultFilterExperienceOnLoad(pRecordSet, pViewContext, pFilterExperience)
	{
		if (!this.defaultFilterExperienceOnLoad)
		{
			return false;
		}
		return (this.defaultFilterExperienceOnLoad.RecordSet === pRecordSet) &&
			   (this.defaultFilterExperienceOnLoad.ViewContext === pViewContext) &&
			   (this.defaultFilterExperienceOnLoad.FilterExperienceHash === pFilterExperience.FilterExperienceHash);
	}

	/**
	 * @param {string} pKey - The key to get from the cache
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
