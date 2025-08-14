export = ViewRecordSetSUBSETFilters;
declare class ViewRecordSetSUBSETFilters extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('fable') & import('pict') & { PictSectionRecordSet: import('../Pict-Section-RecordSet.js') }} */
    pict: any & import("pict") & {
        PictSectionRecordSet: {
            new (pFable: any, pOptions: any, pServiceHash: any): import("../services/RecordsSet-MetaController.js");
            default_configuration: Record<string, any>;
            PictRecordSetApplication: typeof import("../application/Pict-Application-RecordSet.js");
            RecordSetProviderBase: typeof import("../providers/RecordSet-RecordProvider-Base.js");
            RecordSetProviderMeadowEndpoints: typeof import("../providers/RecordSet-RecordProvider-MeadowEndpoints.js");
        };
    };
    chars: string;
    lookup: any[] | Uint8Array<ArrayBuffer>;
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
     *
     * @returns {any} The result of the superclass's onMarshalFromView method.
     */
    onMarshalFromView(): any;
    /**
     * Marshals the data to the view from the model, usually AppData (or configured data store).
     *
     * @returns {any} The result of the super.onMarshalToView() method.
     */
    onMarshalToView(): any;
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
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     */
    handleReset(pEvent: Event, pRecordSet: string, pViewContext: string): void;
    /**
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     */
    selectFilterToAdd(pEvent: Event, pRecordSet: string, pViewContext: string): void;
    addFilter(pEvent: any, pRecordSet: any, pViewContext: any, pFilterKey: any, pClauseKey: any): void;
    removeFilter(pEvent: any, pRecordSet: any, pViewContext: any, pSpecificFilterKey: any): void;
    getFilterSchema(pRecordSet: any): any[];
    serializeFilterExperience(pExperience: any): Promise<string>;
    /**
     * @param {string} pExperience - The serialized filter experience as a string.
     *
     * @return {Promise<Record<string, any>>} - The serialized filter experience as a string.
     */
    deserializeFilterExperience(pExperience: string): Promise<Record<string, any>>;
    /**
     * @param {string} string - The string to compress.
     * @param {CompressionFormat} [encoding='gzip'] - The encoding to use for compression, defaults to 'gzip'.
     *
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
     *
     * @return {string} - The Base64 encoded string.
     */
    encode(arraybuffer: ArrayBuffer): string;
    /**
     * @param {string} base64 - The Base64 encoded string to decode to an ArrayBuffer.
     *
     * @return {ArrayBuffer} - The decoded ArrayBuffer.
     */
    decode(base64: string): ArrayBuffer;
}
declare namespace ViewRecordSetSUBSETFilters {
    export { _DEFAULT_CONFIGURATION_SUBSET_Filter as default_configuration };
}
import libPictView = require("pict-view");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION_SUBSET_Filter: Record<string, any>;
//# sourceMappingURL=RecordSet-Filters.d.ts.map