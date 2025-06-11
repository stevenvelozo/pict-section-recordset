export = PictRecordSetRouter;
declare class PictRecordSetRouter extends libPictProvider {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
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
import libPictProvider = require("pict-provider");
/** @type {Record<string, any>} */
declare const _DEFAULT_PROVIDER_CONFIGURATION: Record<string, any>;
//# sourceMappingURL=RecordSet-Link-Manager.d.ts.map