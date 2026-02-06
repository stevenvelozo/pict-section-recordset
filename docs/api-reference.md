# API Reference

Complete API documentation for Pict-Section-RecordSet.

## PictRecordSetApplication

Main application class for record set management.

### Constructor

```javascript
new PictRecordSetApplication(pFable, pOptions, pServiceHash)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `pFable` | object | Pict/Fable instance |
| `pOptions` | object | Application configuration |
| `pServiceHash` | string | Service identifier |

### Configuration Options

```javascript
{
    Name: 'My Record Set App',
    Hash: 'MyRecordSetApp',
    pict_configuration: {
        Product: 'MyProduct'
    }
}
```

---

## RecordSetProviderBase

Base class for record providers.

### Methods

#### getRecord(pIDOrGuid, fCallback)

Retrieves a single record.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pIDOrGuid` | string/number | Record identifier |
| `fCallback` | function | Callback `(error, record)` |

#### getRecords(pFilter, fCallback)

Retrieves multiple records with filtering.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pFilter` | object | Filter configuration |
| `fCallback` | function | Callback `(error, result)` |

**Filter Object:**

```javascript
{
    Entity: 'EntityName',
    FilterString: 'FBV~Field~EQ~Value',
    Offset: 0,
    PageSize: 25,
    Facets: {
        ReturnRecords: true,
        Fields: ['Field1', 'Field2'],
        Ranges: [{ Field: 'Date', Start: '2020', End: '2025', Gap: 'YEAR' }]
    }
}
```

**Result Object:**

```javascript
{
    Records: [...],
    Facets: {
        Field1: { 'value1': 10, 'value2': 5 },
        ByRange: { '2020': 100, '2021': 150 }
    }
}
```

#### createRecord(pRecord, fCallback)

Creates a new record.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pRecord` | object | Record data |
| `fCallback` | function | Callback `(error, newRecord)` |

#### updateRecord(pRecord, fCallback)

Updates an existing record.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pRecord` | object | Record data with ID |
| `fCallback` | function | Callback `(error, updatedRecord)` |

#### deleteRecord(pIDOrGuid, fCallback)

Deletes a record.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pIDOrGuid` | string/number | Record identifier |
| `fCallback` | function | Callback `(error, success)` |

---

## RecordSetProviderMeadowEndpoints

Provider for Meadow REST API endpoints. Extends RecordSetProviderBase.

### Additional Configuration

```javascript
{
    // Base URL for API
    APIEndpoint: '/1.0/',

    // Entity name
    Entity: 'User',

    // Use schema endpoint for auto-configuration
    UseSchemaEndpoint: true
}
```

### Meadow Endpoints Used

| Operation | Endpoint |
|-----------|----------|
| Get One | `GET /{Entity}/{id}` |
| Get Many | `GET /{Entity}s/FilteredTo/{filter}/{offset}/{limit}` |
| Create | `POST /{Entity}` |
| Update | `PUT /{Entity}` |
| Delete | `DELETE /{Entity}/{id}` |
| Schema | `GET /{Entity}/Schema` |

---

## Views

### List View

Displays records in a table format.

```javascript
// Configuration
{
    ViewType: 'List',
    Columns: [
        { Field: 'Name', Header: 'Name', Sortable: true },
        { Field: 'Email', Header: 'Email' },
        { Field: 'Status', Header: 'Status' }
    ],
    PageSize: 25,
    ShowPagination: true
}
```

### Detail View

Shows a single record.

```javascript
// Configuration
{
    ViewType: 'Read',
    Fields: [
        { Field: 'Name', Label: 'Full Name' },
        { Field: 'Email', Label: 'Email Address' },
        { Field: 'CreatedDate', Label: 'Created', Format: 'date' }
    ]
}
```

### Create/Edit View

Form for creating or editing records. Uses pict-section-form configuration.

---

## Router

Built-in routing for navigation.

### Routes

| Route | View |
|-------|------|
| `/` | Dashboard |
| `/list` | List view |
| `/view/{id}` | Detail view |
| `/create` | Create form |
| `/edit/{id}` | Edit form |

### Programmatic Navigation

```javascript
// Navigate to list
pict.providers.RecordSetRouter.navigateTo('list');

// Navigate to detail view
pict.providers.RecordSetRouter.navigateTo('view', { id: 123 });

// Navigate to edit
pict.providers.RecordSetRouter.navigateTo('edit', { id: 123 });
```

---

## Module Exports

```javascript
const libPictRecordSet = require('pict-section-recordset');

// Main meta controller
libPictRecordSet  // RecordSet MetaController

// Application class
libPictRecordSet.PictRecordSetApplication

// Providers
libPictRecordSet.RecordSetProviderBase
libPictRecordSet.RecordSetProviderMeadowEndpoints
```
