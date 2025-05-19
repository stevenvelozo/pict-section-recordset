export = viewPictSectionRecordSetViewBase;
declare class viewPictSectionRecordSetViewBase extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, PictSectionRecordSet: InstanceType<import('../Pict-Section-RecordSet.js') }} */
    pict: import("pict") & {
        log: any;
        instantiateServiceProviderWithoutRegistration: (hash: string) => any;
        PictSectionRecordSet: InstanceType<{
            new (pFable: any, pOptions: any, pServiceHash: any): import("../services/RecordsSet-MetaController.js");
            default_configuration: {
                DefaultMeadowURLPrefix: string;
            };
            PictRecordSetApplication: typeof import("../application/Pict-Application-RecordSet.js");
            RecordSetProviderBase: typeof import("../providers/RecordSet-RecordProvider-Base.js");
            RecordSetProviderMeadowEndpoints: typeof import("../providers/RecordSet-RecordProvider-MeadowEndpoints.js");
        }>;
    };
    addRoutes(pPictRouter: any): boolean;
}
declare namespace viewPictSectionRecordSetViewBase {
    export { _DEFAULT_CONFIGURATION_Base_View as default_configuration };
}
import libPictView = require("pict-view");
declare namespace _DEFAULT_CONFIGURATION_Base_View {
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
//# sourceMappingURL=RecordSet-RecordBaseView.d.ts.map