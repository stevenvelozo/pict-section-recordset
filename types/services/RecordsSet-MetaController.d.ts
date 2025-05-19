export = RecordSetMetacontroller;
declare class RecordSetMetacontroller {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('pict') & { addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any }} */
    fable: import("pict") & {
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
    recordSetListConfigurations: {};
    has_initialized: boolean;
    loadRecordSetConfiguration(pRecordSetConfiguration: any): boolean;
    loadRecordSetConfigurationArray(pRecordSetConfigurationArray: any): boolean;
    loadRecordSetDynamcally(pRecordSet: any, pEntity: any, pDefaultFilter: any): any;
    handleLoadDynamicRecordSetRoute(pRoutePayload: any): any;
    addRoutes(pPictRouter: any): boolean;
    addRecordLinkTemplate(pNameTemplate: any, pURLTemplate: any, pDefault: any): any;
    initialize(): true | this;
}
declare namespace RecordSetMetacontroller {
    export { _DEFAULT_CONFIGURATION as default_configuration };
}
declare namespace _DEFAULT_CONFIGURATION {
    let DefaultMeadowURLPrefix: string;
}
//# sourceMappingURL=RecordsSet-MetaController.d.ts.map