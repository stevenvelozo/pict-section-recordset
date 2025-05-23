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
declare namespace _DEFAULT_CONFIGURATION__Read {
    let ViewIdentifier: string;
    let DefaultRenderable: string;
    let DefaultDestinationAddress: string;
    let DefaultTemplateRecordAddress: boolean;
    let AutoInitialize: boolean;
    let AutoInitializeOrdinal: number;
    let AutoRender: boolean;
    let AutoRenderOrdinal: number;
    let AutoSolveWithApp: boolean;
    let AutoSolveOrdinal: number;
    let CSS: boolean;
    let CSSPriority: number;
    let Templates: {
        Hash: string;
        Template: string;
    }[];
    let Renderables: {
        RenderableHash: string;
        TemplateHash: string;
        DestinationAddress: string;
        RenderMethod: string;
    }[];
    let Manifests: {};
}
//# sourceMappingURL=RecordSet-Read.d.ts.map