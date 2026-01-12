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

		this.mapOfFilterExperiencesByRecordSet = {};
	}

	onBeforeInitialize()
	{
		this.loadAllStoredFilterExperiencesIntoTheMap();
		return super.onBeforeInitialize();
	}

	/**
	 * Load all stored filter experiences into the internal map for quick access.
	 */
	loadAllStoredFilterExperiencesIntoTheMap()
	{
		for(let i = 0; i < this.storageProvider.length; i++)
		{
			const tmpKey = this.storageProvider.key(i);
			const match = tmpKey.match(/^Filter_Meta_(.+)_(.+)_(.+)$/);
			if (match)
			{
				// set the record set if not already present
				const tmpRecordSet = match[1];
				if (!this.mapOfFilterExperiencesByRecordSet[tmpRecordSet])
				{
					this.mapOfFilterExperiencesByRecordSet[tmpRecordSet] = [];
				}
				const tmpViewContext = match[2];
				// for the experience hash, push the parsed filter experience into the array if it's not already there
				const tmpFilterExperienceHash = match[3];
				const existingfilterMeta = this.mapOfFilterExperiencesByRecordSet[tmpRecordSet].find((pFilter) => pFilter.FilterExperienceHash === tmpFilterExperienceHash);
				if (!existingfilterMeta)
				{
					this.mapOfFilterExperiencesByRecordSet[tmpRecordSet] = this.getFilterExperienceFromStorage(tmpRecordSet, tmpViewContext, tmpFilterExperienceHash);
				}
			}
		}
		return this.mapOfFilterExperiencesByRecordSet;
	}

	/**
	 * Check if a filter experience exists for a given record set and filter experience hash.
	 * @param {string} pRecordSet - The record set to check.
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The filter experience hash to check.
	 * @return {object} - The filter experience metadata if it exists, otherwise an empty object.
	 */
	getFilterExperienceFromStorage(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		const tmpFilterMetaJSON = this.storageProvider.getItem(`Filter_Meta_${pRecordSet}_${pViewContext}_${pFilterExperienceHash}`);
		if (tmpFilterMetaJSON)
		{
			const tmpFilterMeta = JSON.parse(tmpFilterMetaJSON);
			if (!this.mapOfFilterExperiencesByRecordSet[pRecordSet])
			{
				this.mapOfFilterExperiencesByRecordSet[pRecordSet] = [];
			}
			this.mapOfFilterExperiencesByRecordSet[pRecordSet].push(tmpFilterMeta);
			return this.mapOfFilterExperiencesByRecordSet[pRecordSet];
		}
		return {};
	}

	/**
	 * List all available Filters (from the Filter Meta data) for a given record set.
	 * @param {string} pRecordSet - the record set to list the filters for
	 * @param {string} pViewContext - the current view context	 
	 * @return Array<Record<string, any>> - a list of Filters as Index/FilterExperienceHash entries
	 */
	getAllFiltersExperiencesForRecordSet(pRecordSet, pViewContext)
	{
		if (this.mapOfFilterExperiencesByRecordSet[pRecordSet] === undefined)
		{
			console.info(`No filters found for record set: ${pRecordSet} and view context: ${pViewContext}`);
			return [];
		}
		return this.mapOfFilterExperiencesByRecordSet[pRecordSet] || [];
	}

	/**
	 * Resolve a key in the LocalStorage keyspace for a filter experience for a given record set.
	 * 
	 * @param {string} pRecordSet - The record set to resolve a key for
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The scope to resolve a key for
	 *
	 * @return {string} A string that points to the record.
	 */
	getFilterStorageKey(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		this.loadFilterMeta(pRecordSet, pViewContext, pFilterExperienceHash, false);
		// Default to the loaded manyfest if nothing is passed in.
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
	 * @param {string} pRecordSet - The record set that has changed.
	 * @param {string} pViewContext - The current view context
	 * @param {object} tmpFilterMeta - The record set that has changed.
	 
	 */
	reRenderViewsAffectedByFilterChange(pRecordSet, pViewContext, tmpFilterMeta)
	{
		// go to the new url with the filter experience encoded param
		if (tmpFilterMeta.FilterExperienceEncodedURLParam && tmpFilterMeta.FilterExperienceEncodedURLParam.length > 0)
		{
			this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${pRecordSet}/${pViewContext}/FilterExperience/${tmpFilterMeta.FilterExperienceEncodedURLParam}`);
		}
		else
		{
			console.warn('No FilterExperienceEncodedURLParam found for the current filter experience; navigating to base record set URL.');
			this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${pRecordSet}/${pViewContext}`);
		}
		// re-render all views that are affected by the filter change
		this.pict.views?.FilterPersistenceView?.render();
	}

	/**
	 * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
	 *
	 * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
	 * @param {boolean} [pRender=false] - Whether or not to also render the list of Filters in the UI automatically
	 * @param {Function} [pCallback=null] - Optional callback to execute after saving and rendering
	 * @return {boolean} - Returns true when the settings have been saved.
	 */
	saveFilterMeta(pRecordSet, pViewContext, pRender = false, pCallback = null)
	{
		const activeFilterExperienceClauses = this.pict.Bundle._ActiveFilterState[pRecordSet]?.FilterClauses || [];
		const filterDisplayName = this.getCurrentFilterName({ FilterClauses: activeFilterExperienceClauses });
		const tmpFilterExperienceHash = filterDisplayName.replace(/[^a-zA-Z0-9_-]/g, '');

		if (this.checkIfFilterExperienceExists(pRecordSet, pViewContext, tmpFilterExperienceHash))
		{
			this.pict.log.info(`Filter experience with hash ${tmpFilterExperienceHash} already exists for record set ${pRecordSet}. Overwriting.`);
			// TODO: add a confirmation dialog in the UI and compare before overwriting?
		}

		// TODO: BUG: Gotta have a more complex merge happen here for multiple tabs
		const newFilterMeta = { 
			RecordSet: pRecordSet,
			ViewContext: pViewContext,
			FilterClauses: activeFilterExperienceClauses,
			FilterDisplayName: filterDisplayName,
			FilterExperienceHash: tmpFilterExperienceHash,
			FilterExperienceEncodedURLParam: window.location.hash.split('/FilterExperience/')?.[1] || '',
			LastModifiedDate: new Date().toISOString(),
		}
		// Save the specific filter metadata to localStorage
		this.storageProvider.setItem(`Filter_Meta_${pRecordSet}_${pViewContext}_${tmpFilterExperienceHash}`, JSON.stringify(newFilterMeta));
		// Also update the reserved "LATEST" item to what we just saved, so that 'Filter_Meta_${pRecordSet}_LATEST' is always current for the default filter experience on load
		this.storageProvider.setItem(`Filter_Meta_${pRecordSet}_${pViewContext}_LATEST`, JSON.stringify(newFilterMeta));
		// update the map now that we have a new filter saved
		this.loadAllStoredFilterExperiencesIntoTheMap();
		// re-render all views that are affected by the filter change
		this.pict.views?.FilterPersistenceView?.render();

		if (pRender)
		{
			this.reRenderViewsAffectedByFilterChange(pRecordSet, pViewContext, newFilterMeta);
		}
		else if (pCallback && (typeof(pCallback) === 'function'))
		{
			pCallback();
		}

		return true;
	}

	/**
	 * Check if the given filter experience hash is the current active filter for the given record set.
	 *
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
		const filterExperiences = this.mapOfFilterExperiencesByRecordSet[pRecordSet] || [];
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
		const tmpDisplayName = pNewName || this.generateContextualDefaultFilterName(pFilterExperience);
		this.pict.ContentAssignment.assignContent('#FilterPersistenceView-CurrentFilterNameInput', tmpDisplayName);
		return true;
	}

	/**
	 * Using the information in the FilterClauses, try to generate a contextual default filter name for the display name of the current experience.
	 *
	 * @param {object} pFilterExperience - The filter experience to generate the default filter name for
	 * @return {string} - The generated default filter name
	 */
	generateContextualDefaultFilterName(pFilterExperience)
	{	
		if (pFilterExperience && pFilterExperience.FilterClauses && pFilterExperience.FilterClauses.length > 0)
		{
			const clauseSummaries = pFilterExperience.FilterClauses.map((clause) => {
				return `${clause.Label} ${clause.ExactMatch ? 'IS' : 'CONTAINS'} ${clause.Value}`;
			});
			return `${clauseSummaries.join(' AND ')}`;
		}
		return 'New Filter';
	}

	/**
	 * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
	 * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The name of the filter to load; if not provided, the 'LATEST' filter will be loaded
	 * @param {boolean} [pRender=false] - Whether or not to also render the list of Filters in the UI automatically
	 * @param {Function} [pCallback=null] - Optional callback to execute after saving and rendering
	 * @return {object} - Returns the loaded filter meta object.
	 */
	loadFilterMeta(pRecordSet, pViewContext, pFilterExperienceHash, pRender = false, pCallback = null)
	{
		const tmpFilterName = pFilterExperienceHash || 'LATEST';
		// We get this every time in case the user has multiple tabs open
		let tmpFilterMetaJSON = this.storageProvider.getItem(`Filter_Meta_${pRecordSet}_${pViewContext}_${tmpFilterName}`);
		let tmpFilterMeta = tmpFilterMetaJSON ? JSON.parse(tmpFilterMetaJSON) : null;
		if (!tmpFilterMeta)
		{
			this.pict.log.warn(`No filter experience found for record set: ${pRecordSet} with filter experience hash: ${tmpFilterName}`);
			return null;
		}
		// set the active filter state to the loaded filter meta
		this.pict.Bundle._ActiveFilterState[`${pRecordSet}`] = tmpFilterMeta;
		// update the current filter name in the UI
		this.setCurrentFilterName(tmpFilterMeta, pRecordSet, pViewContext);
		// re-render all views that are affected by the filter change
		this.pict.views?.FilterPersistenceView?.render();
		// re-render views if needed
		if (pRender)
		{
			this.reRenderViewsAffectedByFilterChange(pRecordSet, pViewContext, tmpFilterMeta);
		}
		else if (pCallback && (typeof(pCallback) === 'function'))
		{
			pCallback();
		}

		return tmpFilterMeta;
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
