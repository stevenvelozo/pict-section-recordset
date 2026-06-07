export = ViewRecordSetSUBSETFilterExternalJoinSelectedValue;
declare class ViewRecordSetSUBSETFilterExternalJoinSelectedValue extends ViewRecordSetSUBSETFilterEntityReferenceBase {
    getSearchEntity(pClause: any): any;
}
declare namespace ViewRecordSetSUBSETFilterExternalJoinSelectedValue {
    export { default_configuration };
}
import ViewRecordSetSUBSETFilterEntityReferenceBase = require("./RecordSet-Filter-EntityReference-Base");
declare const default_configuration: Record<string, any> & {
    ViewIdentifier: string;
    EntityInputType: boolean;
    Templates: {
        Hash: string;
        Template: string;
    }[];
} & {
    ViewIdentifier: string;
};
//# sourceMappingURL=RecordSet-Filter-ExternalJoinSelectedValue.d.ts.map