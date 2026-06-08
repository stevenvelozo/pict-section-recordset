# Plan B — Headlight filter integration (strip ComplexFilterProvider to tokens)

> Dev planning doc (not shipped in npm). Do this **after** Plan A (`PLAN-Filter-Base-Class.md`) is built + verified.

## Goal
Once the module owns good, themeable filter clauses, delete Headlight's parallel clause/add-filter system so there's nothing to drift. Headlight should end up branding the module's filters with `--theme-color-*` tokens only.

## As-is Headlight overrides (`/Users/steven/Code/headlight/web/providers/ComplexFilterProvider.js`)
- `PRSP-SUBSET-Filters-Template-AddFilter-Fieldset` — was "Intentionally blank"; **now a band-aid popover button** (added this session, ~line 868) so the drawer has an add-filter trigger.
- `PRSP-Filter-Base-Template` — **now a band-aid Bulma `delete` (✕)** wired to the module's `removeFilter` (added this session, ~line 903).
- `Filters-Expanded-Container` — the pre-consolidation chrome that *used* to host the "Add Filters" button (no longer rendered by the module's new drawer).
- `Filter-Popover-Template` + `initiateAddFilterPopover()` — the styled add-filter popover system.
- experiences-container override + filter CSS.

## Steps
1. **Inventory** every template/method `ComplexFilterProvider` registers; triage each: **delete** (module now provides it) vs. **keep** (genuinely bespoke / token-only).
2. **Remove the two band-aids** added this session (add-filter button + ✕ remove) — redundant once the module ships them.
3. **Replace styling overrides with `--theme-color-*` tokens** (Headlight already defines the palette in `web/headlight-platform-configuration/css/headlight-theme.css`).
4. The module's `onBeforeRender` re-assert can **stay** (harmless safety net once Headlight stops overriding chrome).
5. **Verify** every filter type renders correctly in headlight with **zero** Headlight filter overrides (tokens only): add / edit / change operator / remove; joins resolve; no console errors.
6. **Publish** the module — the next minor, carrying the whole batch (record audit header + Tufte read-fields + filter base class) — then **repin** headlight off the symlink to the published version, rebuild, and **git push** both repos (module → stevenvelozo fork; headlight). Use the standing "go ahead / reviewable command" presentation for the publish + pushes.

## Open items carried from this session
- Band-aid add-filter button + ✕ remove in `ComplexFilterProvider.js` are temporary (remove in step 2).
- The earlier **search-box-clears-on-Enter** regression is still parked — fold into the verification pass.
- The blank **"Created by …"** in the audit popover (actor with no stored name) — optional `LoginID`/`User #id` fallback.

## Risks / calls
- Entity-reference (join) consolidation is the big one — phase it; ship Plan A Phase 1–2 first.
- Add-filter popover needs a small design pass (promote Headlight's, generalized).
- Native-`<select>` theming has cross-browser quirks — CSS-first now; a combobox widget is a later upgrade.
- pict-section-form's emitted markup is the ceiling on how far inputs theme without a custom widget.
