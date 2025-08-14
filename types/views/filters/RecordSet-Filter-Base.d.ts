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