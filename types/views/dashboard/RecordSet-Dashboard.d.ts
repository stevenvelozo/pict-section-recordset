export = viewRecordSetDashboard;
declare class viewRecordSetDashboard extends libPictRecordSetRecordView {
    childViews: {
        headerList: any;
        title: any;
        paginationTop: any;
        recordList: any;
        recordListHeader: any;
        recordListEntry: any;
        paginationBottom: any;
    };
    handleRecordSetDashboardRoute(pRoutePayload: any): Promise<boolean>;
    /**
     * @param {import('pict-router')} pPictRouter
     */
    addRoutes(pPictRouter: any): boolean;
    onBeforeRenderList(pRecordListData: any): any;
    dynamicallyGenerateColumns(pRecordListData: any): any;
    excludedByDefaultCells: string[];
    renderList(pRecordSetConfiguration: any, pProviderHash: any, pFilterString: any, pOffset: any, pPageSize: any): Promise<boolean>;
}
declare namespace viewRecordSetDashboard {
    export { _DEFAULT_CONFIGURATION__Dashboard as default_configuration };
}
import libPictRecordSetRecordView = require("../RecordSet-RecordBaseView.js");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION__Dashboard: Record<string, any>;
//# sourceMappingURL=RecordSet-Dashboard.d.ts.map