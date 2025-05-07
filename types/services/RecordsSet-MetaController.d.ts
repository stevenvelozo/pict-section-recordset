export = RecordSetMetacontroller;
declare class RecordSetMetacontroller {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    /** @type {import('pict') & { addView: (hash: string, options: any, prototype: any) => any }} */
    pict: import("pict") & {
        addView: (hash: string, options: any, prototype: any) => any;
    };
    /** @type {import('pict') & { addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any }} */
    fable: import("pict") & {
        addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any;
    };
    /** @type {any} */
    log: any;
    /** @type {any} */
    options: any;
    /** @type {string} */
    UUID: string;
    childViews: {
        list: any;
        edit: any;
        read: any;
        dashboard: any;
    };
    has_initialized: boolean;
    initialize(): this;
}
declare namespace RecordSetMetacontroller {
    let default_configuration: {};
}
//# sourceMappingURL=RecordsSet-MetaController.d.ts.map