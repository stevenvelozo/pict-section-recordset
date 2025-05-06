export = viewRecordSetEditHeaderEdit;
declare class viewRecordSetEditHeaderEdit extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
}
declare namespace viewRecordSetEditHeaderEdit {
    export { _DEFAULT_CONFIGURATION_Edit_HeaderEdit as default_configuration };
}
import libPictView = require("pict-view");
declare namespace _DEFAULT_CONFIGURATION_Edit_HeaderEdit {
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
//# sourceMappingURL=RecordSet-Edit-HeaderEdit.d.ts.map