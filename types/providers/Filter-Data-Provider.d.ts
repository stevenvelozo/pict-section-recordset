export = FilterDataProvider;
declare class FilterDataProvider extends libPictProvider {
    /**
     * @param {import('pict')} pFable - The Fable instance
     * @param {Record<string, any>} [pOptions] - The options for the provider
     * @param {string} [pServiceHash] - The service hash for the provider
     */
    constructor(pFable: import("pict"), pOptions?: Record<string, any>, pServiceHash?: string);
    storageProvider: any;
    keyCache: {};
    filtersMap: {};
    lastFilterExperienceHashMap: {};
    /**
     * @return {void}
     */
    loadFilters(): void;
    /**
     * List all available Filters (from the Filter Meta data)
     *
     * @param {string} pRecordSet - the record set to list the filters for
     *
     * @return Array<Record<string, any>> - a list of Filters as Index/FilterExperienceHash entries
     */
    listFilters(pRecordSet: string): any;
    /**
     * @param {string} pRecordSet - the record set to get the active filter experience for
     *
     * @return {Record<string, any>} - the active filter experience for the given record set
     */
    getActiveFilterExperience(pRecordSet: string): Record<string, any>;
    /**
     * Check if a particular scope is in use.
     *
     * @param {string} pRecordSet - the record set
     * @param {string} pFilterExperienceHash - the manyfest scope to check the existence of
     *
     * @return {boolean}
     */
    checkFilterExists(pRecordSet: string, pFilterExperienceHash: string): boolean;
    /**
     * Resolve a key in the LocalStorage keyspace for a filter experience for a given record set.
     *
     * @param {string} pRecordSet - The record set to resolve a key for
     * @param {string} pFilterExperienceHash - The scope to resolve a key for
     *
     * @return {string} A string that points to the record.
     */
    getFilterStorageKey(pRecordSet: string, pFilterExperienceHash: string): string;
    /**
     * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
     *
     * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
     * @param {boolean} [pRender=false] - Whether or not to also render the list of Filters in the UI automatically
     */
    saveFilterMeta(pRecordSet: string, pRender?: boolean): boolean;
    /**
     * Save the application metadata (list of Filters, last loaded FilterExperienceHash, etc.)
     *
     * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
     * @param {boolean} [pRender=false] - Whether or not to also render the list of Filters in the UI automatically
     *
     * @return {Array<object>} The list of available Filters.
     */
    loadFilterMeta(pRecordSet: string, pRender?: boolean): Array<object>;
    /**
     * @param {string} pRecordSet - The record set to add the filter experience hash to
     * @param {string} pFilterExperienceHash - The filter experience hash to add
     * @param {boolean} [pRender=true] - Whether or not to also render the list of Filters in the UI automatically
     *
     * @return {boolean} True if the filter experience hash was added, false if it already exists.
     */
    addFilterExperienceHashToFilterList(pRecordSet: string, pFilterExperienceHash: string, pRender?: boolean): boolean;
    /**
     * @param {string} pRecordSet - The record set to remove the filter experience hash from
     * @param {string} pFilterExperienceHash - The filter experience hash to remove
     * @param {boolean} [pRender=true] - Whether or not to also render the list of Filters in the UI automatically
     */
    removeFilterExperienceHashFromFilterList(pRecordSet: string, pFilterExperienceHash: string, pRender?: boolean): boolean;
    /**
     * @param {string} pRecordSet - The record set to create a new filter for
     * @param {string} [pFilterExperienceHash] - The filter experience hash to create a new filter for; if not provided, a new one will be generated
     */
    newFilter(pRecordSet: string, pFilterExperienceHash?: string): void;
    /**
     * @param {string} pRecordSet - The record set to save the filter for; TODO: should this have a default?
     */
    saveFilter(pRecordSet: string): void;
    /**
     * @param {string} pRecordSet - The record set to load the filter for
     * @param {string} pFilterFilterExperienceHash - The filter experience hash to load; if not provided, the last used one will be loaded
     */
    loadFilter(pRecordSet: string, pFilterFilterExperienceHash: string): void;
    /**
     * @param {string} pKey - The key to get from the cache
     *
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
     *
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