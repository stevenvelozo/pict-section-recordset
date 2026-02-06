# Record Providers

Record providers handle all data operations for your record sets.

## Provider Types

### RecordSetProviderBase

The base class for creating custom record providers:

```javascript
const libRecordSetProviderBase = require('pict-section-recordset').RecordSetProviderBase;

class MyRecordProvider extends libRecordSetProviderBase
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
    }

    // Get a single record by ID
    getRecord(pIDOrGuid, fCallback)
    {
        // Fetch record from your data source
        const record = this.fetchFromDatabase(pIDOrGuid);
        fCallback(null, record);
    }

    // Get multiple records with filtering
    getRecords(pFilter, fCallback)
    {
        // Fetch records with filter applied
        const records = this.queryDatabase(pFilter);
        fCallback(null, { Records: records });
    }

    // Create a new record
    createRecord(pRecord, fCallback)
    {
        const newRecord = this.insertIntoDatabase(pRecord);
        fCallback(null, newRecord);
    }

    // Update an existing record
    updateRecord(pRecord, fCallback)
    {
        const updated = this.updateInDatabase(pRecord);
        fCallback(null, updated);
    }

    // Delete a record
    deleteRecord(pIDOrGuid, fCallback)
    {
        this.deleteFromDatabase(pIDOrGuid);
        fCallback(null, true);
    }
}

module.exports = MyRecordProvider;
```

### RecordSetProviderMeadowEndpoints

Provider for Meadow REST API endpoints:

```javascript
const libMeadowProvider = require('pict-section-recordset').RecordSetProviderMeadowEndpoints;

// The provider automatically handles:
// - GET /Entity/{id} - Get single record
// - GET /Entities/FilteredTo/{filter}/0/100 - Get filtered records
// - POST /Entity - Create record
// - PUT /Entity - Update record
// - DELETE /Entity/{id} - Delete record
```

## Filter Object

When fetching records, you can pass a filter object:

```javascript
const filter = {
    // Entity name (can override for LiteExtended, etc.)
    Entity: 'User',

    // Meadow-style filter string
    FilterString: 'FBV~Name~EQ~John',

    // Pagination
    Offset: 0,
    PageSize: 25,

    // Faceting for search
    Facets: {
        ReturnRecords: true,
        Fields: ['Status', 'Department'],
        Ranges: [
            {
                Field: 'CreatedDate',
                Start: '2020-01-01',
                End: '2025-12-31',
                Gap: 'YEAR'
            }
        ]
    }
};

provider.getRecords(filter, (err, result) => {
    console.log(result.Records);  // Array of records
    console.log(result.Facets);   // Facet counts
});
```

## Provider Configuration

```javascript
const providerConfig = {
    ProviderIdentifier: 'MyRecordProvider',

    // Auto-initialize with application
    AutoInitialize: true,
    AutoInitializeOrdinal: 1,

    // Don't solve with app (records loaded on demand)
    AutoSolveWithApp: false
};
```

## Registering Providers

Register your provider with the Pict instance:

```javascript
// Add the provider type
pict.addProviderSingleton('MyRecordProvider', providerConfig, MyRecordProvider);

// Or instantiate directly
const provider = pict.instantiateServiceProvider('RecordSetProviderBase', {
    ProviderIdentifier: 'UserProvider'
});
```

## Using with Meadow Endpoints

The Meadow provider can auto-generate configuration from schema:

```javascript
// Fetch schema from Meadow endpoint
fetch('/1.0/User/Schema')
    .then(response => response.json())
    .then(schema => {
        // Use schema to configure the record set
        app.configureFromSchema(schema);
    });
```
