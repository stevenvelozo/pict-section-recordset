export = FilterDataProvider;
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
declare class FilterDataProvider extends libPictProvider {
    /**
     * @param {import('pict')} pFable - The Fable instance
     * @param {Record<string, any>} [pOptions] - The options for the provider
     * @param {string} [pServiceHash] - The service hash for the provider
     */
    constructor(pFable: import("pict"), pOptions?: Record<string, any>, pServiceHash?: string);
    storageProvider: any;
    keyCache: {};
    /** ===== UTILITY for Filter Experience ============= */
    /**
     * Using the information in the FilterClauses, try to generate a contextual default filter name for the display name of the current experience.
     *
     * @param {object} pFilterExperience - The filter experience to generate the default filter name for
     * @param {string} [pRecordSet] - The current record set
     * @param {string} [pViewContext] - The current view context
     * @return {string} - The generated default filter name
     */
    generateContextualDefaultFilterName(pFilterExperience: object, pRecordSet?: string, pViewContext?: string): string;
    /**
     * Re-render all views affected by a filter change.
     * @param {object} tmpFilterExperience - The filter meta record that was changed/added.
     * @param {string} pRecordSet - The record set to check.
     * @param {string} pViewContext - The current view context
     */
    navigateToFilterExperienceRoute(tmpFilterExperience: object, pRecordSet: string, pViewContext: string): void;
    /**
     * Apply the expected filter experience to load on application load for a given record set and view context. Last Used takes priority over Default.
     * This is the main entry point to set the default/latest filter experience on app load for a given record set and view context.
     * @param {string} pRecordSet - The record set to set the default filter experience for
     * @param {string} pViewContext - The current view context
     * @return {boolean} - Returns true when the default filter experience has been set
     */
    applyExpectedFilterExperience(pRecordSet: string, pViewContext: string): boolean;
    /** ===== CRUD Filter Experiences ============= */
    /**
     * Initialize the filter experience settings for a given record set and view context if they do not already exist.
     * @param {string} pRecordSet - The record set to initialize the settings for
     * @param {string} pViewContext - The current view context
     * @param {object} [pAdditionalSettings] - Additional settings to initialize with (pass through for future use)
     * @return {string} - The filter experience settings object stringifyed (as if it was just read from storage).
     */
    initializeFilterExperienceSettings(pRecordSet: string, pViewContext: string, pAdditionalSettings?: object): string;
    /**
     * Set options like Last Used / Default hashes, which are stored in the settings object for a given record set and view context.
     * @param {string} pRecordSet - The record set to get the setting for
     * @param {string} pViewContext - The current view context
     * @param {object} pSettings - The settings to update
     * @return {object} - The filter experience settings object
     */
    updateFilterExperienceSettingsFromStorage(pRecordSet: string, pViewContext: string, pSettings: object): object;
    /**
     * Get a single filter experience by its hash for a given record set and view context.
     * @param {string} pRecordSet - The record set to get the filter experience for
     * @param {string} pViewContext - The current view context
     * @param {string} pFilterExperienceHash - The filter experience hash to get
     * @return {object} - The filter experience object
     */
    getFilterExperienceByHash(pRecordSet: string, pViewContext: string, pFilterExperienceHash: string): object;
    /**
     * List all available filter experiences (from the Filter Meta data) for a given record set and return them as an array of filter meta objects.
     * @param {string} pRecordSet - the record set to list the filter experiences for
     * @param {string} pViewContext - the current view context
     * @return {Array<object>} - An array of filter meta objects for the given record set.
     */
    getAllFiltersExperiencesForRecordSet(pRecordSet: string, pViewContext: string): Array<object>;
    /**
     * Resolve a key in the LocalStorage keyspace for a filter experience for a given record set.
     * @param {string} pRecordSet - The record set to resolve a key for
     * @param {string} pViewContext - The current view context
     * @param {string} pFilterExperienceHash - The scope to resolve a key for
     *
     * @return {string} A string that points to the record.
     */
    getFilterStorageKey(pRecordSet: string, pViewContext: string, pFilterExperienceHash: string): string;
    /**
     * Check if a filter experience exists for a given record set and filter experience hash.
     * @param {string} pRecordSet - The record set to check.
     * @param {string} pViewContext - The current view context
     * @param {string} pFilterExperienceHash - The filter experience hash to check.
     * @return {boolean} - True if the filter experience exists, false otherwise.
     */
    checkIfFilterExperienceExists(pRecordSet: string, pViewContext: string, pFilterExperienceHash: string): boolean;
    /**
     * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
     * @param {string} pRecordSet - The record set to save the filter for;
     * @param {string} pViewContext - The current view context
     * @param {string} pFilterExperienceHash - The name of the filter to load
     * @param {boolean} pSkipSaveAsLastUsed - Whether to skip saving this as the last used filter experience - useful when loading last used filter itself
     * @return {boolean} - Returns true when the filter experience has been loaded.
     */
    loadFilterMeta(pRecordSet: string, pViewContext: string, pFilterExperienceHash: string, pSkipSaveAsLastUsed: boolean): boolean;
    /**
     * Remove a filter meta from storage for a given record set and filter experience hash.
     * @param {string} pRecordSet - The record set to remove the filter for
     * @param {string} pViewContext - The current view context
     * @param {string} pFilterExperienceHash - The filter experience hash to remove
     * @return {boolean} - Returns true when the filter meta has been removed.
     */
    removeFilterMeta(pRecordSet: string, pViewContext: string, pFilterExperienceHash: string): boolean;
    /**
     * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
     * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
     * @param {string} pViewContext - The current view context
     * @return {boolean} - Returns true when the settings have been saved.
     */
    saveFilterMeta(pRecordSet: string, pViewContext: string): boolean;
    /** ===== LAST USED Filter Experience ============= */
    /**
     * Save the application metadata as the last used filter experience (continually updated).
     * @param {object} pFilterExperience - The new filter experience object to save as last used
     * @param {string} pRecordSet - The record set to save the filter for;
     * @param {string} pViewContext - The current view context
     * @return {boolean} - Returns true when the filter experience has been saved.
     */
    setLastUsedFilterExperience(pFilterExperience: object, pRecordSet: string, pViewContext: string): boolean;
    /**
     * Remove the last used filter experience for a given record set and view context. (used on "Clear" action to get back to empty filter state)
     * @param {string} pRecordSet - The record set to remove the last used filter experience for
     * @param {string} pViewContext - The current view context
     * @return {boolean} - Returns true when the last used filter experience has been removed.
     */
    removeLastUsedFilterExperience(pRecordSet: string, pViewContext: string): boolean;
    /**
     * Get the last used filter experience for a given record set and view context.
     * @param {string} pRecordSet - The record set to get the last used filter experience for
     * @param {string} pViewContext - The current view context
     * @return {object} - The last used filter experience (takes priority over default if both exist)
     */
    getLastUsedFilterExperience(pRecordSet: string, pViewContext: string): object;
    /**
     * Check if the given filter experience is the last used filter experience for the given record set and view context.
     * @param {string} pRecordSet - The record set to check
     * @param {string} pViewContext - The current view context
     * @param {string} pFilterExperienceHash - The filter experience hash to check
     * @return {boolean} - True if the given filter experience is the last used filter experience, false otherwise
     */
    isLastUsedFilterExperienceHash(pRecordSet: string, pViewContext: string, pFilterExperienceHash: string): boolean;
    /**
     * Set whether to remember the last used filter experience across sessions.
     * @param {string} pRecordSet - The record set to set the setting for
     * @param {string} pViewContext - The current view context
     * @param {boolean} pRemember - Whether to remember the last used filter experience
     */
    setRememberLastUsedFilterExperience(pRecordSet: string, pViewContext: string, pRemember: boolean): boolean;
    /**
     * Get whether to remember the last used filter experience across sessions.
     * @param {string} pRecordSet - The record set to get the setting for
     * @param {string} pViewContext - The current view context
     * @return {boolean} - Whether to remember the last used filter experience
     */
    getRememberLastUsedFilterExperience(pRecordSet: string, pViewContext: string): boolean;
    /** ===== CURRENT Filter Experience ============= */
    /**
     * Check if the given filter experience hash is the current active filter for the given record set.
     * @param {string} pRecordSet - The record set to check.
     * @param {string} pViewContext - The current view context.
     * @param {string} pFilterExperienceHash - The filter experience hash to check.
     * @return {boolean} - True if the given filter experience hash is the current active filter, false otherwise.
     */
    isCurrentFilterExperience(pRecordSet: string, pViewContext: string, pFilterExperienceHash: string): boolean;
    /**
     * Get the current filter name from the UI input (or generate a default one)
     * @param {object} pFilterExperience - The filter experience to get the current filter name for
     * @param {string} pRecordSet - The record set to get the filter name for
     * @param {string} pViewContext - The current view context
     * @return {string} - The current filter name
     */
    getCurrentFilterName(pFilterExperience: object, pRecordSet: string, pViewContext: string): string;
    /**
     * Set the current filter name in the UI input
     * @param {object} [pFilterExperience] - The filter experience to set the current filter name for
     * @param {string} [pRecordSet] - The record set to set the filter name for
     * @param {string} [pViewContext] - The current view context
     * @param {string} [pNewName] - The new name to set
     * @return {boolean} - Returns true when the name has been set
     */
    setCurrentFilterName(pFilterExperience?: object, pRecordSet?: string, pViewContext?: string, pNewName?: string): boolean;
    /** ===== DEFAULT Filter Experience ============= */
    /**
     * Set the default filter experience to load on application load for a given record set and filter experience hash.
     * @param {string} pRecordSet - The record set to set the default filter experience for
     * @param {string} pViewContext - The current view context
     * @param {string} pFilterExperienceHash - The filter experience hash to set as default on load
     * @param {boolean} pSetAsDefault - Whether to set as default or not
     * @return {boolean} - Returns true when the default filter experience has been set
     */
    setDefaultFilterExperience(pRecordSet: string, pViewContext: string, pFilterExperienceHash: string, pSetAsDefault: boolean): boolean;
    /**
     * Remove the default filter experience for a given record set and view context. (used on "Clear" action to get back to empty filter state)
     * @param {string} pRecordSet - The record set to remove the default filter experience for
     * @param {string} pViewContext - The current view context
     * @return {boolean} - Returns true when the default filter experience has been removed.
     */
    removeDefaultFilterExperience(pRecordSet: string, pViewContext: string): boolean;
    /**
     * Get the default filter experience to load on application load for a given record set and view context.
     * @param {string} pRecordSet - The record set to get the default filter experience for
     * @param {string} pViewContext - The current view context
     * @return {object} - The default filter experience to load on application load (used if no last used filter experience is found or they clear filters back to default)
     */
    getDefaultFilterExperience(pRecordSet: string, pViewContext: string): object;
    /**
     * Check if the given filter experience is the default filter experience to load on application load for the given record set and view context.
     * @param {string} pRecordSet - The record set to check
     * @param {string} pViewContext - The current view context
     * @param {string} pFilterExperienceHash - The filter experience hash to check
     * @return {boolean} - True if the given filter experience is the default filter experience on load, false otherwise
     */
    isDefaultFilterExperience(pRecordSet: string, pViewContext: string, pFilterExperienceHash: string): boolean;
    /**
     * Get the fallback default filter experience URL param to load on application load for a given record set and view context.
     * @param {string} pRecordSet - The record set to get the fallback default filter experience for
     * @param {string} pViewContext - The current view context
     * @return {string|null} - The fallback default filter experience URL param to load on application load (could be server/customer provided)
     */
    getFallbackDefaultFilterExperienceSettings(pRecordSet: string, pViewContext: string): string | null;
    /**
     * Set the fallback default filter experience URL param to load on application load for a given record set and view context. Expected to be used for server/customer provided fallbacks.
     * @param {string} pRecordSet - The record set to set the fallback default filter experience for
     * @param {string} pViewContext - The current view context
     * @param {string} pURLParam - The fallback default filter experience URL param to set
     * @return {boolean} - Returns true when the fallback default filter experience URL param has been set
     */
    setFallbackDefaultFilterExperienceSettings(pRecordSet: string, pViewContext: string, pURLParam: string): boolean;
    /** ===== SIMPLE KEY-VALUE CACHE ============= */
    /**
     * @param {string} pKey - The key to get from the cache
     * @return {any} - The value associated with the key, or false if not found
     */
    getItem(pKey: string): any;
    /**
     * @param {string} pKey - The key to set in the cache
     * @param {any} pValue - The value to associate with the key
     */
    setItem(pKey: string, pValue: any): boolean;
    /**
     * @param {string} pKey - The key to remove from the cache
     * @return {boolean} - True if the item was removed, false if it was not found
     */
    removeItem(pKey: string): boolean;
}
declare namespace FilterDataProvider {
    export { _DEFAULT_PROVIDER_CONFIGURATION as default_configuration };
}
import libPictProvider = require("pict-provider");
declare namespace _DEFAULT_PROVIDER_CONFIGURATION {
    let ProviderIdentifier: string;
    let AutoInitialize: boolean;
    let AutoInitializeOrdinal: number;
}
//# sourceMappingURL=Filter-Data-Provider.d.ts.map