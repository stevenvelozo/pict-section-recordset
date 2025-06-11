export = RecordSetMetacontroller;
declare class RecordSetMetacontroller {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('pict') & { addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any, newManyfest: (rec: any) => any }} */
    fable: import("pict") & {
        addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any;
        newManyfest: (rec: any) => any;
    };
    pict: import("pict") & {
        addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any;
        newManyfest: (rec: any) => any;
    };
    /** @type {any} */
    log: any;
    /** @type {any} */
    options: any;
    /** @type {string} */
    UUID: string;
    childViews: {
        list: any;
        edit: any;
        read: any;
        dashboard: any;
    };
    /** @type {Record<string, import('pict-provider')>} */
    recordSetProviders: Record<string, import("pict-provider")>;
    /** @type {Record<string, Record<string, any>>} */
    recordSetProviderConfigurations: Record<string, Record<string, any>>;
    /** @type {Record<string, Record<string, any>>} */
    dashboardConfigurations: Record<string, Record<string, any>>;
    /** @type {Array<(pCapability: string) => Promise<boolean>>} */
    sessionProviders: Array<(pCapability: string) => Promise<boolean>>;
    /** @type {Record<string, Record<string, any>>} */
    manifestDefinitions: Record<string, Record<string, any>>;
    /** @type {Record<string, import('manyfest')>} */
    manifests: Record<string, any>;
    has_initialized: boolean;
    /**
     * @return {Record<string, any>} - The registered configuration for the RecordSet
     */
    getRecordSetConfiguration(pRecordSet: any): Record<string, any>;
    loadRecordSetConfiguration(pRecordSetConfiguration: any): boolean;
    loadRecordSetConfigurationArray(pRecordSetConfigurationArray: any): boolean;
    loadRecordSetDynamically(pRecordSet: any, pEntity: any, pDefaultFilter: any): any;
    handleLoadDynamicRecordSetRoute(pRoutePayload: any): any;
    addRoutes(pPictRouter: any): boolean;
    checkSession(pCapability: any): Promise<boolean>;
    addRecordLinkTemplate(pNameTemplate: any, pURLTemplate: any, pDefault: any): any;
    initialize(): true | this;
    getManifest(pScope: any): any;
    /**
     * @param {Record<string, any>} pManifest - The manifest to generate table cells for.
     */
    generateManifestTableCells(pManifest: Record<string, any>): void;
}
declare namespace RecordSetMetacontroller {
    export { _DEFAULT_CONFIGURATION as default_configuration };
}
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION: Record<string, any>;
//# sourceMappingURL=RecordsSet-MetaController.d.ts.map