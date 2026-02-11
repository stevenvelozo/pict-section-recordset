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

 * Storage Key Structure:
 * - Filter_Meta_{RecordSet}_{ViewContext}_{FilterExperienceHash} : stores the Filter Meta JSON.

 * Object Shape for Filter Meta (filter experience):
 * {
 *   RecordSet: string, (auto-filled on save)
 *   ViewContext: string, (auto-filled on save)
 *   LastModifiedDate: string (ISO date) (auto-filled on save)
 *   FilterClauses: Array<{ Label: string, ExactMatch: boolean, Value: string }>,
 *   FilterDisplayName: string,
 *   FilterExperienceHash: string, (display name converted to hash)
 *   FilterExperienceEncodedURLParam: string, (URL-encoded filter state)
 
 * Object Shape for Filter Experience Settings:
 * {
 *   ExcludedFromSelection: boolean,
 *   RememberLastUsedFilterExperience: boolean,
 *   LastUsedFilterExperienceHash: string | null,
 *   LastUsedFilterExperienceURLParam: string | null,
 *   DefaultFilterExperienceHash: string | null,
 *   DefaultFilterExperienceURLParam: string | null,
 *   FallbackDefaultExperienceURLParam: string | null,
 * }
*/

// TODO: would nice to convert the comments above to actual types for better clarity and enforcement, but could use help on how to do that.

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
		// use this to track if we have unapplied filter changes
		this.filterExperienceModifiedFromURLHash = false;
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
		const tmpDisplayClauseLimit = 3;
		const tmpRecordSet = pFilterExperience?.RecordSet || pRecordSet || '';
		const tmpClauses = pFilterExperience?.FilterClauses || this.pict.Bundle._ActiveFilterState[tmpRecordSet]?.FilterClauses || [];
		const displayClauses = tmpClauses.length > tmpDisplayClauseLimit ? tmpClauses.slice(0, tmpDisplayClauseLimit) : tmpClauses;
		if (tmpClauses && tmpClauses.length > 0)
		{
			let tmpStringSuffix = '';
			if (tmpClauses.length > tmpDisplayClauseLimit)
			{
				
				tmpStringSuffix = `... (${tmpClauses.length} total filters)`;
			}
			const clauseSummaries = displayClauses.map((clause) => {
				return `${clause.Label || clause.FilterByColumn}`;
				// TODO: We could provide exact values, but we need to account for all the internal/external entity look ups, plus selection handlers on each filter to update the value entered
				// 		 For now, let's just show the column/label since this is a generated suggestion name and will likely to be edited by the user to something more meaningful before saving, but this is an area we could enhance in the future to make the generated names more descriptive
				//return `${clause.Label || clause.FilterByColumn} ${clause.ExactMatch ? 'IS' : 'CONTAINS'} ${clause.Value || clause?.Values?.join(',') || '(unset)'}`;
			});
			return `${clauseSummaries.join(' AND ')}${ tmpStringSuffix }`;
		}
		// give up, fall back to default name
		return `New ${pRecordSet} ${pViewContext} Filter`;
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
	 * This is the main entry point to set the default/latest filter experience on app load for a given record set and view context.
	 * @param {string} pRecordSet - The record set to set the default filter experience for
	 * @param {string} pViewContext - The current view context
	 * @return {boolean} - Returns true when the default filter experience has been set
	 */
	applyExpectedFilterExperience(pRecordSet, pViewContext)
	{
		const applyLastUsed = this.getRememberLastUsedFilterExperience(pRecordSet, pViewContext);
		const tmpDefaultFilterExperience = this.getDefaultFilterExperience(pRecordSet, pViewContext);
		const tmpFallbackDefaultExperienceURLParam = this.getFallbackDefaultFilterExperienceSettings(pRecordSet, pViewContext);
		if (applyLastUsed)
		{
			// first try to set last used filter experience as default on load
			const tmpLastUsedFilterExperience = this.getLastUsedFilterExperience(pRecordSet, pViewContext);
			if (tmpLastUsedFilterExperience)
			{
				this.pict.log.info(`Applying last used filter experience on load for record set: ${pRecordSet} with view context: ${pViewContext}`);
				// if we are already on the last used filter experience by URL, skip loading it again
				if (this.isCurrentFilterExperience(pRecordSet, pViewContext, tmpLastUsedFilterExperience.FilterExperienceHash))
				{
					return true;
				}
				this.loadFilterMeta(pRecordSet, pViewContext, tmpLastUsedFilterExperience.FilterExperienceHash, true);
				return true;
			}
		} 
		// if no last used filter experience, fall back to default filter experience on load
		else if (tmpDefaultFilterExperience && tmpDefaultFilterExperience.FilterExperienceHash)
		{
			this.pict.log.info(`Applying default filter experience on load for record set: ${pRecordSet} with view context: ${pViewContext}`);
			// if we are already on the default filter experience by URL, skip loading it again
			if (this.isCurrentFilterExperience(pRecordSet, pViewContext, tmpDefaultFilterExperience.FilterExperienceHash))
			{
				return true;
			}
			this.loadFilterMeta(pRecordSet, pViewContext, tmpDefaultFilterExperience.FilterExperienceHash, true);
			return true;
		}
		// finally, check for a fallback default experience URL param to load (could be server/customer provided)
		else if (tmpFallbackDefaultExperienceURLParam && tmpFallbackDefaultExperienceURLParam.length > 0)
		{
			this.pict.log.info(`Applying fallback default filter experience URL param on load for record set: ${pRecordSet} with view context: ${pViewContext}`);
			this.fable.providers.RecordSetRouter.pictRouter.navigate(`/PSRS/${pRecordSet}/${pViewContext}/FilterExperience/${tmpFallbackDefaultExperienceURLParam}`);
			return true;
		}
		// no filter experience to apply
		return false;
	}

	/** ===== CRUD Filter Experiences ============= */

	/**
	 * Initialize the filter experience settings for a given record set and view context if they do not already exist.
	 * @param {string} pRecordSet - The record set to initialize the settings for
	 * @param {string} pViewContext - The current view context
	 * @param {object} [pAdditionalSettings] - Additional settings to initialize with (pass through for future use)
	 * @return {string} - The filter experience settings object stringifyed (as if it was just read from storage).
	 */
	initializeFilterExperienceSettings(pRecordSet, pViewContext, pAdditionalSettings)
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
			LastUsedFilterExperienceHash: null,
			LastUsedFilterExperienceURLParam: null,
			DefaultFilterExperienceHash: null,
			DefaultFilterExperienceURLParam: null,
			FallbackDefaultExperienceURLParam: null, // in case the default filter experience is deleted, what URL param to fall back to (could be a server/customer provided fallback)
		};
		// if additional settings were provided, merge them in
		if (pAdditionalSettings && typeof(pAdditionalSettings) === 'object')
		{
			Object.assign(defaultSettings, pAdditionalSettings);
			// ex: set 'FallbackDefaultExperienceURLParam' here for future use
		}
		// save the default settings to storage
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
	 * Get a single filter experience by its hash for a given record set and view context.
	 * @param {string} pRecordSet - The record set to get the filter experience for
	 * @param {string} pViewContext - The current view context
	 * @param {string} pFilterExperienceHash - The filter experience hash to get
	 * @return {object} - The filter experience object
	 */
	getFilterExperienceByHash(pRecordSet, pViewContext, pFilterExperienceHash)
	{
		if (!pRecordSet || !pViewContext)
		{
			console.error('No record set or view context provided to get filter experience.');
			return null;
		}
		if (!pFilterExperienceHash || pFilterExperienceHash.length === 0)
		{
			console.warn('No filter experience hash provided to get filter experience.');
			return null;
		}
		const tmpKey = this.getFilterStorageKey(pRecordSet, pViewContext, pFilterExperienceHash);
		const tmpFilterExperienceJSON = this.storageProvider.getItem(tmpKey);
		let tmpFilterExperience = tmpFilterExperienceJSON ? JSON.parse(tmpFilterExperienceJSON) : null;
		return tmpFilterExperience;
	}

	/**
	 * List all available filter experiences (from the Filter Meta data) for a given record set and return them as an array of filter meta objects.
	 * @param {string} pRecordSet - the record set to list the filter experiences for
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
			console.warn('No filter experience hash provided to resolve storage key.');
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
				// clear the unapplied changes flag since we just loaded a filter experience
				this.filterExperienceModifiedFromURLHash = false;
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
		// clear the unapplied changes flag since we just loaded a filter experience
		this.filterExperienceModifiedFromURLHash = false;
		
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
		// check if the filter being removed is set as last used or default; if so, clear those settings too
		if (this.isLastUsedFilterExperienceHash(pRecordSet, pViewContext, pFilterExperienceHash))
		{
			this.pict.log.info(`The filter experience being removed is set as the last used filter experience. Clearing last used filter experience settings.`);
			this.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, { LastUsedFilterExperienceHash: null, LastUsedFilterExperienceURLParam: null });
		}
		if (this.isDefaultFilterExperience(pRecordSet, pViewContext, pFilterExperienceHash))
		{
			this.pict.log.info(`The filter experience being removed is set as the default filter experience. Clearing default filter experience settings.`);
			this.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, { DefaultFilterExperienceHash: null, DefaultFilterExperienceURLParam: null });
		}
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
		// they should never get here if they have unsaved changes and navigate away since we check for that in the router, but just in case, we can clear the flag that tracks whether there are unapplied changes since we just saved
		this.filterExperienceModifiedFromURLHash = false;

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
			LastUsedFilterExperienceHash: pFilterExperience?.FilterExperienceHash || tmpFilterExperienceHash,
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
		this.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, { LastUsedFilterExperienceHash: null, LastUsedFilterExperienceURLParam: null });
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
		const lastUsedFilterExperienceHash = tmpSettings.LastUsedFilterExperienceHash;
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
		if (!tmpExpectedHash || tmpExpectedHash.length === 0)
		{
			return null;
		}
		// look up the filter experience by hash (it's expected all Default hashes are saved filter experiences)
		return this.getFilterExperienceByHash(pRecordSet, pViewContext, tmpExpectedHash);
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

	/**
	 * Get the fallback default filter experience URL param to load on application load for a given record set and view context.
	 * @param {string} pRecordSet - The record set to get the fallback default filter experience for
	 * @param {string} pViewContext - The current view context
	 * @return {string|null} - The fallback default filter experience URL param to load on application load (could be server/customer provided)
	 */
	getFallbackDefaultFilterExperienceSettings(pRecordSet, pViewContext)
	{
		const tmpSavedSettings = this.storageProvider.getItem(`Filter_Meta_${pRecordSet}_${pViewContext}_SETTINGS`);
		if (!tmpSavedSettings)
		{
			return null;
		}
		const tmpSettings = JSON.parse(tmpSavedSettings);
		return tmpSettings.FallbackDefaultExperienceURLParam || null;
	}

	/**
	 * Set the fallback default filter experience URL param to load on application load for a given record set and view context. Expected to be used for server/customer provided fallbacks.
	 * @param {string} pRecordSet - The record set to set the fallback default filter experience for
	 * @param {string} pViewContext - The current view context
	 * @param {string} pURLParam - The fallback default filter experience URL param to set
	 * @return {boolean} - Returns true when the fallback default filter experience URL param has been set
	 */
	setFallbackDefaultFilterExperienceSettings(pRecordSet, pViewContext, pURLParam)
	{
		this.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, { FallbackDefaultExperienceURLParam: pURLParam });
		return true;
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
