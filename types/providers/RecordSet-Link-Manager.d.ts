export = PictRecordSetLinkManager;
declare class PictRecordSetLinkManager extends libPictProvider {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('pict')} */
    pict: import("pict");
    linkTemplates: any[];
    /**
     * TODO: Add the ability to add routes that are scoped to particular entity types
     *
     * @param {string} pNameTemplate - The name template for the record link.
     * @param {string} pURLTemplate - The URL template for the record link.
     * @param {boolean} pDefault - Whether this is a default link template.
     *
     * @return {Record<string, any>} - The link template object that was added.
     */
    addRecordLinkTemplate(pNameTemplate: string, pURLTemplate: string, pDefault: boolean): Record<string, any>;
}
declare namespace PictRecordSetLinkManager {
    export { _DEFAULT_PROVIDER_CONFIGURATION as default_configuration };
}
import libPictProvider = require("pict-provider");
/** @type {Record<string, any>} */
declare const _DEFAULT_PROVIDER_CONFIGURATION: Record<string, any>;
//# sourceMappingURL=RecordSet-Link-Manager.d.ts.map