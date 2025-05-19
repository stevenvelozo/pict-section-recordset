export = PictSectionRecordSetApplication;
/**
 * Represents a PictSectionRecordSetApplication.
 *
 * This is the automagic controller for a dynamic record set application.
 *
 * @class
 * @extends libPictApplication
 */
declare class PictSectionRecordSetApplication extends libPictApplication {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
}
declare namespace PictSectionRecordSetApplication {
    export { default_configuration };
}
import libPictApplication = require("pict-application");
declare namespace default_configuration {
    let Name: string;
    let Hash: string;
    namespace pict_configuration {
        let Product: string;
    }
}
//# sourceMappingURL=Pict-Application-RecordSet.d.ts.map