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
 * A "Filter Clauses" is a list of all saved filters in the "Filter Experience" for a given Record Set.
 * A "Filter Meta" is the metadata associated with a Filter Experience, including the Filter Clauses and Filter Display Name.

 * Behavior Summary:
 * - Save Filter Meta to LocalStorage under a key derived from Record Set, View Context, and Filter Experience Hash.
 * - Load Filter Meta from LocalStorage using the same key.
 * - Remove Filter Meta from LocalStorage when requested.
 * - List all Filter Experiences for a given Record Set by scanning LocalStorage keys.
 * - Manage default and last used Filter Experiences for each Record Set and View Context. (last used takes priority over default on load, if the check is enabled)
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
	}

	onBeforeInitialize()
	{
		return super.onBeforeInitialize();
	}

	/** ===== UTILITY for Filter Experience ============= */

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
		return `New ${pViewContext} Filter`;
	}

	/**
	 * Re-render all views affected by a filter change.
	 * @param {object} tmpFilterExperience - The filter meta record that was changed/added.
	 * @param {string} pRecordSet - The record set to check.
	 * @param {string} pViewContext - The current view context
	 */
	navigateToFilterExperienceRoute(tmpFilterExperience, pRecordSet, pViewContext)
	{
		// go to the new url with the filter experience encoded param
		if (tmpFilterExperience?.FilterExperienceEncodedURLParam && tmpFilterExperience?.FilterExperienceEncodedURLParam?.length > 0)
		{
			this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${pRecordSet}/${pViewContext}/FilterExperience/${tmpFilterExperience.FilterExperienceEncodedURLParam}`);
		}
		else
		{
			console.info('No FilterExperienceEncodedURLParam found for the current filter experience; navigating to base record set URL.');
			this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${pRecordSet}/${pViewContext}`);
		}
	}

	/**
	 * Apply the expected filter experience to load on application load for a given record set and view context. Last Used takes priority over Default.
	 * @param {string} pRecordSet - The record set to set the default filter experience for
	 * @param {string} pViewContext - The current view context
	 * @return {boolean} - Returns true when the default filter experience has been set
	 */
	applyExpectedFilterExperience(pRecordSet, pViewContext)
	{
		// TODO: this seems brittle; we should have a better way to pass in the record set and view context
		const tmpRecordSet = pRecordSet || window.location.hash.split('/')[2];
		const tmpViewContext = pViewContext || window.location.hash.split('/')[3];
		const applyLastUsed = this.getRememberLastUsedFilterExperience(tmpRecordSet, tmpViewContext);
		if (applyLastUsed)
		{
			// first try to set last used filter experience as default on load
			const tmpLastUsedFilterExperience = this.getLastUsedFilterExperience(tmpRecordSet, tmpViewContext);
			if (tmpLastUsedFilterExperience)
			{
				this.pict.log.info(`Applying last used filter experience on load for record set: ${tmpRecordSet} with view context: ${tmpViewContext}`);
				// if we are already on the last used filter experience by URL, skip loading it again
				if (this.isCurrentFilterExperience(tmpRecordSet, tmpViewContext, tmpLastUsedFilterExperience.FilterExperienceHash))
				{
					return true;
				}
				this.loadFilterMeta(tmpRecordSet, tmpViewContext, tmpLastUsedFilterExperience.FilterExperienceHash, true);
				return true;
			}
		}
		// if no last used filter experience, fall back to default filter experience on load
		const tmpDefaultFilterExperience = this.getDefaultFilterExperience(tmpRecordSet, tmpViewContext);
		if (tmpDefaultFilterExperience)
		{
			this.pict.log.info(`Applying default filter experience on load for record set: ${tmpRecordSet} with view context: ${tmpViewContext}`);
			// if we are already on the default filter experience by URL, skip loading it again
			if (this.isCurrentFilterExperience(tmpRecordSet, tmpViewContext, tmpDefaultFilterExperience.FilterExperienceHash))
			{
				return true;
			}
			this.loadFilterMeta(tmpRecordSet, tmpViewContext, tmpDefaultFilterExperience.FilterExperienceHash, true);
			return true;
		}
		return false;
	}

	/** ===== CRUD Filter Experiences ============= */

	/**
	 * Initialize the filter experience settings for a given record set and view context if they do not already exist.
	 * @param {string} pRecordSet - The record set to initialize the settings for
	 * @param {string} pViewContext - The current view context
	 * @return {string} - The filter experience settings object stringifyed (as if it was just read from storage).
	 */
	initializeFilterExperienceSettings(pRecordSet, pViewContext)
	{
		for (const recordSet in this.storageProvider)
		{
			if (recordSet.startsWith(`Filter_Meta_${pRecordSet}_${pViewContext}_` ) && recordSet.endsWith(`_SETTINGS`))
			{
				return this.storageProvider.getItem(recordSet);
			}
		}
		const defaultSettings = {
			ExcludedFromSelection: true, // this one is excluded from the selection list (it's just settings, not a real filter experience)
			RememberLastUsedFilterExperience: false,
		};
		this.storageProvider.setItem(`Filter_Meta_${pRecordSet}_${pViewContext}_SETTINGS`, JSON.stringify(defaultSettings));
		return JSON.stringify(defaultSettings);
	}

	/**
	 * Set options like Last Used / Default hashes, which are stored in the settings object for a given record set and view context.
	 * @param {string} pRecordSet - The record set to get the setting for
	 * @param {string} pViewContext - The current view context
	 * @param {object} pSettings - The settings to update
	 * @return {object} - The filter experience settings object
	 */
	updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, pSettings)
	{
		let tmpSavedSettings = this.storageProvider.getItem(`Filter_Meta_${pRecordSet}_${pViewContext}_SETTINGS`);
		let tmpSettings = tmpSavedSettings ? JSON.parse(tmpSavedSettings) : {};
		// if we've never saved settings before, initialize them first
		if (!tmpSettings)
		{
			tmpSavedSettings = this.initializeFilterExperienceSettings(pRecordSet, pViewContext);
			tmpSettings = tmpSavedSettings ? JSON.parse(tmpSavedSettings) : {};
		}
		// always update the last modified date, recordSet, and viewContext for tracking
		pSettings.RecordSet = pRecordSet ? pRecordSet : tmpSettings.RecordSet;
		pSettings.ViewContext = pViewContext ? pViewContext : tmpSettings.ViewContext;
		pSettings.LastModifiedDate = new Date().toISOString();
		// merge in the new settings
		tmpSettings = Object.assign({}, tmpSettings, pSettings);
		this.storageProvider.setItem(`Filter_Meta_${pRecordSet}_${pViewContext}_SETTINGS`, JSON.stringify(tmpSettings));
		return tmpSettings;
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
		let tmpFilterExperienceHash = (typeof(pFilterExperienceHash) === 'string') ? pFilterExperienceHash : null;
		if (!tmpFilterExperienceHash || tmpFilterExperienceHash.length === 0)
		{
			console.error('No filter experience hash provided to resolve storage key.');
			return '';
		}
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
	 * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
	 * @param {string} pRecordSet - The record set to save the filter for; 
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The name of the filter to load
	 * @param {boolean} pSkipSaveAsLastUsed - Whether to skip saving this as the last used filter experience - useful when loading last used filter itself
	 * @return {boolean} - Returns true when the filter experience has been loaded.
	 */
	loadFilterMeta(pRecordSet, pViewContext, pFilterExperienceHash, pSkipSaveAsLastUsed)
	{
		// We get this every time in case the user has multiple tabs open
		const tmpKey = this.getFilterStorageKey(pRecordSet, pViewContext, pFilterExperienceHash);
		const tmpFilterExperienceJSON = this.storageProvider.getItem(tmpKey);
		let tmpFilterExperience = tmpFilterExperienceJSON ? JSON.parse(tmpFilterExperienceJSON) : null;
		if (!tmpFilterExperience)
		{
			// check if this is the "last used" filter experience, since that one is special and we can have the URL param stored separately for unsaved searches
			const tmpLastUsedAndUnsavedExperience = this.isLastUsedFilterExperienceHash(pRecordSet, pViewContext, pFilterExperienceHash);
			if (tmpLastUsedAndUnsavedExperience)
			{
				const tmpLastUsedFilterExperience = this.getLastUsedFilterExperience(pRecordSet, pViewContext);
				this.setCurrentFilterName(tmpLastUsedFilterExperience, pRecordSet, pViewContext, 'My Last Used Filter Experience');
				this.navigateToFilterExperienceRoute(tmpLastUsedFilterExperience, pRecordSet, pViewContext);
				return true;
			}

			this.pict.log.warn(`No filter experience available to remove for record set: ${pRecordSet} with filter experience hash: ${pFilterExperienceHash}`);
			return false;
		}
		// update the current filter name in the UI
		this.setCurrentFilterName(tmpFilterExperience, pRecordSet, pViewContext);
		// re-render views if needed
		this.navigateToFilterExperienceRoute(tmpFilterExperience, pRecordSet, pViewContext);
		// update the last used filter experience
		if (!pSkipSaveAsLastUsed)
		{
			this.setLastUsedFilterExperience(tmpFilterExperience, pRecordSet, pViewContext);
		}

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
		if (this.isCurrentFilterExperience(pRecordSet, pViewContext, pFilterExperienceHash))
		{
			this.pict.log.info(`The filter experience being removed is the current active filter. Navigating to base record set URL.`);
			this.pict.views['PRSP-Filters'].handleReset(null, pRecordSet, pViewContext);
		}
		// remove the filter meta from localStorage
		this.storageProvider.removeItem(tmpKey);
		// NOTE: I think we want to keep the last used filter experience even if the user deletes it from the list? (so they can undo)

		return true;
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
		const filterDisplayName = this.getCurrentFilterName({ FilterClauses: activeFilterExperienceClauses }, pRecordSet, pViewContext);
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
		// Also set the last used filter experience (this one is reserved and continually updated)
		this.setLastUsedFilterExperience(newFilterExperience, pRecordSet, pViewContext);

		return true;
	}

	/** ===== LAST USED Filter Experience ============= */

	/**
	 * Save the application metadata as the last used filter experience (continually updated).
	 * @param {object} pFilterExperience - The new filter experience object to save as last used
	 * @param {string} pRecordSet - The record set to save the filter for;
	 * @param {string} pViewContext - The current view context
	 * @return {boolean} - Returns true when the filter experience has been saved.
	 */
	setLastUsedFilterExperience(pFilterExperience, pRecordSet, pViewContext)
	{
		const activeFilterExperienceClauses = this.pict.Bundle._ActiveFilterState[pRecordSet]?.FilterClauses || [];
		const filterDisplayName = this.getCurrentFilterName({ FilterClauses: activeFilterExperienceClauses }, pRecordSet, pViewContext);
		const tmpFilterExperienceHash = filterDisplayName.replace(/[^a-zA-Z0-9_-]/g, '');

		// NOTE: We probably don't want to save EVERY. SINGLE. SEARCH. so if no filter experience is provided (new unsaved search), we can just redirect to the url param rather than create a new saved filter experience
		const filterMetaSettings = { 
			LastUsedFilterExperience: pFilterExperience?.FilterExperienceHash || tmpFilterExperienceHash,
			LastUsedFilterExperienceURLParam: pFilterExperience?.FilterExperienceEncodedURLParam || window.location.hash.split('/FilterExperience/')?.[1] || '',
		}
		this.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, filterMetaSettings);

		return true;
	}

	/**
	 * Remove the last used filter experience for a given record set and view context. (used on "Clear" action to get back to empty filter state)
	 * @param {string} pRecordSet - The record set to remove the last used filter experience for
	 * @param {string} pViewContext - The current view context
	 * @return {boolean} - Returns true when the last used filter experience has been removed.
	 */
	removeLastUsedFilterExperience(pRecordSet, pViewContext)
	{
		this.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, { LastUsedFilterExperience: null, LastUsedFilterExperienceURLParam: null });
		return true;
	}

	/**
	 * Get the last used filter experience for a given record set and view context.
	 * @param {string} pRecordSet - The record set to get the last used filter experience for
	 * @param {string} pViewContext - The current view context
	 * @return {object} - The last used filter experience (takes priority over default if both exist)
	 */
	getLastUsedFilterExperience(pRecordSet, pViewContext)
	{
		const tmpSavedSettings = this.storageProvider.getItem(`Filter_Meta_${pRecordSet}_${pViewContext}_SETTINGS`);
		if (!tmpSavedSettings)
		{
			return null;
		}
		const tmpSettings = JSON.parse(tmpSavedSettings);
		if (!tmpSettings.RememberLastUsedFilterExperience)
		{
			return null;
		}
		const lastUsedFilterExperienceHash = tmpSettings.LastUsedFilterExperience;
		const tmpKey = this.getFilterStorageKey(pRecordSet, pViewContext, lastUsedFilterExperienceHash);
		const tmpFilterExperienceJSON = this.storageProvider.getItem(tmpKey);
		let tmpFilterExperience = tmpFilterExperienceJSON ? JSON.parse(tmpFilterExperienceJSON) : null;
		return tmpFilterExperience;
	}

	/**
	 * Check if the given filter experience is the last used filter experience for the given record set and view context.
	 * @param {string} pRecordSet - The record set to check
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The filter experience hash to check
	 * @return {boolean} - True if the given filter experience is the last used filter experience, false otherwise
	 */
	isLastUsedFilterExperienceHash(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		const tmpLastUsedFilter = this.getLastUsedFilterExperience(pRecordSet, pViewContext);
		if (!tmpLastUsedFilter)
		{
			return false;
		}
		return (tmpLastUsedFilter.FilterExperienceHash === pFilterExperienceHash);
	}

	/**
	 * Set whether to remember the last used filter experience across sessions.
	 * @param {string} pRecordSet - The record set to set the setting for
	 * @param {string} pViewContext - The current view context
	 * @param {boolean} pRemember - Whether to remember the last used filter experience
	 */
	setRememberLastUsedFilterExperience(pRecordSet, pViewContext, pRemember)
	{
		this.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, { RememberLastUsedFilterExperience: pRemember });
		return true;
	}

	/**
	 * Get whether to remember the last used filter experience across sessions.
	 * @param {string} pRecordSet - The record set to get the setting for
	 * @param {string} pViewContext - The current view context
	 * @return {boolean} - Whether to remember the last used filter experience
	 */
	getRememberLastUsedFilterExperience(pRecordSet, pViewContext)
	{
		const tmpSavedSettings = this.storageProvider.getItem(`Filter_Meta_${pRecordSet}_${pViewContext}_SETTINGS`);
		if (!tmpSavedSettings)
		{
			return null;
		}
		const tmpSettings = JSON.parse(tmpSavedSettings);
		return tmpSettings.RememberLastUsedFilterExperience;
	}

	/** ===== CURRENT Filter Experience ============= */

	/**
	 * Check if the given filter experience hash is the current active filter for the given record set.
	 * @param {string} pRecordSet - The record set to check.
	 * @param {string} pViewContext - The current view context.
	 * @param {string} pFilterExperienceHash - The filter experience hash to check.
	 * @return {boolean} - True if the given filter experience hash is the current active filter, false otherwise.
	 */
	isCurrentFilterExperience(pRecordSet, pViewContext, pFilterExperienceHash)
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
	 * @param {string} pRecordSet - The record set to get the filter name for
	 * @param {string} pViewContext - The current view context
	 * @return {string} - The current filter name
	 */
	getCurrentFilterName(pFilterExperience, pRecordSet, pViewContext)
	{
		/* @type {HTMLInputElement} */
		const tmpValue = this.pict.ContentAssignment.readContent('#FilterPersistenceView-CurrentFilterNameInput');
		if (tmpValue && tmpValue.trim().length > 0)
		{
			return tmpValue.trim();
		}
		return this.generateContextualDefaultFilterName(pFilterExperience, pRecordSet, pViewContext);
	}

	/**
	 * Set the current filter name in the UI input
	 * @param {object} [pFilterExperience] - The filter experience to set the current filter name for
	 * @param {string} [pRecordSet] - The record set to set the filter name for
	 * @param {string} [pViewContext] - The current view context
	 * @param {string} [pNewName] - The new name to set
	 * @return {boolean} - Returns true when the name has been set
	 */
	setCurrentFilterName(pFilterExperience, pRecordSet, pViewContext, pNewName)
	{
		const tmpDisplayName = pNewName || this.generateContextualDefaultFilterName(pFilterExperience, pRecordSet, pViewContext);
		this.pict.ContentAssignment.assignContent('#FilterPersistenceView-CurrentFilterNameInput', tmpDisplayName);
		return true;
	}

	/** ===== DEFAULT Filter Experience ============= */

	/**
	 * Set the default filter experience to load on application load for a given record set and filter experience hash.
	 * @param {string} pRecordSet - The record set to set the default filter experience for
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The filter experience hash to set as default on load
	 * @param {boolean} pSetAsDefault - Whether to set as default or not
	 * @return {boolean} - Returns true when the default filter experience has been set
	 */
	setDefaultFilterExperience(pRecordSet, pViewContext, pFilterExperienceHash, pSetAsDefault)
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
		if (pSetAsDefault && this.isDefaultFilterExperience(pRecordSet, pViewContext, tmpFilterExperience.FilterExperienceHash))
		{
			this.pict.log.info(`Filter experience 'Filter_Meta_${pRecordSet}_${pViewContext}_${pFilterExperienceHash}' is already set as default on load. No action taken.`);
			return true;
		}
		// if unsetting default, but not currently default, do nothing
		if (!pSetAsDefault && !this.isDefaultFilterExperience(pRecordSet, pViewContext, tmpFilterExperience.FilterExperienceHash))
		{
			this.pict.log.info(`Filter experience 'Filter_Meta_${pRecordSet}_${pViewContext}_${pFilterExperienceHash}' is not currently set as default on load. No action taken.`);
			return true;
		}
		// update the settings
		// NOTE: We may probably want an customer-based fallback is there user default settings are cleared. For now, we will just clear it until we know that pattern.
		this.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, { DefaultFilterExperienceHash: pSetAsDefault ? pFilterExperienceHash : null });
		return true;
	}

	/**
	 * Remove the default filter experience for a given record set and view context. (used on "Clear" action to get back to empty filter state)
	 * @param {string} pRecordSet - The record set to remove the default filter experience for
	 * @param {string} pViewContext - The current view context
	 * @return {boolean} - Returns true when the default filter experience has been removed.
	 */
	removeDefaultFilterExperience(pRecordSet, pViewContext)
	{
		this.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, { DefaultFilterExperienceHash: null });
		return true;
	}

	/**
	 * Get the default filter experience to load on application load for a given record set and view context.
	 * @param {string} pRecordSet - The record set to get the default filter experience for
	 * @param {string} pViewContext - The current view context
	 * @return {object} - The default filter experience to load on application load (used if no last used filter experience is found or they clear filters back to default)
	 */
	getDefaultFilterExperience(pRecordSet, pViewContext)
	{
		const tmpSavedSettings = this.storageProvider.getItem(`Filter_Meta_${pRecordSet}_${pViewContext}_SETTINGS`);
		if (!tmpSavedSettings)
		{
			return null;
		}
		const tmpSettings = JSON.parse(tmpSavedSettings);
		const tmpExpectedHash = tmpSettings.DefaultFilterExperienceHash;
		const tmpKey = this.getFilterStorageKey(pRecordSet, pViewContext, tmpExpectedHash);
		const tmpFilterExperienceJSON = this.storageProvider.getItem(tmpKey);
		let tmpFilterExperience = tmpFilterExperienceJSON ? JSON.parse(tmpFilterExperienceJSON) : null;
		return tmpFilterExperience;
	}

	/**
	 * Check if the given filter experience is the default filter experience to load on application load for the given record set and view context.
	 * @param {string} pRecordSet - The record set to check
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The filter experience hash to check
	 * @return {boolean} - True if the given filter experience is the default filter experience on load, false otherwise
	 */
	isDefaultFilterExperience(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		const tmpSavedSettings = this.storageProvider.getItem(`Filter_Meta_${pRecordSet}_${pViewContext}_SETTINGS`);
		if (!tmpSavedSettings)
		{
			return false;
		}
		const tmpSettings = JSON.parse(tmpSavedSettings);
		return (tmpSettings.DefaultFilterExperienceHash === pFilterExperienceHash);
	}

	/** ===== SIMPLE KEY-VALUE CACHE ============= */

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
