export = ViewRecordSetSUBSETFilterBase;
declare class ViewRecordSetSUBSETFilterBase extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /**
     * Hook to prepare state on the render record before rendering.
     *
     * @param {Record<string, any>} pRecord - The record used for view rendering.
     */
    prepareRecord(pRecord: Record<string, any>): void;
    getFilterFormTemplate(): string;
    /**
     * Remove this filter clause from its record set and re-render the filter control.
     *
     * Lives on the base view so every filter type inherits a single, themeable remove
     * affordance and no host application has to re-implement one. Delegates to the
     * consolidated control view (the canonical re-render path) and falls back to the
     * record-set provider directly if that view is somehow unavailable.
     *
     * @param {Event} pEvent - The DOM event that triggered the removal.
     * @param {string} pRecordSet - The record set being filtered.
     * @param {string} pViewContext - The view context for the filter (e.g. List, Dashboard).
     * @param {string} pHash - The hash of the specific filter clause to remove.
     */
    removeClause(pEvent: Event, pRecordSet: string, pViewContext: string, pHash: string): any;
    /**
     * @return {string} - The prefix for the informary address.
     */
    getInformaryAddressPrefix(): string;
    /**
     * @param {string} pInformaryAddress - The address of the informary to get the value from.
     *
     * @return {any} - The value at the informary address.
     */
    getInformaryScopedValue(pInformaryAddress: string): any;
}
declare namespace ViewRecordSetSUBSETFilterBase {
    export { _DEFAULT_CONFIGURATION_SUBSET_Filter as default_configuration };
}
import libPictView = require("pict-view");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION_SUBSET_Filter: Record<string, any>;
//# sourceMappingURL=RecordSet-Filter-Base.d.ts.map