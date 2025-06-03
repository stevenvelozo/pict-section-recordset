export = PictRecordSetRouter;
declare class PictRecordSetRouter {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {Record<string, any>} */
    options: Record<string, any>;
    /** @type {import('pict')} */
    pict: import("pict");
    linkTemplates: any[];
    addRecordLinkTemplate(pNameTemplate: any, pURLTemplate: any, pDefault: any): {
        Name: any;
        URL: any;
        Default: any;
    };
}
declare namespace PictRecordSetRouter {
    export { _DEFAULT_PROVIDER_CONFIGURATION as default_configuration };
}
/** @type {Record<string, any>} */
declare const _DEFAULT_PROVIDER_CONFIGURATION: Record<string, any>;
//# sourceMappingURL=RecordSet-Link-Manager.d.ts.map