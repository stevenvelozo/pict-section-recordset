export = ViewRecordSetSUBSETFilterInternalJoinSelectedValueList;
declare class ViewRecordSetSUBSETFilterInternalJoinSelectedValueList extends ViewRecordSetSUBSETFilterEntityReferenceBase {
    getSearchEntity(pClause: any): any;
}
declare namespace ViewRecordSetSUBSETFilterInternalJoinSelectedValueList {
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
//# sourceMappingURL=RecordSet-Filter-InternalJoinSelectedValueList.d.ts.map