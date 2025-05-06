export = RecordSetProviderBase;
/**
 * @typedef {Object} RecordSetFilter
 * @property {string} [Entity] - The entity name. Can be used as an override to achieve LiteExtended, etc.
 * @property {string} [FilterString] - A meadow endpoint style filter to apply.
 * @property {number} [Offset] - The starting record number for pagination.
 * @property {number} [PageSize] - The starting record number for pagination.
 * @property {string} [Operation] - The operation to perform (e.g., 'Count').
 */
/**
 * Base record set provider.
 * @extends libPictProvider
 */
declare class RecordSetProviderBase {
    /**
     * Creates an instance of RecordSetProvider.
     * @param {import('fable')} pFable - The Fable object.
     * @param {Record<string, any>} [pOptions] - Custom options for the provider.
     * @param {string} [pServiceHash] - The service hash.
     */
    constructor(pFable: any, pOptions?: Record<string, any>, pServiceHash?: string);
    /** @type {Record<string, any>} */
    options: Record<string, any>;
    /** @type {import('fable')} */
    fable: any;
    /** @type {import('pict')} */
    pict: import("pict");
    /**
     * Get a record by its ID or GUID.
     *
     * @param {string|number} pIDOrGuid - The ID or GUID of the record.
     */
    getRecord(pIDOrGuid: string | number): Promise<{}>;
    /**
     * Get a record by its ID or GUID.
     *
     * @param {string|number} pGuid - The ID or GUID of the record.
     */
    getRecordByGUID(pGuid: string | number): Promise<{}>;
    /**
     * Read records from the provider.
     *
     * @param {RecordSetFilter} pOptions - Options for the read operation.
     */
    getRecords(pOptions: RecordSetFilter): Promise<any[]>;
    /**
     * Read records from the provider.
     *
     * @param {RecordSetFilter} pOptions - Options for the read operation.
     */
    getRecordSetCount(pOptions: RecordSetFilter): Promise<{
        Count: number;
    }>;
    /**
     * Create a new record.
     *
     * @param {Record<string, any>} pRecord - The record to create.
     */
    createRecord(pRecord: Record<string, any>): Promise<Record<string, any>>;
    /**
     * Update a record.
     *
     * @param {Record<string, any>} pRecord - The record to update.
     */
    updateRecord(pRecord: Record<string, any>): Promise<Record<string, any>>;
    /**
     * Delete a record.
     *
     * @param {Record<string, any>} pRecord - The record to delete.
     */
    deleteRecord(pRecord: Record<string, any>): Promise<void>;
    /**
     * Read a record.
     *
     * @param {string|number} pIDOrGuid - The ID or GUID of the record.
     */
    readRecord(pIDOrGuid: string | number): Promise<{}>;
    /**
     * Read records from the provider.
     *
     * @param {RecordSetFilter} pOptions - Options for the read operation.
     */
    readRecords(pOptions: RecordSetFilter): Promise<any[]>;
    /**
     * Clone a record.
     *
     * @param {Record<string, any>} pRecord - The record to clone.
     */
    cloneRecord(pRecord: Record<string, any>): Promise<Record<string, any>>;
    /**
     * Remove any intrinsic identifiers from a record.
     *
     * @param {Record<string, any>} pRecord - The record to clean.
     */
    cleanRecord(pRecord: Record<string, any>): Record<string, any>;
    /**
     * @return {Record<string, any>} The schema of the record.
     */
    get recordSchema(): Record<string, any>;
}
declare namespace RecordSetProviderBase {
    export { _DefaultProviderConfiguration as default_configuration, RecordSetFilter };
}
/**
 * Default configuration for the RecordSetProvider provider.
 * @type {Record<string, any>}
 */
declare const _DefaultProviderConfiguration: Record<string, any>;
type RecordSetFilter = {
    /**
     * - The entity name. Can be used as an override to achieve LiteExtended, etc.
     */
    Entity?: string;
    /**
     * - A meadow endpoint style filter to apply.
     */
    FilterString?: string;
    /**
     * - The starting record number for pagination.
     */
    Offset?: number;
    /**
     * - The starting record number for pagination.
     */
    PageSize?: number;
    /**
     * - The operation to perform (e.g., 'Count').
     */
    Operation?: string;
};
//# sourceMappingURL=RecordSet-RecordProvider-Base.d.ts.map