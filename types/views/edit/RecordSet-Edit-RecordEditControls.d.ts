export = viewRecordSetEditRecordEditControls;
declare class viewRecordSetEditRecordEditControls extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
}
declare namespace viewRecordSetEditRecordEditControls {
    export { _DEFAULT_CONFIGURATION_Edit_RecordEditControls as default_configuration };
}
import libPictView = require("pict-view");
declare namespace _DEFAULT_CONFIGURATION_Edit_RecordEditControls {
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
//# sourceMappingURL=RecordSet-Edit-RecordEditControls.d.ts.map