# Pict-Section-RecordSet

> Dynamic record set management views with CRUD operations

Pict-Section-RecordSet provides automatic CRUD (Create, Read, Update, Delete) views for managing record sets in Pict applications. Built on top of pict-section-form, it offers list views, detail views, filtering, pagination, and seamless integration with Meadow API endpoints.

## Features

- **Automatic CRUD Views** - List, detail, create, and edit views generated from configuration
- **Built-in Filtering** - Configurable filter controls with various input types
- **Pagination Support** - Navigate large record sets with configurable page sizes
- **Meadow Integration** - Native support for Meadow REST API endpoints
- **Faceted Search** - Search with facets for filtering by field values and ranges
- **Custom Providers** - Extensible provider system for any data source
- **Router Integration** - Built-in routing for navigation between views

## Quick Start

```javascript
const libPictRecordSet = require('pict-section-recordset');

// Create a record set application
const app = new libPictRecordSet.PictRecordSetApplication(pict, {
    Name: 'User Management',
    Hash: 'UserManagement',
    pict_configuration: {
        Product: 'UserManager'
    }
});

// Initialize the application
app.initialize();
```

## Installation

```bash
npm install pict-section-recordset
```

## Core Concepts

### Record Providers

Record providers handle data fetching, creating, updating, and deleting. The package includes:

- **RecordSetProviderBase** - Base class for custom providers
- **RecordSetProviderMeadowEndpoints** - Provider for Meadow REST APIs

### Views

The package provides several view types:

- **List View** - Displays records in a table with sorting and pagination
- **Detail View** - Shows a single record with all fields
- **Create View** - Form for creating new records
- **Edit View** - Form for editing existing records
- **Dashboard View** - Overview with statistics and quick actions

### Filters

Filters allow users to narrow down record sets. Filter types include text search, date ranges, select dropdowns, and custom filter controls.

## Documentation

- [Record Providers](record-providers.md) - Creating and configuring data providers
- [Filters](filters.md) - Configuring filter controls
- [API Reference](api-reference.md) - Complete API documentation

## Related Packages

- [pict](https://github.com/stevenvelozo/pict) - Core Pict framework
- [pict-section-form](https://github.com/stevenvelozo/pict-section-form) - Dynamic forms framework
- [pict-application](https://github.com/stevenvelozo/pict-application) - Application base class
- [meadow](https://github.com/stevenvelozo/meadow) - REST API framework
- [fable](https://github.com/stevenvelozo/fable) - Service provider framework
