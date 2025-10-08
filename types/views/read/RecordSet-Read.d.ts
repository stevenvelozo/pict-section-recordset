export = viewRecordSetRead;
declare class viewRecordSetRead extends libPictRecordSetRecordView {
    layoutType: string;
    action: string;
    tabs: any[];
    RecordSet: any;
    providerHash: any;
    activeTab: any;
    mouseHandler: (event: any) => void;
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
    GUID: any;
    initializeDragListener(): void;
    onAfterRender(pRenderable: any): boolean;
    handleRecordSetReadRoute(pRoutePayload: any): Promise<boolean>;
    handleRecordSetEditRoute(pRoutePayload: any): Promise<boolean>;
    cancel(): Promise<void>;
    save(): Promise<void>;
    edit(): Promise<void>;
    onBeforeRenderRead(pRecordReadData: any): any;
    formatDisplayData(pRecordListData: any): any;
    onBeforeEdit(): Promise<void>;
    onBeforeSave(): Promise<void>;
    onBeforeView(): Promise<void>;
    onBeforeTabChange(): Promise<void>;
    renderRead(pRecordConfiguration: any, pProviderHash: any, pRecordGUID: any): Promise<boolean>;
    setTab(t: any): Promise<void>;
    _generateManifestTemplate(config: any, section: any, specificManifest: any, setBaseManifest: any, action: string, useDefaultManifest: any): string;
    _structureTabs(config: any, record: any): Promise<{
        Type: string;
        RecordSet: any;
        Title: any;
        Hash: string;
        Template: string;
        TabTemplate: string;
        render: () => void;
    }[]>;
}
declare namespace viewRecordSetRead {
    export { _DEFAULT_CONFIGURATION__Read as default_configuration };
}
import libPictRecordSetRecordView = require("../RecordSet-RecordBaseView.js");
/** @type {Record<string, any>} */
declare const _DEFAULT_CONFIGURATION__Read: Record<string, any>;
//# sourceMappingURL=RecordSet-Read.d.ts.map