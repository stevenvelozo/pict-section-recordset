export = RecordSetProvider;
/**
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetFilter} RecordSetFilter
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetResult} RecordSetResult
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
    onBeforeInitialize(): void;
    /** @type {import('pict/types/source/Pict-Meadow-EntityProvider.js')} */
    entityProvider: import("pict/types/source/Pict-Meadow-EntityProvider.js");
    /**
     * @param {(error?: Error) => void} fCallback - The callback function.
     */
    onInitializeAsync(fCallback: (error?: Error) => void): void;
    getRecordSchema(): Promise<Record<string, any>>;
}
declare namespace RecordSetProvider {
    export { RecordSetFilter, RecordSetResult };
}
import libRecordSetProviderBase = require("./RecordSet-RecordProvider-Base.js");
type RecordSetFilter = import("./RecordSet-RecordProvider-Base.js").RecordSetFilter;
type RecordSetResult = import("./RecordSet-RecordProvider-Base.js").RecordSetResult;
//# sourceMappingURL=RecordSet-RecordProvider-MeadowEndpoints.d.ts.map