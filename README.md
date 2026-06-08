# PICT RecordSet Section

> **[Read the Pict-Section-Recordset Documentation](https://fable-retold.github.io/pict-section-recordset/)** - interactive docs with the full API reference.

A PICT section that provides basic CRUD views (Create, Read, Update and Delete)
based on stable providers and configurations.

## The Noble Provider

The only thing that's really required for this to operate is a Record/Record
Set provider... and given a Meadow Endpoint, the `/1.0/Entity/Schema` endpoint
can be used to programmatically create a functional provider.

## Quick Filters

A curated, one-interaction filter bar at the top of the filter drawer — the handful of filters people reach for most often (fuzzy-search the title, "added in this range", "added by …"), pre-wired so there's no "Add filter → pick a field → pick a clause type" hunt. Each control writes a real filter clause, so it serializes, applies, and clears like anything in the full list.

**Clever by default.** With no configuration the bar is derived from the entity schema:

| Field present | Quick control |
|---|---|
| `Title` (else `Name`) | fuzzy text |
| `CreateDate` / `UpdateDate` | date range |
| `CreatingIDUser` / `UpdatingIDUser` | entity picker (the related entity) |

**Curated by config.** Set `QuickFilters` on the RecordSet config to control which filters appear, their labels, and their order. Entries are a field name, or an object for a custom label / explicit clause:

```javascript
{
    "RecordSet": "Book",
    "RecordSetMeadowEntity": "Book",
    "QuickFilters":
    [
        "Title",
        "Genre",
        { "Field": "CreateDate", "Label": "Added" },
        { "Field": "CreatingIDUser", "Label": "Added by" }
    ]
}
```

The control type is inferred from the field's clause (text for a string match, a from/to pair for a date range, a [pict-section-picker](https://github.com/fable-retold/pict-section-picker) for an entity reference). A quick clause lives in the same filter state as every other clause (tagged so the full clause list doesn't show it twice), and is removed when its value is cleared.

**Turning it off.** A single record set opts out with `QuickFilters: false`. To make quick filters **opt-in** across a whole app — only record sets with an explicit `QuickFilters` array show the bar — set the filter view's flag once: `pict.views['PRSP-Filters'].quickFiltersAutoDefault = false`.

## Related Packages

- [pict](https://github.com/fable-retold/pict) - MVC application framework
- [pict-view](https://github.com/fable-retold/pict-view) - View base class
- [pict-provider](https://github.com/fable-retold/pict-provider) - Data provider base class
- [pict-section-form](https://github.com/fable-retold/pict-section-form) - Form section component

## License

MIT

## Contributing

Pull requests are welcome. For details on our code of conduct, contribution process, and testing requirements, see the [Retold Contributing Guide](https://github.com/stevenvelozo/retold/blob/main/docs/contributing.md).
