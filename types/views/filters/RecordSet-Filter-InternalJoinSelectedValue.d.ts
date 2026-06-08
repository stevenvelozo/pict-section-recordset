export = ViewRecordSetSUBSETFilterInternalJoinSelectedValue;
declare class ViewRecordSetSUBSETFilterInternalJoinSelectedValue extends ViewRecordSetSUBSETFilterEntityReferenceBase {
    getSearchEntity(pClause: any): any;
}
declare namespace ViewRecordSetSUBSETFilterInternalJoinSelectedValue {
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
//# sourceMappingURL=RecordSet-Filter-InternalJoinSelectedValue.d.ts.map