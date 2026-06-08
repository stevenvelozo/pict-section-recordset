export = ViewRecordSetSUBSETFilterEntityReferenceBase;
declare class ViewRecordSetSUBSETFilterEntityReferenceBase extends ViewRecordSetSUBSETFilterBase {
    /** @param {Record<string, any>} pClause @return {string} The entity to search (RemoteTable / ExternalFilterByTable). */
    getSearchEntity(pClause: Record<string, any>): string;
    /** @param {Record<string, any>} pClause @return {string} The value/ID column on the searched entity. */
    getLookupColumn(pClause: Record<string, any>): string;
    /** @return {boolean} True for the `…List` (multi-select) variants. */
    isMultiSelect(): boolean;
    /**
     * Host-injectable contextual search scope. Returns extra FoxHound filter stanza(s) AND-applied to
     * the entity search (e.g. "only this project's line items"). Default: the clause's static
     * `ContextScopeFilter` if any, else none. Hosts override this to read app state — the module never
     * learns what a "project" or "spec year" is.
     *
     * @param {Record<string, any>} pClause @return {string|Array<string>}
     */
    getContextScopeFilter(pClause: Record<string, any>): string | Array<string>;
    loadMore(pEvent: any, pClauseInformaryAddress: any, pClauseHash: any, pCurrentOffset?: number): void;
    performSearch(pEvent: any, pClauseInformaryAddress: any, pClauseHash: any, pOffset?: number): void;
    handleAdd(pEvent: any, pRecordLookupValue: any, pClauseInformaryAddress: any, pClauseHash: any): void;
    handleRemove(pEvent: any, pRecordLookupValue: any, pClauseInformaryAddress: any, pClauseHash: any): void;
    /** Re-render a clause's container (the table UI re-paints on every search / add / remove). */
    _reRenderClause(pClause: any, pClauseInformaryAddress: any, pClauseHash: any): void;
}
declare namespace ViewRecordSetSUBSETFilterEntityReferenceBase {
    export { default_configuration };
}
import ViewRecordSetSUBSETFilterBase = require("./RecordSet-Filter-Base");
declare const default_configuration: Record<string, any> & {
    ViewIdentifier: string;
    EntityInputType: boolean;
    Templates: {
        Hash: string;
        Template: string;
    }[];
};
//# sourceMappingURL=RecordSet-Filter-EntityReference-Base.d.ts.map