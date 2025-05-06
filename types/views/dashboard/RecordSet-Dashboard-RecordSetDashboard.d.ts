export = viewRecordSetDashboardRecordSetDashboard;
declare class viewRecordSetDashboardRecordSetDashboard extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
}
declare namespace viewRecordSetDashboardRecordSetDashboard {
    export { _DEFAULT_CONFIGURATION_Dashboard_RecordSetDashboard as default_configuration };
}
import libPictView = require("pict-view");
declare namespace _DEFAULT_CONFIGURATION_Dashboard_RecordSetDashboard {
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
//# sourceMappingURL=RecordSet-Dashboard-RecordSetDashboard.d.ts.map