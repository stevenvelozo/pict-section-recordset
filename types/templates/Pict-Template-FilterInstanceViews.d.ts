export = PictTemplateFilterInstanceViewInstruction;
/**
 * Specialized instruction for rendering the filter view and plumbing in required context.
 *
 * Based on the Pict base {~V:...~} template instruction.
 *
 * ## Async render architecture (see renderAsync below)
 *
 * The async path is tuned to get the dashboard records list painted before any
 * speculative filter-list REST lookups complete. Three things collaborate to
 * make that happen:
 *
 * 1. **Parallel filter fan-out.** Every filter clause starts its own
 *    `renderWithScopeAsync` in a single pass, instead of chaining through a
 *    sequential `Anticipate` queue. Template parsing, `onBefore*`/`onProject*`
 *    microtask hops, and the synchronous DOM walks done inside each filter's
 *    `onAfterRender` all happen concurrently rather than serialized across N
 *    filters. Results are collected into an indexed array so final output
 *    order still matches the clause order.
 *
 * 2. **Per-filter transaction isolation.** Each filter render gets its own
 *    synthetic `RootRenderable` carrying a fresh `TransactionHash`. Any
 *    `virtual-assignment` sub-renders that the filter's dynamic form spawns
 *    (notably `PSRSFilterProxyView`, which pict-section-form uses to host
 *    each filter's input) push into THIS transaction's queue, not the
 *    dashboard's. The dashboard's outer `renderAsync` callback fires as soon
 *    as every filter has its template string - without waiting on any of
 *    the nested input-initialize work.
 *
 * 3. **Deferred post-render drain.** The filter's post-render pipeline
 *    (`onAfterRenderAsync`, which is what runs pict-section-form's
 *    `runInputProviderFunctions('onInputInitialize', ...)` and therefore
 *    triggers `EntityBundleRequest.gatherDataFromServer` for any
 *    speculative-load inputs) is intentionally NOT run inline. It is queued
 *    via `setTimeout(..., 0)` so it fires on the next macrotask, giving the
 *    browser a tick to paint the dashboard first.
 *
 * ### Render-epoch race guard
 *
 * Between the dashboard callback firing and the setTimeout actually running,
 * the user may have navigated away / applied a different filter experience /
 * cleared filters. The `PRSP-Filters` view owns a monotonic `_renderEpoch`
 * counter that gets bumped on every mutating action (`performSearch`,
 * `handleClear`, `handleReset`, `addFilter`, `removeFilter`). Each scheduled
 * drain captures the epoch at schedule time and bails out if a newer render
 * has invalidated it, so a stale REST response can never clobber a filter
 * container that now belongs to a different experience.
 */
declare class PictTemplateFilterInstanceViewInstruction extends libPictTemplate {
    /**
     * @param {Object} pFable - The Fable Framework instance
     * @param {Object} pOptions - The options for the service
     * @param {String} pServiceHash - The hash of the service
     */
    constructor(pFable: any, pOptions: any, pServiceHash: string);
    _getViewForFilterClause(pClause: any): import("../views/filters/RecordSet-Filter-Base.js");
}
import libPictTemplate = require("pict-template");
//# sourceMappingURL=Pict-Template-FilterInstanceViews.d.ts.map