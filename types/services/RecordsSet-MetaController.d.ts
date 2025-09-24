export = RecordSetMetacontroller;
declare class RecordSetMetacontroller {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('pict') & { PictSectionRecordSet: any, addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any, newManyfest: (rec: any) => any }} */
    fable: import("pict") & {
        PictSectionRecordSet: any;
        addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any;
        newManyfest: (rec: any) => any;
    };
    pict: import("pict") & {
        PictSectionRecordSet: any;
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
    manifests: Record<string, import("manyfest")>;
    has_initialized: boolean;
    /**
     * @param {string} pRecordSet - The RecordSet name to get the configuration for.
     *
     * @return {Record<string, any>} - The registered configuration for the RecordSet
     */
    getRecordSetConfiguration(pRecordSet: string): Record<string, any>;
    /**
     * @param {Record<string, any>} pRecordSetConfiguration - The RecordSet configuration to load.
     */
    loadRecordSetConfiguration(pRecordSetConfiguration: Record<string, any>): boolean;
    /**
     * @param {Array<Record<string, any>>} pRecordSetConfigurationArray - An array of RecordSet configurations to load.
     */
    loadRecordSetConfigurationArray(pRecordSetConfigurationArray: Array<Record<string, any>>): boolean;
    /**
     * @param {Record<string, any> | string} pRecordSet - The RecordSet configuration or hash to load dynamically.
     * @param {string} [pEntity] - (optional) The Entity type to use (defaults to the RecordSet name if not provided).
     * @param {string} [pDefaultFilter] - (optional) The default filter to use.
     */
    loadRecordSetDynamically(pRecordSet: Record<string, any> | string, pEntity?: string, pDefaultFilter?: string): any;
    /**
     * @param {Record<string, any>} pRoutePayload - The route payload containing the RecordSet and optional Entity and DefaultFilter.
     */
    handleLoadDynamicRecordSetRoute(pRoutePayload: Record<string, any>): any;
    /**
     * @param {import('pict-router')} pPictRouter - The Pict Router to add the routes to.
     */
    addRoutes(pPictRouter: any): boolean;
    /**
     * @param {string} pCapability - The capability to check for.
     */
    checkSession(pCapability: string): Promise<boolean>;
    /**
     * @param {string} pNameTemplate - The name template for the record link.
     * @param {string} pURLTemplate - The URL template for the record link.
     * @param {boolean} pDefault - Whether this is a default link template.
     *
     * @return {Record<string, any>} - The link template object that was added.
     */
    addRecordLinkTemplate(pNameTemplate: string, pURLTemplate: string, pDefault: boolean): Record<string, any>;
    initialize(): true | this;
    getManifest(pScope: any): import("manyfest");
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