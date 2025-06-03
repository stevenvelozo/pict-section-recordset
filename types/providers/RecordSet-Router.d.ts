export = PictRecordSetRouter;
declare class PictRecordSetRouter {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {Record<string, any>} */
    options: Record<string, any>;
    /** @type {import('pict') & { PictSectionRecordSet: InstanceType<import('../Pict-Section-RecordSet.js')> }} */
    pict: import("pict") & {
        PictSectionRecordSet: InstanceType<{
            new (pFable: any, pOptions: any, pServiceHash: any): import("../services/RecordsSet-MetaController.js");
            default_configuration: Record<string, any>;
            PictRecordSetApplication: typeof import("../application/Pict-Application-RecordSet.js");
            RecordSetProviderBase: typeof import("./RecordSet-RecordProvider-Base.js");
            RecordSetProviderMeadowEndpoints: typeof import("./RecordSet-RecordProvider-MeadowEndpoints.js");
        }>;
    };
    pictRouter: any;
    onInitialize(): any;
    addRoutes(pRouter: any): void;
    /**
     * Navigate to a given route (set the browser URL string, add to history, trigger router)
     *
     * @param {string} pRoute - The route to navigate to
     */
    navigate(pRoute: string): void;
}
declare namespace PictRecordSetRouter {
    export { _DEFAULT_PROVIDER_CONFIGURATION as default_configuration };
}
/** @type {Record<string, any>} */
declare const _DEFAULT_PROVIDER_CONFIGURATION: Record<string, any>;
//# sourceMappingURL=RecordSet-Router.d.ts.map