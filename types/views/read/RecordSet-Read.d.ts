export = viewRecordSetRead;
declare class viewRecordSetRead extends libPictRecordSetRecordView {
    childViews: {
        viewHeaderRead: any;
        viewTabBarRead: any;
        viewRecordRead: any;
        viewRecordReadExtra: any;
    };
    handleRecordSetReadRoute(pRoutePayload: any): Promise<boolean>;
    onBeforeRenderRead(pRecordReadData: any): any;
    formatDisplayData(pRecordListData: any): any;
    renderRead(pRecordConfiguration: any, pProviderHash: any, pRecordGUID: any): Promise<boolean>;
}
declare namespace viewRecordSetRead {
    export { _DEFAULT_CONFIGURATION__Read as default_configuration };
}
import libPictRecordSetRecordView = require("../RecordSet-RecordBaseView.js");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION__Read: Record<string, any>;
//# sourceMappingURL=RecordSet-Read.d.ts.map