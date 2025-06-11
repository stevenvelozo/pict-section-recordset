export = RecordSetProviderBase;
/**
 * @typedef {Object} RecordSetSearchRangeFacet
 * @property {string} Field - The field to facet on. Only indexed fields can be faceted.
 * @property {any} Start - The start of the range. (ex. 1900)
 * @property {any} End - The end of the range. (ex. 2025)
 * @property {any} Gap - The gap between range values. (ex. 25)
 * TODO: Support auto-generating ranges based on the data at rest?
 */
/**
 * @typedef {Object} RecordSetSearchFacetPayload
 * @property {boolean} [ReturnRecords] - If false, search will return facets only, not records.
 * @property {Array<string>} Fields - Requests to facet on all unique values of the given fields.
 * @property {Array<RecordSetSearchRangeFacet>} Ranges - Requests to facet on given ranges of field values.
 * TODO: support facet on custom query?
 */
/**
 * @typedef {Object} RecordSetResult
 * @property {Array<Record<string, any>>} Records - The records returned from the provider.
 * @property {Record<string, Record<string, number>> & { ByRange?: Record<string, number> }} Facets - The facets returned from the provider.
 */
/**
 * @typedef {Object} RecordSetFilter
 * @property {string} [Entity] - The entity name. Can be used as an override to achieve LiteExtended, etc.
 * @property {string} [FilterString] - A meadow endpoint style filter to apply.
 * @property {number} [Offset] - The starting record number for pagination.
 * @property {number} [PageSize] - The starting record number for pagination.
 * @property {RecordSetSearchFacetPayload} [Facets] - The faceting config for the search.
 */
/**
 * Base record set provider.
 * @extends libPictProvider
 */
declare class RecordSetProviderBase extends libPictProvider {
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
     * @return {Promise<RecordSetResult>} - The result of the read operation.
     */
    getRecords(pOptions: RecordSetFilter): Promise<RecordSetResult>;
    /**
     * Read records from the provider.
     *
     * @param {RecordSetFilter} pOptions - Options for the read operation.
     *
     * @return {Promise<RecordSetResult>} - The result of the read operation.
     */
    getDecoratedRecords(pOptions: RecordSetFilter): Promise<RecordSetResult>;
    /**
     * Read records from the provider.
     *
     * @param {string} [pFilterString] - The filter string to apply.
     * @param {number} [pOffset] - The starting record number for pagination.
     * @param {number} [pPageSize] - The number of records to return.
     * @return {Promise<RecordSetResult>} - The result of the read operation.
     */
    getRecordsInline(pFilterString?: string, pOffset?: number, pPageSize?: number): Promise<RecordSetResult>;
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
     * @return {Promise<Record<string, any>>} - The created record.
     */
    createRecord(pRecord: Record<string, any>): Promise<Record<string, any>>;
    /**
     * Update a record.
     *
     * @param {Record<string, any>} pRecord - The record to update.
     * @return {Promise<Record<string, any>>} - The updated record.
     */
    updateRecord(pRecord: Record<string, any>): Promise<Record<string, any>>;
    /**
     * Delete a record.
     *
     * @param {Record<string, any>} pRecord - The record to delete.
     * @return {Promise<void>}
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
     * @return {Promise<RecordSetResult>} - The result of the read operation.
     */
    readRecords(pOptions: RecordSetFilter): Promise<RecordSetResult>;
    /**
     * Clone a record.
     *
     * @param {Record<string, any>} pRecord - The record to clone.
     * @return {Promise<Record<string, any>>} - The cloned record.
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
    /**
     * Abstract decoration method for core records. Subclasses should implement this method to decorate records with additional information.
     *
     * @param {Array<Record<string, any>>} pRecords - The records to decorate.
     * @return {Promise<void>}
     */
    decorateCoreRecords(pRecords: Array<Record<string, any>>): Promise<void>;
}
declare namespace RecordSetProviderBase {
    export { _DefaultProviderConfiguration as default_configuration, RecordSetSearchRangeFacet, RecordSetSearchFacetPayload, RecordSetResult, RecordSetFilter };
}
import libPictProvider = require("pict-provider");
/**
 * Default configuration for the RecordSetProvider provider.
 * @type {Record<string, any>}
 */
declare const _DefaultProviderConfiguration: Record<string, any>;
type RecordSetSearchRangeFacet = {
    /**
     * - The field to facet on. Only indexed fields can be faceted.
     */
    Field: string;
    /**
     * - The start of the range. (ex. 1900)
     */
    Start: any;
    /**
     * - The end of the range. (ex. 2025)
     */
    End: any;
    /**
     * - The gap between range values. (ex. 25)
     * TODO: Support auto-generating ranges based on the data at rest?
     */
    Gap: any;
};
type RecordSetSearchFacetPayload = {
    /**
     * - If false, search will return facets only, not records.
     */
    ReturnRecords?: boolean;
    /**
     * - Requests to facet on all unique values of the given fields.
     */
    Fields: Array<string>;
    /**
     * - Requests to facet on given ranges of field values.
     * TODO: support facet on custom query?
     */
    Ranges: Array<RecordSetSearchRangeFacet>;
};
type RecordSetResult = {
    /**
     * - The records returned from the provider.
     */
    Records: Array<Record<string, any>>;
    /**
     * - The facets returned from the provider.
     */
    Facets: Record<string, Record<string, number>> & {
        ByRange?: Record<string, number>;
    };
};
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
     * - The faceting config for the search.
     */
    Facets?: RecordSetSearchFacetPayload;
};
//# sourceMappingURL=RecordSet-RecordProvider-Base.d.ts.map