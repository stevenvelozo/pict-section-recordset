# Filters

Filters allow users to narrow down record sets based on field values.

## Filter Types

The record set supports various filter control types:

| Type | Description |
|------|-------------|
| `Text` | Free-text search input |
| `Select` | Dropdown selection |
| `DateRange` | Date range picker |
| `NumberRange` | Numeric range inputs |
| `Checkbox` | Boolean toggle |
| `MultiSelect` | Multiple selection |

## Filter Configuration

Configure filters in your record set manifest:

```javascript
const filterConfig = {
    Filters: [
        {
            Hash: 'NameFilter',
            Name: 'Name',
            FilterType: 'Text',
            Field: 'Name',
            Operator: 'LIKE'
        },
        {
            Hash: 'StatusFilter',
            Name: 'Status',
            FilterType: 'Select',
            Field: 'Status',
            Options: [
                { Value: 'active', Label: 'Active' },
                { Value: 'inactive', Label: 'Inactive' },
                { Value: 'pending', Label: 'Pending' }
            ]
        },
        {
            Hash: 'DateFilter',
            Name: 'Created Date',
            FilterType: 'DateRange',
            Field: 'CreatedDate'
        }
    ]
};
```

## Filter Operators

Available operators for filter conditions:

| Operator | Description | Example |
|----------|-------------|---------|
| `EQ` | Equals | `Status EQ 'active'` |
| `NE` | Not equals | `Status NE 'deleted'` |
| `GT` | Greater than | `Age GT 18` |
| `GE` | Greater or equal | `Age GE 21` |
| `LT` | Less than | `Price LT 100` |
| `LE` | Less or equal | `Price LE 50` |
| `LIKE` | Contains | `Name LIKE 'John'` |
| `IN` | In list | `Status IN ['active','pending']` |

## Filter String Format

Filters are converted to Meadow filter strings:

```
FBV~FieldName~Operator~Value
```

Multiple filters are joined:

```
FBV~Name~LIKE~John~FBV~Status~EQ~active
```

## Dynamic Filters

Filters can be generated from record data:

```javascript
// Auto-generate select options from unique field values
const filter = {
    Hash: 'DepartmentFilter',
    Name: 'Department',
    FilterType: 'Select',
    Field: 'Department',
    DynamicOptions: true,  // Fetch options from data
    FacetField: 'Department'  // Use facet for counts
};
```

## Filter Events

Handle filter changes in your application:

```javascript
// Listen for filter changes
pict.PictSectionRecordSet.on('filter-changed', (filterState) => {
    console.log('Active filters:', filterState);
});

// Programmatically set filters
pict.PictSectionRecordSet.setFilter('StatusFilter', 'active');

// Clear all filters
pict.PictSectionRecordSet.clearFilters();
```

## Custom Filter Controls

Create custom filter input providers:

```javascript
const libFilterProvider = require('pict-section-recordset').FilterProvider;

class CustomRangeFilter extends libFilterProvider
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
    }

    // Render custom filter UI
    render(pFilterConfig, pContainer)
    {
        // Custom rendering logic
    }

    // Get filter value
    getValue()
    {
        return {
            min: this.minInput.value,
            max: this.maxInput.value
        };
    }

    // Convert to filter string
    toFilterString()
    {
        const value = this.getValue();
        return `FBV~${this.options.Field}~GE~${value.min}~FBV~${this.options.Field}~LE~${value.max}`;
    }
}
```
