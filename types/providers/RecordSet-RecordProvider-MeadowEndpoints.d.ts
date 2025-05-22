export = RecordSetProvider;
/**
 * @typedef {(error?: Error, result?: any) => void} RestClientCallback
 *
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetFilter} RecordSetFilter
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetResult} RecordSetResult
 *
 * @typedef {{
 *  getJSON(pOptionsOrURL: string | Record<string, any>, fCallback: RestClientCallback): void,
 *  putJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  postJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  patchJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  headJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  delJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  getRawText(pOptionsOrURL: string | Record<string, any>, fCallback: RestClientCallback): void,
 * }} RestClient
 */
/**
 * Class representing a data change detection provider for Pict dynamic forms.
 * @extends libRecordSetProviderBase
 */
declare class RecordSetProvider extends libRecordSetProviderBase {
    /** @type {import('fable') & import('pict')} */
    pict: any & import("pict");
    /** @type {Record<string, any>} */
    _Schema: Record<string, any>;
    /** @type {RestClient} */
    get restClient(): RestClient;
    /**
     * @typedef {(error?: Error, result?: T) => void} RecordSetCallback
     * @template T = Record<string, any>
     */
    /**
     * Get a record by its ID or GUID.
     *
     * @param {string|number} pIDOrGuid - The ID or GUID of the record.
     */
    getRecord(pIDOrGuid: string | number): Promise<any>;
    /**
     * Get a record by its ID or GUID.
     *
     * @param {string|number} pGuid - The ID or GUID of the record.
     */
    getRecordByGUID(pGuid: string | number): Promise<any>;
    /**
     * Read records from the provider.
     *
     * @param {RecordSetFilter} pOptions - Options for the read operation.
     */
    getRecordSetCount(pOptions: RecordSetFilter): Promise<any>;
    /**
     * Create a new record.
     *
     * @param {Record<string, any>} pRecord - The record to create.
     */
    createRecord(pRecord: Record<string, any>): Promise<any>;
    /**
     * Update a record.
     *
     * @param {Record<string, any>} pRecord - The record to update.
     */
    updateRecord(pRecord: Record<string, any>): Promise<any>;
    /**
     * Delete a record.
     *
     * @param {Record<string, any>} pRecord - The record to delete.
     */
    deleteRecord(pRecord: Record<string, any>): Promise<any>;
    /**
     * Read a record.
     *
     * @param {string|number} pIDOrGuid - The ID or GUID of the record.
     */
    readRecord(pIDOrGuid: string | number): Promise<any>;
    /**
     * Clone a record.
     *
     * @param {Record<string, any>} pRecord - The record to clone.
     */
    cloneRecord(pRecord: Record<string, any>): Promise<any>;
    /**
     * @param {(error?: Error) => void} fCallback - The callback function.
     */
    onInitializeAsync(fCallback: (error?: Error) => void): void;
    getRecordSchema(): Promise<Record<string, any>>;
}
declare namespace RecordSetProvider {
    export { RestClientCallback, RecordSetFilter, RecordSetResult, RestClient };
}
import libRecordSetProviderBase = require("./RecordSet-RecordProvider-Base.js");
type RestClientCallback = (error?: Error, result?: any) => void;
type RecordSetFilter = import("./RecordSet-RecordProvider-Base.js").RecordSetFilter;
type RecordSetResult = import("./RecordSet-RecordProvider-Base.js").RecordSetResult;
type RestClient = {
    getJSON(pOptionsOrURL: string | Record<string, any>, fCallback: RestClientCallback): void;
    putJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void;
    postJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void;
    patchJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void;
    headJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void;
    delJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void;
    getRawText(pOptionsOrURL: string | Record<string, any>, fCallback: RestClientCallback): void;
};
//# sourceMappingURL=RecordSet-RecordProvider-MeadowEndpoints.d.ts.map