export = viewRecordSetSUBSETFilter;
declare class viewRecordSetSUBSETFilter extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('fable') & import('pict') & { PictSectionRecordSet: import('../Pict-Section-RecordSet.js') }} */
    pict: any & import("pict") & {
        PictSectionRecordSet: {
            new (pFable: any, pOptions: any, pServiceHash: any): import("../services/RecordsSet-MetaController.js");
            default_configuration: Record<string, any>;
            PictRecordSetApplication: typeof import("../application/Pict-Application-RecordSet.js");
            RecordSetProviderBase: typeof import("../providers/RecordSet-RecordProvider-Base.js");
            RecordSetProviderMeadowEndpoints: typeof import("../providers/RecordSet-RecordProvider-MeadowEndpoints.js");
        };
    };
    /**
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     */
    handleSearch(pEvent: Event, pRecordSet: string, pViewContext: string): void;
    /**
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     * @param {string} [pFilterString] - The filter string to apply, defaults to a single space if not provided
     */
    performSearch(pRecordSet: string, pViewContext: string, pFilterString?: string): void;
    /**
     * @param {Event} pEvent - The DOM event that triggered the search
     * @param {string} pRecordSet - The record set being filtered
     * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
     */
    handleReset(pEvent: Event, pRecordSet: string, pViewContext: string): void;
}
declare namespace viewRecordSetSUBSETFilter {
    export { _DEFAULT_CONFIGURATION_SUBSET_Filter as default_configuration };
}
import libPictView = require("pict-view");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION_SUBSET_Filter: Record<string, any>;
//# sourceMappingURL=RecordSet-Filter.d.ts.map