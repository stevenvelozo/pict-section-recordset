export = PictTemplateFilterInstanceViewInstruction;
/**
 * Specialized instruction for rendering the filter view and plumbing in required context.
 *
 * Based on the Pict base {~V:...~} template instruction.
 */
declare class PictTemplateFilterInstanceViewInstruction extends libPictTemplate {
    /**
     * @param {Object} pFable - The Fable Framework instance
     * @param {Object} pOptions - The options for the service
     * @param {String} pServiceHash - The hash of the service
     */
    constructor(pFable: any, pOptions: any, pServiceHash: string);
    /** @type {any} */
    log: any;
    _getViewForFilterClauses(pClauses: any): import("../views/filters/RecordSet-Filter-Base.js");
}
import libPictTemplate = require("pict-template");
//# sourceMappingURL=Pict-Template-FilterInstanceViews.d.ts.map