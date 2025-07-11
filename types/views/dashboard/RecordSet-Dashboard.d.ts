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
    handleRecordSetDashboardRoute(pRoutePayload: any): Promise<void>;
    /**
     * @param {import('pict-router')} pPictRouter
     */
    addRoutes(pPictRouter: any): boolean;
    onBeforeRenderList(pRecordListData: any): any;
    dynamicallyGenerateColumns(pRecordListData: any): any;
    excludedByDefaultCells: string[];
    /**
     * @param {string} pDashboardHash
     * @param {Record<string, any>} pRecordSetConfiguration
     * @param {string} pProviderHash
     * @param {string} pFilterString
     * @param {string} pSerializedFilterExperience
     * @param {number} pOffset
     * @param {number} pPageSize
     *
     * @return {Promise<void>}
     */
    renderSpecificDashboard(pDashboardHash: string, pRecordSetConfiguration: Record<string, any>, pProviderHash: string, pFilterString: string, pSerializedFilterExperience: string, pOffset: number, pPageSize: number): Promise<void>;
    /**
     * @param {Record<string, any>} pRecordSetConfiguration
     * @param {string} pProviderHash
     * @param {string} pFilterString
     * @param {string} pSerializedFilterExperience
     * @param {number} pOffset
     * @param {number} pPageSize
     *
     * @return {Promise<void>}
     */
    renderDashboard(pRecordSetConfiguration: Record<string, any>, pProviderHash: string, pFilterString: string, pSerializedFilterExperience: string, pOffset: number, pPageSize: number): Promise<void>;
}
declare namespace viewRecordSetDashboard {
    export { _DEFAULT_CONFIGURATION__Dashboard as default_configuration };
}
import libPictRecordSetRecordView = require("../RecordSet-RecordBaseView.js");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION__Dashboard: Record<string, any>;
//# sourceMappingURL=RecordSet-Dashboard.d.ts.map