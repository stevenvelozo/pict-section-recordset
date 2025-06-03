export = RecordSetMetacontroller;
declare class RecordSetMetacontroller {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('pict') & { addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any }} */
    fable: import("pict") & {
        addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any;
    };
    pict: import("pict") & {
        addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any;
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
    recordSetProviders: {};
    recordSetProviderConfigurations: {};
    dashboardConfigurations: {};
    sessionProviders: any[];
    has_initialized: boolean;
    /**
     * @return {Record<string, any>} - The registered configuration for the RecordSet
     */
    getRecordSetConfiguration(pRecordSet: any): Record<string, any>;
    loadRecordSetConfiguration(pRecordSetConfiguration: any): boolean;
    loadRecordSetConfigurationArray(pRecordSetConfigurationArray: any): boolean;
    /**
     * @param {Array<Record<string, any>>} pDashboardConfigurationArray - An array of dashboard configurations.
     */
    loadDashboardConfigurationArray(pDashboardConfigurationArray: Array<Record<string, any>>): boolean;
    /**
     * TODO: This method is still incomplete.
     *
     * @param {Record<string, any>} pDashboardConfiguration - The dashboard configuration to add.
     */
    addDashboardConfiguration(pDashboardConfiguration: Record<string, any>): boolean;
    loadRecordSetDynamcally(pRecordSet: any, pEntity: any, pDefaultFilter: any): any;
    handleLoadDynamicRecordSetRoute(pRoutePayload: any): any;
    addRoutes(pPictRouter: any): boolean;
    checkSession(pCapability: any): Promise<boolean>;
    addRecordLinkTemplate(pNameTemplate: any, pURLTemplate: any, pDefault: any): any;
    initialize(): true | this;
}
declare namespace RecordSetMetacontroller {
    export { _DEFAULT_CONFIGURATION as default_configuration };
}
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION: Record<string, any>;
//# sourceMappingURL=RecordsSet-MetaController.d.ts.map