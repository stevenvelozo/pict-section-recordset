# Dashboard View

The Dashboard view provides a configurable, manifest-driven interface for displaying record sets with enhanced visualization and computed columns.

## Overview

The Dashboard view extends the list functionality with support for manifests that define computed columns, custom cell rendering, and dynamic data transformation. It's ideal for analytics, reporting, and complex data displays.

## Routes

| Route | Description |
|-------|-------------|
| `/PSRS/:RecordSet/Dashboard` | Default dashboard |
| `/PSRS/:RecordSet/Dashboard/:Offset` | Dashboard with offset |
| `/PSRS/:RecordSet/Dashboard/:Offset/:PageSize` | Dashboard with pagination |
| `/PSRS/:RecordSet/Dashboard/FilteredTo/:FilterString` | Dashboard with filter |
| `/PSRS/:RecordSet/SpecificDashboard/:DashboardHash` | Named dashboard |
| `/PSRS/:RecordSet/SpecificDashboard/:DashboardHash/:Offset/:PageSize` | Named dashboard with pagination |

## Configuration

```javascript
const recordSetConfig = {
    RecordSet: 'Sales',
    Title: 'Sales Dashboard',

    // Use manifest-based dashboard
    RecordSetDashboardManifestOnly: true,
    RecordSetDashboardDefaultManifest: 'SalesOverview',
    RecordSetDashboardManifests: ['SalesOverview', 'SalesByRegion', 'TopSellers']
};
```

## Dashboard Manifests

Manifests define the dashboard structure, columns, and computed values:

```javascript
const dashboardManifest = {
    Scope: 'SalesData',
    TitleTemplate: 'Sales Dashboard - {~D:Record.RecordSet~}',

    TableCells: [
        {
            Key: 'ProductName',
            DisplayName: 'Product',
            PictDashboard: {
                ValueTemplate: '{~D:Record.Data.ProductName~}'
            }
        },
        {
            Key: 'Revenue',
            DisplayName: 'Revenue',
            ManifestHash: 'Currency',
            PictDashboard: {
                ValueTemplate: '${~D:Record.Data.Revenue~}'
            }
        },
        {
            Key: 'GrowthRate',
            DisplayName: 'Growth',
            PictDashboard: {
                // Computed column using solver
                Solver: 'ComputeGrowthRate',
                ValueTemplate: '<span class="{~D:Record.Computed.GrowthClass~}">{~D:Record.Computed.GrowthRate~}%</span>'
            }
        }
    ],

    Descriptors: {
        'GrowthRate': {
            Hash: 'GrowthRate',
            PictDashboard: {
                Solver: 'ComputeGrowthRate'
            }
        }
    }
};
```

## Specific Dashboards

Use the `SpecificDashboard` route to render a named dashboard:

```javascript
// Navigate to specific dashboard
pict.providers.RecordSetRouter.pictRouter.navigate('/PSRS/Sales/SpecificDashboard/SalesByRegion');

// With pagination
pict.providers.RecordSetRouter.pictRouter.navigate('/PSRS/Sales/SpecificDashboard/TopSellers/0/50');
```

## Child Views

The Dashboard view uses these child views:

| View | Purpose |
|------|---------|
| `PRSP-Dashboard-HeaderDashboard` | Dashboard header actions |
| `PRSP-Dashboard-Title` | Dashboard title |
| `PRSP-Filters` | Filter controls |
| `PRSP-Dashboard-PaginationTop` | Top pagination |
| `PRSP-Dashboard-RecordList` | Record table |
| `PRSP-Dashboard-RecordListHeader` | Table headers |
| `PRSP-Dashboard-RecordListEntry` | Table rows |
| `PRSP-Dashboard-PaginationBottom` | Bottom pagination |

## Dynamic Solver

The Dashboard view integrates with `DynamicRecordsetSolver` to compute values:

```javascript
// Solver is called automatically during render
pict.providers.DynamicRecordsetSolver.solveDashboard(manifest, records);
```

This processes each record, running solvers defined in the manifest to populate computed fields.

## Column Definition

### Simple Columns

```javascript
TableCells: [
    {
        Key: 'Name',
        DisplayName: 'Name',
        PictDashboard: {
            ValueTemplate: '{~D:Record.Data.Name~}'
        }
    }
]
```

### Computed Columns

```javascript
TableCells: [
    {
        Key: 'Total',
        DisplayName: 'Total',
        PictDashboard: {
            Solver: 'ComputeTotal',
            ValueTemplate: '{~D:Record.Computed.Total~}'
        }
    }
]
```

### Custom Rendering

```javascript
TableCells: [
    {
        Key: 'Status',
        DisplayName: 'Status',
        PictDashboard: {
            ValueTemplate: /*html*/`
                <span class="badge badge-{~D:Record.Data.Status~}">
                    {~D:Record.Data.Status~}
                </span>
            `
        }
    }
]
```

## Lifecycle Hooks

```javascript
class CustomDashboardView extends viewRecordSetDashboard {
    onBeforeRenderList(pRecordListData) {
        // Add custom data processing
        // Compute totals, add summary rows, etc.
        return pRecordListData;
    }

    dynamicallyGenerateColumns(pRecordListData) {
        // Customize auto-generated columns
        return super.dynamicallyGenerateColumns(pRecordListData);
    }
}
```

## Templates

| Template Hash | Purpose |
|---------------|---------|
| `PRSP-Dashboard-Template` | Main dashboard container |
| `PRSP-Dashboard-Template-Record` | Record template |

## Filter Integration

Dashboards support the same filtering as List views:

```javascript
// With filter
'/PSRS/Sales/Dashboard/FilteredTo/FBV~Region~EQ~North'

// With filter experience (serialized filter state)
'/PSRS/Sales/Dashboard/FilterExperience/eyJmaWx0ZXJzIjpbXX0='
```

## Decorated Records

The Dashboard uses `getDecoratedRecords` instead of `getRecords`, which allows providers to add computed or transformed data:

```javascript
// In provider
async getDecoratedRecords(pFilter) {
    const records = await this.getRecords(pFilter);

    // Add decorations
    records.Records = records.Records.map(record => ({
        ...record,
        DisplayStatus: this.getStatusLabel(record.Status),
        FormattedDate: this.formatDate(record.CreatedDate)
    }));

    return records;
}
```

## Example Usage

```javascript
// Navigate to default dashboard
pict.providers.RecordSetRouter.pictRouter.navigate('/PSRS/Sales/Dashboard');

// Navigate to specific dashboard
pict.providers.RecordSetRouter.pictRouter.navigate('/PSRS/Sales/SpecificDashboard/TopSellers');

// Access the dashboard view
const dashboardView = pict.views['RSP-RecordSet-Dashboard'];

// Render programmatically
const config = pict.PictSectionRecordSet.recordSetProviderConfigurations['Sales'];
await dashboardView.renderDashboard(config, 'RSP-Provider-Sales', '', '', 0, 100);

// Render specific dashboard
await dashboardView.renderSpecificDashboard(
    'TopSellers',
    config,
    'RSP-Provider-Sales',
    '',     // filterString
    '',     // filterExperience
    0,      // offset
    50      // pageSize
);
```

## Data Structure

The dashboard provides this data structure to templates:

```javascript
{
    Title: 'Sales Dashboard',
    RecordSet: 'Sales',
    RecordSetConfiguration: { ... },
    RenderDestination: '#PRSP_Container',
    DashboardHash: 'TopSellers',      // For specific dashboards
    FilterString: '',
    Records: { Records: [...] },
    TotalRecordCount: { Count: 500 },
    RecordSchema: { properties: { ... } },
    GUIDAddress: 'GUIDSales',
    TableCells: [
        {
            Key: 'ProductName',
            DisplayName: 'Product',
            ManifestHash: 'Default',
            PictDashboard: { ValueTemplate: '...' }
        }
    ],
    // Pagination data...
}
```

## Multiple Dashboards

Configure multiple dashboards for different views of the same data:

```javascript
const recordSetConfig = {
    RecordSet: 'Sales',
    RecordSetDashboardManifests: ['Overview', 'ByRegion', 'ByProduct', 'TimeSeries']
};

// Register manifests
pict.PictSectionRecordSet.addManifest('Overview', overviewManifest);
pict.PictSectionRecordSet.addManifest('ByRegion', regionManifest);
pict.PictSectionRecordSet.addManifest('ByProduct', productManifest);
pict.PictSectionRecordSet.addManifest('TimeSeries', timeSeriesManifest);
```

Then navigate between them:

```javascript
// Overview
'/PSRS/Sales/SpecificDashboard/Overview'

// By Region
'/PSRS/Sales/SpecificDashboard/ByRegion'

// By Product
'/PSRS/Sales/SpecificDashboard/ByProduct'
```
