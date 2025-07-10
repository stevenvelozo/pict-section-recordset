export = viewRecordSetList;
declare class viewRecordSetList extends libPictRecordSetRecordView {
    childViews: {
        headerList: any;
        title: any;
        paginationTop: any;
        recordList: any;
        recordListHeader: any;
        recordListEntry: any;
        paginationBottom: any;
    };
    handleRecordSetListRoute(pRoutePayload: any): Promise<boolean>;
    onBeforeRenderList(pRecordListData: any): any;
    dynamicallyGenerateColumns(pRecordListData: any): any;
    excludedByDefaultCells: string[];
    renderList(pRecordSetConfiguration: any, pProviderHash: any, pFilterString: any, pFilterExperience: any, pOffset: any, pPageSize: any): Promise<boolean>;
}
declare namespace viewRecordSetList {
    export { _DEFAULT_CONFIGURATION__List as default_configuration };
}
import libPictRecordSetRecordView = require("../RecordSet-RecordBaseView.js");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION__List: Record<string, any>;
//# sourceMappingURL=RecordSet-List.d.ts.map