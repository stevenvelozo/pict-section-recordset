export = ViewRecordSetSUBSETFilterBase;
declare class ViewRecordSetSUBSETFilterBase extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, PictSectionRecordSet: import('../../Pict-Section-RecordSet.js') }} */
    pict: import("pict") & {
        log: any;
        instantiateServiceProviderWithoutRegistration: (hash: string) => any;
        PictSectionRecordSet: {
            new (pFable: any, pOptions: any, pServiceHash: any): import("../../services/RecordsSet-MetaController.js");
            default_configuration: Record<string, any>;
            PictRecordSetApplication: typeof import("../../application/Pict-Application-RecordSet.js");
            RecordSetProviderBase: typeof import("../../providers/RecordSet-RecordProvider-Base.js");
            RecordSetProviderMeadowEndpoints: typeof import("../../providers/RecordSet-RecordProvider-MeadowEndpoints.js");
        };
    };
    /**
     * Hook to prepare state on the render record before rendering.
     *
     * @param {Record<string, any>} pRecord - The record used for view rendering.
     */
    prepareRecord(pRecord: Record<string, any>): void;
    getFilterFormTemplate(): string;
}
declare namespace ViewRecordSetSUBSETFilterBase {
    export { _DEFAULT_CONFIGURATION_SUBSET_Filter as default_configuration };
}
import libPictView = require("pict-view");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION_SUBSET_Filter: Record<string, any>;
//# sourceMappingURL=RecordSet-Filter-Base.d.ts.map