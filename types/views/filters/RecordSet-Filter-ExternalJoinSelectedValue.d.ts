export = ViewRecordSetSUBSETFilterExternalJoinSelectedValue;
declare class ViewRecordSetSUBSETFilterExternalJoinSelectedValue extends ViewRecordSetSUBSETFilterBase {
    /**
     * @param {UIEvent} pEvent
     * @param {string} pClauseInformaryAddress
     * @param {string} pClauseHash
     */
    loadMore(pEvent: UIEvent, pClauseInformaryAddress: string, pClauseHash: string, pCurrentOffset?: number): void;
    /**
     * @param {UIEvent} pEvent
     * @param {string} pClauseInformaryAddress
     * @param {string} pClauseHash
     * @param {number} [pOffset=0] - The offset for the search results, defaults to 0
     */
    performSearch(pEvent: UIEvent, pClauseInformaryAddress: string, pClauseHash: string, pOffset?: number): void;
    handleSelect(pEvent: any, pRecordLookupValue: any, pClauseInformaryAddress: any, pClauseHash: any): void;
    handleRemove(pEvent: any, pRecordLookupValue: any, pClauseInformaryAddress: any, pClauseHash: any): void;
}
declare namespace ViewRecordSetSUBSETFilterExternalJoinSelectedValue {
    export { default_configuration };
}
import ViewRecordSetSUBSETFilterBase = require("./RecordSet-Filter-Base");
declare const default_configuration: any;
//# sourceMappingURL=RecordSet-Filter-ExternalJoinSelectedValue.d.ts.map