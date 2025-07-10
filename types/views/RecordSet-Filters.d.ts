export = ViewRecordSetSUBSETFilters;
declare class ViewRecordSetSUBSETFilters extends libPictView {
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
     * Marshals data from the view to the model, usually AppData (or configured data store).
     *
     * @returns {any} The result of the superclass's onMarshalFromView method.
     */
    onMarshalFromView(): any;
    /**
     * Marshals the data to the view from the model, usually AppData (or configured data store).
     *
     * @returns {any} The result of the super.onMarshalToView() method.
     */
    onMarshalToView(): any;
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
    serializeFilterExperience(pExperience: any): string;
    deserializeFilterExperience(pExperience: any): any;
}
declare namespace ViewRecordSetSUBSETFilters {
    export { _DEFAULT_CONFIGURATION_SUBSET_Filter as default_configuration };
}
import libPictView = require("pict-view");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION_SUBSET_Filter: Record<string, any>;
//# sourceMappingURL=RecordSet-Filters.d.ts.map