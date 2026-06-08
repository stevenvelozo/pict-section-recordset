export = ViewRecordSetSUBSETFilters;
declare class ViewRecordSetSUBSETFilters extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('fable') & import('pict') & { PictSectionRecordSet: import('../Pict-Section-RecordSet.js') }} */
    pict: any & import("pict") & {
        PictSectionRecordSet: {
            new (pFable: any, pOptions: any, pServiceHash: any): import("../services/RecordsSet-MetaController.js");
            default_configuration: Record<string, any>;
            isFableService: boolean;
            CoreServiceProviderBase: typeof import("fable-serviceproviderbase");
            PictRecordSetApplication: typeof import("../application/Pict-Application-RecordSet.js");
            RecordSetProviderBase: typeof import("../providers/RecordSet-RecordProvider-Base.js");
            RecordSetProviderMeadowEndpoints: typeof import("../providers/RecordSet-RecordProvider-MeadowEndpoints.js");
        };
    };
    chars: string;
    lookup: any[] | Uint8Array<ArrayBuffer>;
    newFilterSearchApplied: boolean;
    addFilterCallback: Function;
    removeFilterCallback: Function;
    _drawerOpen: boolean;
    _searchString: {};
    _renderEpoch: number;
    _addFilterOpen: boolean;
    _addFilterRecordSet: string;
    _addFilterViewContext: string;
    _addFilterSearch: string;
    _addFilterExpandedKey: any;
    filterFieldBlacklist: any[];
    /**
     * Bump the render epoch. Call this whenever the active filter clauses are
     * about to change in a way that would invalidate in-flight filter renders.
     *
     * @return {number} The new epoch value.
     */
    bumpRenderEpoch(): number;
    /**
     * Sets a callback function to be executed after a filter is added.
     * @param {function} pCallback - The callback function to be executed after a filter is added.
     */
    setAddFilterCallback(pCallback: Function): void;
    /**
     * Sets a callback function to be executed after a filter is removed.
     * @param {function} pCallback - The callback function to be executed after a filter is removed.
     */
    setRemoveFilterCallback(pCallback: Function): void;
    /**
     * Removes the callback function for adding a filter.
     */
    removeAddFilterCallback(): void;
    /**
     * Removes the callback function for removing a filter.
     */
    removeRemoveFilterCallback(): void;
    /**
     * @return {string} - The marshalling prefix configured for filters. Usually 'Bundle.'
     */
    getInformaryAddressPrefix(): string;
    /**
     * @param {string} pAddress - The address of the informary to get the value from.
     *
     * @return {any} - The value at the given address, using the informary marshalling prefix.
     */
    getInformaryScopedValue(pAddress: string): any;
    /**
     * Marshals data from the view to the model, usually AppData (or configured data store).
     * @returns {any} The result of the superclass's onMarshalFromView method.
     */
    onMarshalFromView(): any;
    /**
     * Marshals the data to the view from the model, usually AppData (or configured data store).
     * @returns {any} The result of the super.onMarshalToView() method.
     */
    onMarshalToView(): any;
    /** Toggle the slide-out filter drawer beneath the search bar. */
    toggleFilterDrawer(): boolean;
    /**
     * The current search term, read back from the active route URL (the source of truth) so
     * the search box stays populated across re-renders and reflects bookmarked/filtered URLs.
     * performSearch builds `.../FilteredTo/FBVOR~<field>~LK~<encoded %term%>~...` from the
     * SearchFields, so the term is the first LK value in the FilteredTo segment.
     *
     * @return {string}
     */
    _searchTermFromURL(): string;
    /** The number of active (structured) filter clauses for a record set. */
    getActiveFilterCount(pRecordSet: any): number;
    /**
     * Repaint the filter-bar chrome after a (re)render: the filters icon (outline vs filled
     * + count badge), the active-filter highlight, the persisted drawer-open state, and the
     * search input value (so applying a search no longer clears the search box).
     *
     * @param {string} pRecordSet
     */
    _paintFilterControls(pRecordSet: string): void;
    /**
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     */
    handleSearch(pEvent: Event, pRecordSet: string, pViewContext: string): void;
    /**
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     * @param {string} [pFilterString] - The filter string to apply, defaults to a single space if not provided
     */
    performSearch(pRecordSet: string, pViewContext: string, pFilterString?: string): void;
    /**
     * Clear all filter clauses for the given record set and view context.
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     */
    handleClear(pEvent: Event, pRecordSet: string, pViewContext: string): void;
    /**
     * Reset the filters to default state or fallback to to clear everything if no default exist for the given record set and view context.
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     */
    handleReset(pEvent: Event, pRecordSet: string, pViewContext: string): void;
    /**
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     * @returns {boolean} - Always returns false to prevent default action
    */
    handleManage(pEvent: Event, pRecordSet: string, pViewContext: string): boolean;
    /**
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     */
    toggleAddFilterPopover(pEvent: Event, pRecordSet: string, pViewContext: string): void;
    /** Close the add-filter popover. */
    closeAddFilterPopover(): void;
    /**
     * Filter the add-filter field list by a search term, re-rendering only the list so the
     * search input keeps focus.
     * @param {string} pValue - The search term.
     */
    searchAddFilter(pValue: string): void;
    /**
     * Expand or collapse a field's available clauses in the add-filter popover.
     * @param {string} pFilterKey - The field whose clauses to toggle.
     */
    toggleAddFilterField(pFilterKey: string): void;
    /**
     * (Re)build the add-filter popover's field list into AppData from the record set's filter
     * schema, honouring the current search term and the expanded field.
     * @param {string} pRecordSet - The record set whose filter schema to read.
     */
    _buildAddFilterFields(pRecordSet: string): void;
    /** Reflect the add-filter popover's open/closed state on its container element. */
    _paintAddFilterOpenState(): void;
    /**
     * Position the (fixed) add-filter popover against its trigger button, flipping above when there's
     * more room there. Fixed positioning means no ancestor overflow:hidden (the host's filter card, the
     * slide-out drawer) can clip it — the price is we set its top/left from the trigger's rect here.
     *
     * @param {HTMLElement} pPopover - the #PRSP_AddFilter_Popover element (already display:block).
     */
    _positionAddFilterPopover(pPopover: HTMLElement): void;
    /**
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     * @param {string} pFilterKey - The key of the filter to add
     * @param {string} pClauseKey - The key of the clause to add
     */
    addFilter(pEvent: Event, pRecordSet: string, pViewContext: string, pFilterKey: string, pClauseKey: string): void;
    /**
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     * @param {string} pSpecificFilterKey - The key of the specific filter to remove
     */
    removeFilter(pEvent: Event, pRecordSet: string, pViewContext: string, pSpecificFilterKey: string): void;
    /**
     * Gets the filter schema for the given record set.
     * @param {string} pRecordSet - The record set to get the filter schema for
     * @return {Array<any>} - The filter schema for the given record set
     */
    getFilterSchema(pRecordSet: string): Array<any>;
    /**
     * Encodes the filter experience to a string.
     * @param {Record<string, any>} pExperience - The filter experience to serialize.
     * @return {Promise<string>} - The serialized filter experience as a string.
     */
    serializeFilterExperience(pExperience: Record<string, any>): Promise<string>;
    /**
     * Decodes the filter experience from a string.
     * @param {string} pExperience - The serialized filter experience as a string.
     * @return {Promise<Record<string, any>>} - The serialized filter experience as a string.
     */
    deserializeFilterExperience(pExperience: string): Promise<Record<string, any>>;
    /**
     * @param {string} string - The string to compress.
     * @param {CompressionFormat} [encoding='gzip'] - The encoding to use for compression, defaults to 'gzip'.
     * @return {Promise<ArrayBuffer>} - The compressed byte array.
     */
    compress(string: string, encoding?: CompressionFormat): Promise<ArrayBuffer>;
    /**
     * @param {Uint8Array} byteArray - The byte array to decompress.
     * @param {CompressionFormat} [encoding='gzip'] - The encoding to use for compression, defaults to 'gzip'.
     */
    decompress(byteArray: Uint8Array, encoding?: CompressionFormat): Promise<string>;
    /**
     * @param {ArrayBuffer} arraybuffer - The ArrayBuffer to encode to Base64.
     * @return {string} - The Base64 encoded string.
     */
    encode(arraybuffer: ArrayBuffer): string;
    /**
     * @param {string} base64 - The Base64 encoded string to decode to an ArrayBuffer.
     * @return {ArrayBuffer} - The decoded ArrayBuffer.
     */
    decode(base64: string): ArrayBuffer;
}
declare namespace ViewRecordSetSUBSETFilters {
    export { FilterIconOutline, FilterIconFilled, _DEFAULT_CONFIGURATION_SUBSET_Filter as default_configuration };
}
import libPictView = require("pict-view");
declare var FilterIconOutline: string;
declare var FilterIconFilled: string;
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION_SUBSET_Filter: Record<string, any>;
//# sourceMappingURL=RecordSet-Filters.d.ts.map