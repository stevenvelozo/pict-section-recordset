# Create View

The Create view provides a form interface for creating new records in a record set.

## Overview

The Create view automatically generates a form based on your record schema or a custom manifest. It handles form rendering, validation, and record submission through the configured record provider.

## Routes

| Route | Description |
|-------|-------------|
| `/PSRS/:RecordSet/Create` | Opens the create form for the specified record set |

## Configuration

Configure the Create view in your record set provider configuration:

```javascript
const recordSetConfig = {
    RecordSet: 'User',

    // Use manifest-based form (recommended for custom layouts)
    RecordSetCreateManifestOnly: true,
    RecordSetCreateDefaultManifest: 'UserCreateForm',
    RecordSetCreateManifests: ['UserCreateForm', 'UserQuickCreate'],

    // Or let the view auto-generate from schema
    RecordSetCreateManifestOnly: false
};
```

## Manifest Configuration

When using `RecordSetCreateManifestOnly: true`, provide a manifest that defines the form structure:

```javascript
const createManifest = {
    Form: 'UserCreateForm',
    Scope: 'UserDetails',
    Descriptors: {
        'UserDetails.Name': {
            Name: 'Full Name',
            Hash: 'User-Name',
            DataType: 'String',
            PictForm: {
                Row: '1',
                Section: 'BasicInfo',
                Group: 'NameGroup'
            }
        },
        'UserDetails.Email': {
            Name: 'Email Address',
            Hash: 'User-Email',
            DataType: 'String',
            PictForm: {
                Row: '2',
                Section: 'BasicInfo',
                Group: 'ContactGroup',
                InputType: 'Email'
            }
        }
    },
    Sections: [
        {
            Name: 'Basic Information',
            Hash: 'BasicInfo',
            ShowTitle: true,
            Groups: [
                {
                    Name: 'Name',
                    Hash: 'NameGroup',
                    Rows: [],
                    ShowTitle: false
                },
                {
                    Name: 'Contact',
                    Hash: 'ContactGroup',
                    Rows: [],
                    ShowTitle: true
                }
            ]
        }
    ]
};
```

## Auto-Generated Forms

When `RecordSetCreateManifestOnly` is `false` (or not set), the Create view automatically generates a form from the record schema. The following fields are excluded by default:

- ID field (e.g., `IDUser`)
- GUID field (e.g., `GUIDUser`)
- `CreatingIDUser`
- `UpdatingIDUser`
- `DeletingIDUser`
- `Deleted`
- `CreateDate`
- `UpdateDate`
- `DeleteDate`

## Data Type Mapping

Schema types are mapped to form input types:

| Schema Type | Form DataType | Input Type |
|-------------|---------------|------------|
| `string`, `autoguid` | String | Text |
| `datetime`, `date` | String | DateTime |
| `boolean`, `deleted` | Boolean | Checkbox |
| `integer`, `decimal` | Number | Number |

## Lifecycle Hooks

Override these methods in a custom view class to add behavior:

```javascript
class CustomCreateView extends viewRecordSetCreate {
    async onBeforeRenderCreate(pRecordConfiguration, pProviderHash) {
        // Called before rendering the form
        // Use for pre-population or validation setup
    }

    async onBeforeClear() {
        // Called before clearing the form
        // Use for confirmation dialogs
    }

    async onBeforeSave() {
        // Called before saving the record
        // Use for validation or data transformation
    }
}
```

## Button Bar

The default button bar includes:

- **Clear** - Resets the form to empty state
- **Save** - Creates the record via the provider's `createRecord` method

After successful save, the view navigates to the Read view for the new record.

## Templates

The Create view uses these templates:

| Template Hash | Purpose |
|---------------|---------|
| `PRSP-Create-Basic-Template` | Main container template |
| `PRSP-Create-RecordButtonBar-Template` | Save/Clear button bar |
| `PRSP-Create-Link-Name-Template` | Link text for navigation |
| `PRSP-Create-Link-URL-Template` | Link URL pattern |

## Customizing Templates

Override templates by adding them before initialization:

```javascript
pict.TemplateProvider.addTemplate('PRSP-Create-RecordButtonBar-Template', /*html*/`
    <div class="my-button-bar">
        <button onclick="_Pict.views['RSP-RecordSet-Create'].clear()">Reset</button>
        <button onclick="_Pict.views['RSP-RecordSet-Create'].save()">Create User</button>
        <button onclick="window.history.back()">Cancel</button>
    </div>
`);
```

## Example Usage

```javascript
// Navigate to create form programmatically
pict.providers.RecordSetRouter.pictRouter.navigate('/PSRS/User/Create');

// Access the create view
const createView = pict.views['RSP-RecordSet-Create'];

// Manually trigger save
await createView.save();
```
