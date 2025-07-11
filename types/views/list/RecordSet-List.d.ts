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
    handleRecordSetListRoute(pRoutePayload: any): Promise<void>;
    onBeforeRenderList(pRecordListData: any): any;
    dynamicallyGenerateColumns(pRecordListData: any): any;
    excludedByDefaultCells: string[];
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
    renderList(pRecordSetConfiguration: Record<string, any>, pProviderHash: string, pFilterString: string, pSerializedFilterExperience: string, pOffset: number, pPageSize: number): Promise<void>;
}
declare namespace viewRecordSetList {
    export { _DEFAULT_CONFIGURATION__List as default_configuration };
}
import libPictRecordSetRecordView = require("../RecordSet-RecordBaseView.js");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION__List: Record<string, any>;
//# sourceMappingURL=RecordSet-List.d.ts.map