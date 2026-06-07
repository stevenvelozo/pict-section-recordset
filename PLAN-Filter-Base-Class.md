# Plan A — Filter view base class + parity (pict-section-recordset)

> Dev planning doc (not shipped in npm). Pair with `PLAN-Headlight-Filter-Integration.md`.

## Context / why
The filter UX is split: this module owns the consolidated control *chrome* (search row, drawer, experiences, Clear/Reset/Apply), but host apps re-implement the *clause* UX — Headlight's `web/providers/ComplexFilterProvider.js` supplies a popover add-filter, styled clause wrappers, and (was supposed to) remove. That split produced a regression class: the module's `onBeforeRender` re-assert + the app's overrides drift against each other → native `<select>`s re-exposed, the remove button lost, the add-filter button vanished. Fix: move the **basic, universal filter types** into the module as good, themeable defaults behind a **real base class**, so apps brand via `--theme-color-*` and never re-implement clause UI. Same pattern already used for the consolidated control, pagination, and the record audit header.

This is **consolidation, not greenfield** — most of the pieces exist; they're just thin/bare/duplicated.

## As-is architecture (so we don't re-investigate)
- **Base:** `source/views/filters/RecordSet-Filter-Base.js` — `class ViewRecordSetSUBSETFilterBase extends libPictView` (near-empty). `prepareRecord()` builds a `ClauseDescriptor` `{Address, Hash, Name, DataType, PictForm}` consumed by `PSRSFilterProxyView`. `getFilterFormTemplate()` returns a template hash (subclasses override). Template `PRSP-Filter-Base-Template` (~lines 41-54) = clause wrapper + a **hardcoded** `-` remove button calling `_Pict.views['PRSP-Filters'].removeFilter(event, RecordSet, ViewContext, Hash)`.
- **Range sub-base:** `RecordSet-Filter-Base-Range.js` (Start/End ClauseDescriptors).
- **22 type views** in `source/views/filters/`: 6 Match (String/Date/Numeric + joins), 6 Range, 8 join shims, **4 entity-reference** (Internal/ExternalJoinSelectedValue + …List, ~11.5k LOC each, ~95% duplicated Internal-vs-External). Match/Range are <50 LOC (override `getFilterFormTemplate` + sometimes `prepareRecord`/DataType).
- **Inputs** render via `{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}` → pict-section-form DynamicForm (`PSRSFilterProxyView` registered in `RecordSet-Filters.js` ~236-287). Native `<select>` comes from (a) the add-filter field/operator pickers (`PRSP-SUBSET-Filters-Template-AddFilter-Dropdown` ~159-189 in RecordSet-Filters.js) and (b) pict-section-form enum/picklist rendering. **No theme layer. No operator-change UI after a clause is added.**
- **Add flow:** `selectFilterToAdd` → field `<select>` (`Scope.getFilterSchema()`) → operator/clause `<select>` (`getFilterClauseSchemaForKey(key).AvailableClauses`) → `addFilter` → `provider.addFilterClause(filterKey, clauseKey)` (clones schema entry, stamps `Hash = filterKey-clauseKey-uuid`, pushes to `Bundle._ActiveFilterState[RecordSet].FilterClauses`).
- **Clause object:** `{Hash, Label, ClauseKey, FilterByColumn, Type, …}`; serializes to the `FBV…` filter URL. `Type` → view lookup `PRSP-FilterType-${Type}` in `source/templates/Pict-Template-FilterInstanceViews.js` (~75-97), with a `CustomFilterViewHash` override + fallback to Base.
- **Registration:** bulk `require('./filters')` + `addView` in RecordSet-Filters.js (~288-294); views are global, keyed by `ViewIdentifier`.
- **Provider methods** (`source/providers/RecordSet-RecordProvider-Base.js`): `addFilterClause` (~308), `removeFilterClause(hash)` (~338), `getFilterSchema` (~292), `getFilterClauseSchemaForKey(key)` (~284), `getFilterClauses` (~358), `clearFilterClauses`, `moveFilterClauseTo/By`. **Fine as-is.**
- **Entity-reference schema** carries `ExternalFilterByTable` / `ExternalFilterByColumn` / `SearchFields` / display template — enough for a generic entity picker driven by `pict.EntityProvider` + `{~E:~}`.

## Plan (phased — Phase 1 alone retires the reported bugs for every app)

### Phase 1 — Real base class + remove-as-method + theme CSS
1. Promote `RecordSet-Filter-Base.js` into the real base:
   - Own `PRSP-Filter-Base-Template` with a **themed** remove (`{~I:Trash~}`) calling a **new base method `removeClause(pHash)`** → `provider.removeFilterClause(pHash)` + re-render. Replaces the hardcoded `_Pict.views['PRSP-Filters'].removeFilter(...)`. Every type inherits a working, themeable remove — no app re-adds one.
   - Themed label + value region; overridable hooks: `getFilterFormTemplate`, `prepareRecord`, `getValueInput`, `getOperatorPicker`.
   - Ship theme-token CSS scoped to `.prsp-filter-*` (wrapper, label, the `<select>`/`<input>`, remove) — CSS-first, like the Tufte read-field fix. This kills the unstyled-native-select look for everyone.
2. Slim the 6 Match + 6 Range views to pure declarations (DataType + template hash) — they're nearly there already.

### Phase 2 — Module-owned add-filter affordance
3. Replace the two bare `<select>` pickers in `RecordSet-Filters.js` with one **styled "Add filter" popover** — promote Headlight's `initiateAddFilterPopover` UX into the module, generically, driven by `getFilterSchema()` / `getFilterClauseSchemaForKey()`.
4. (Optional, real gap) per-clause **operator-change picker** (themed) so an operator can be changed after adding.

### Phase 3 — Generic entity-reference (join) base (biggest, do last)
5. New `source/views/filters/RecordSet-Filter-EntityReference-Base.js`: extract the ~95% shared search/select/state from Internal/ExternalJoinSelectedValue(List). Internal/External become thin subclasses differing only in **fetch strategy** (local table vs. `pict.EntityProvider` / `{~E:~}`). ~46k LOC → one base + thin subclasses.

## Files
- `source/views/filters/RecordSet-Filter-Base.js` (+ `RecordSet-Filter-Base-Range.js`)
- **NEW** `source/views/filters/RecordSet-Filter-EntityReference-Base.js`
- the 22 type views (slim)
- `source/views/RecordSet-Filters.js` (add-filter popover; chrome already in place)
- `source/templates/Pict-Template-FilterInstanceViews.js` (type→view lookup — verify fallback)
- provider methods: **unchanged**

## Verify
bookstore example app + headlight live: per type — add / edit value / change operator / remove; themed inputs (no bare selects); joins resolve related names; no console errors. Run the module test suite (`npm test`).

## Sequencing notes
- Keep the module **monkey-patched (symlink into headlight)** until the whole batch (record audit header + Tufte + this filter work) is done, then publish + repin headlight.
- The module's `onBeforeRender` re-assert (now narrowed to the 5 chrome hashes) **stays** as a safety net for other apps.
