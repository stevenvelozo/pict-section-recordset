export = ViewRecordSetSUBSETFilterBase;
declare class ViewRecordSetSUBSETFilterBase extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, PictSectionRecordSet: import('../Pict-Section-RecordSet.js') }} */
    pict: import("pict") & {
        log: any;
        instantiateServiceProviderWithoutRegistration: (hash: string) => any;
        PictSectionRecordSet: any;
    };
    /** @type {import('pict').FilterClauseBase[]} */
    filterClauses: import("pict/types/source/filters/FilterClauseBase.js")[];
    /**
     * @param {import('pict/types/source/filters/Filter.js').FilterType} pType
     * @param {string} [pColumnName]
     *
     * FIXME: figure out if we can resolve the string to type using JSDoc
     * @return {any}
     */
    addFilterClauseType(pType: import("pict/types/source/filters/Filter.js").FilterType, pColumnName?: string): any;
    /**
     * @return {Array<import('pict/types/source/filters/FilterClauseBase.js').FilterClauseConfig>}
     */
    serializeFilterClauses(): Array<import("pict/types/source/filters/FilterClauseBase.js").FilterClauseConfig>;
}
declare namespace ViewRecordSetSUBSETFilterBase {
    export { _DEFAULT_CONFIGURATION_SUBSET_Filter as default_configuration };
}
import libPictView = require("pict-view");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION_SUBSET_Filter: Record<string, any>;
//# sourceMappingURL=RecordSet-Filter-Base.d.ts.map