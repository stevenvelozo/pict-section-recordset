export = viewRecordSetCreate;
declare class viewRecordSetCreate extends libPictRecordSetRecordView {
    RecordSet: any;
    providerHash: any;
    manifest: any;
    defaultManifest: {
        Form: string;
        Scope: string;
        Descriptors: {};
        Sections: {
            Name: string;
            Hash: string;
            Solvers: any[];
            ShowTitle: boolean;
            Groups: {
                Name: string;
                Hash: string;
                Rows: any[];
                RecordSetSolvers: any[];
                ShowTitle: boolean;
            }[];
        }[];
    };
    handleRecordSetCreateRoute(pRoutePayload: any): Promise<boolean>;
    clear(): Promise<void>;
    save(): Promise<void>;
    onBeforeClear(): Promise<void>;
    onBeforeSave(): Promise<void>;
    onBeforeRenderCreate(pRecordConfiguration: any, pProviderHash: any): Promise<void>;
    renderCreate(pRecordConfiguration: any, pProviderHash: any): Promise<boolean>;
    _generateManifestTemplate(config: any, section: any, useDefaultManifest: any): string;
}
declare namespace viewRecordSetCreate {
    export { _DEFAULT_CONFIGURATION__Create as default_configuration };
}
import libPictRecordSetRecordView = require("../RecordSet-RecordBaseView.js");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION__Create: Record<string, any>;
//# sourceMappingURL=RecordSet-Create.d.ts.map