export = MeadowEndpointsRecordSetProvider;
/**
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetFilter} RecordSetFilter
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetResult} RecordSetResult
 */
/**
 * Class representing a data change detection provider for Pict dynamic forms.
 * @extends libRecordSetProviderBase
 */
declare class MeadowEndpointsRecordSetProvider extends libRecordSetProviderBase {
    /** @type {import('pict') & {
     *      log: any,
     *      services:
     *      {
     *			PictSectionRecordSet: InstanceType<import('../Pict-Section-RecordSet.js')>,
     *			[key: string]: any,
     *		},
     *      instantiateServiceProviderWithoutRegistration: (hash: String) => any,
     *      PictSectionRecordSet: InstanceType<import('../Pict-Section-RecordSet.js')>
     *  }} */
    pict: import("pict") & {
        log: any;
        services: {
            PictSectionRecordSet: InstanceType<{
                new (pFable: any, pOptions: any, pServiceHash: any): import("../services/RecordsSet-MetaController.js");
                default_configuration: Record<string, any>;
                PictRecordSetApplication: typeof import("../application/Pict-Application-RecordSet.js");
                RecordSetProviderBase: typeof libRecordSetProviderBase;
                RecordSetProviderMeadowEndpoints: typeof MeadowEndpointsRecordSetProvider;
            }>;
            [key: string]: any;
        };
        instantiateServiceProviderWithoutRegistration: (hash: string) => any;
        PictSectionRecordSet: InstanceType<{
            new (pFable: any, pOptions: any, pServiceHash: any): import("../services/RecordsSet-MetaController.js");
            default_configuration: Record<string, any>;
            PictRecordSetApplication: typeof import("../application/Pict-Application-RecordSet.js");
            RecordSetProviderBase: typeof libRecordSetProviderBase;
            RecordSetProviderMeadowEndpoints: typeof MeadowEndpointsRecordSetProvider;
        }>;
    };
    fable: import("pict") & {
        log: any;
        services: {
            PictSectionRecordSet: InstanceType<{
                new (pFable: any, pOptions: any, pServiceHash: any): import("../services/RecordsSet-MetaController.js");
                default_configuration: Record<string, any>;
                PictRecordSetApplication: typeof import("../application/Pict-Application-RecordSet.js");
                RecordSetProviderBase: typeof libRecordSetProviderBase;
                RecordSetProviderMeadowEndpoints: typeof MeadowEndpointsRecordSetProvider;
            }>;
            [key: string]: any;
        };
        instantiateServiceProviderWithoutRegistration: (hash: string) => any;
        PictSectionRecordSet: InstanceType<{
            new (pFable: any, pOptions: any, pServiceHash: any): import("../services/RecordsSet-MetaController.js");
            default_configuration: Record<string, any>;
            PictRecordSetApplication: typeof import("../application/Pict-Application-RecordSet.js");
            RecordSetProviderBase: typeof libRecordSetProviderBase;
            RecordSetProviderMeadowEndpoints: typeof MeadowEndpointsRecordSetProvider;
        }>;
    };
    /** @type {Record<string, any>} */
    _Schema: Record<string, any>;
    /** @return {import('pict/types/source/Pict-Meadow-EntityProvider.js')} */
    get entityProvider(): import("pict/types/source/Pict-Meadow-EntityProvider.js");
    /** @type {import('pict/types/source/Pict-Meadow-EntityProvider.js')} */
    _EntityProvider: import("pict/types/source/Pict-Meadow-EntityProvider.js");
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
    _prepareFilterState(pEntity: any, pOptions: any, pFilterExperienceResultAddress?: string): any[];
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
    /**
     * @param {(error?: Error) => void} fCallback - The callback function.
     */
    initializeEntitySchema(fCallback: (error?: Error) => void): void;
    getRecordSchema(): Promise<Record<string, any>>;
}
declare namespace MeadowEndpointsRecordSetProvider {
    export { RecordSetFilter, RecordSetResult };
}
import libRecordSetProviderBase = require("./RecordSet-RecordProvider-Base.js");
type RecordSetFilter = import("./RecordSet-RecordProvider-Base.js").RecordSetFilter;
type RecordSetResult = import("./RecordSet-RecordProvider-Base.js").RecordSetResult;
//# sourceMappingURL=RecordSet-RecordProvider-MeadowEndpoints.d.ts.map