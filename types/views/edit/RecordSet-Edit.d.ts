export = viewRecordSetEdit;
declare class viewRecordSetEdit extends libPictRecordSetRecordView {
}
declare namespace viewRecordSetEdit {
    export { _DEFAULT_CONFIGURATION__Edit as default_configuration };
}
import libPictRecordSetRecordView = require("../RecordSet-RecordBaseView.js");
declare namespace _DEFAULT_CONFIGURATION__Edit {
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
//# sourceMappingURL=RecordSet-Edit.d.ts.map