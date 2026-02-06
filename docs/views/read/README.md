# Read View

The Read view displays a single record and supports both viewing and editing modes.

## Overview

The Read view fetches and displays a single record by its GUID. It supports multiple layout types (Basic, Split, Tab) and can toggle between read-only viewing and edit mode for updating records.

## Routes

| Route | Description |
|-------|-------------|
| `/PSRS/:RecordSet/View/:GUIDRecord` | View a record (read-only) |
| `/PSRS/:RecordSet/Edit/:GUIDRecord` | Edit a record (editable form) |

## Layout Types

Configure the layout type in your record set configuration:

```javascript
const recordSetConfig = {
    RecordSet: 'User',
    ReadLayout: 'Basic'  // Options: 'Basic', 'Split', 'Tab'
};
```

### Basic Layout

Single column display of record fields with a button bar.

### Split Layout

Two-panel layout with record fields on the left and tabbed content on the right. Includes a draggable divider for resizing.

### Tab Layout

Tabbed interface where the main record is one tab among others.

## Configuration

```javascript
const recordSetConfig = {
    RecordSet: 'User',

    // Layout type
    ReadLayout: 'Split',

    // Use manifest-based display
    RecordSetReadManifestOnly: true,
    RecordSetReadDefaultManifestView: 'UserViewManifest',
    RecordSetReadDefaultManifestEdit: 'UserEditManifest',

    // Override read-only behavior in View mode
    RecordSetReadOverrideReadOnly: false,

    // Tab configuration (for Split/Tab layouts)
    RecordSetReadTabTitle: 'User Details',
    RecordSetReadTabs: [
        {
            Title: 'Activity',
            Hash: 'Activity',
            Type: 'View',
            View: 'UserActivityView'
        },
        {
            Title: 'Settings',
            Hash: 'Settings',
            Type: 'Manifest',
            Manifest: 'UserSettingsManifest'
        }
    ]
};
```

## Tab Types

### View Tab

Renders a registered Pict view:

```javascript
{
    Title: 'Activity Log',
    Hash: 'Activity',
    Type: 'View',
    View: 'UserActivityView'  // Must be registered with pict.addView()
}
```

### Manifest Tab

Renders a manifest-based form section:

```javascript
{
    Title: 'Profile',
    Hash: 'Profile',
    Type: 'Manifest',
    Manifest: 'UserProfileManifest'
}
```

### Attached Record Tab

Displays a related record from another record set:

```javascript
{
    Title: 'Organization',
    Hash: 'Organization',
    Type: 'AttachedRecord',
    RecordSet: 'Organization',
    JoinField: 'IDOrganization',
    // Optional: for indirect joins
    JoiningRecordSet: 'UserOrganization',
    BaseField: 'IDUser'
}
```

## View vs Edit Mode

In **View mode**, all form fields are rendered as read-only. In **Edit mode**, fields are editable based on their manifest configuration.

The button bar adapts to the current mode:
- View mode: Shows Edit button
- Edit mode: Shows Save and Cancel buttons

## Lifecycle Hooks

```javascript
class CustomReadView extends viewRecordSetRead {
    onBeforeRenderRead(pRecordReadData) {
        // Called before rendering, receives record data
        // Modify pRecordReadData.Record or pRecordReadData.DisplayFields
        return pRecordReadData;
    }

    async onBeforeEdit() {
        // Called when transitioning to edit mode
    }

    async onBeforeSave() {
        // Called before saving changes
        // Use for validation
    }

    async onBeforeView() {
        // Called when transitioning to view mode
    }

    async onBeforeTabChange() {
        // Called when switching between tabs
    }
}
```

## Button Bar Actions

| Button | Action | Method |
|--------|--------|--------|
| Edit | Switch to edit mode | `edit()` |
| Save | Save changes and return to view | `save()` |
| Cancel | Discard changes and return to view | `cancel()` |

## Templates

| Template Hash | Purpose |
|---------------|---------|
| `PRSP-Read-Basic-Template` | Basic layout container |
| `PRSP-Read-Split-Template` | Split layout container |
| `PRSP-Read-Tab-Template` | Tab layout container |
| `PRSP-Read-RecordRead-Template` | Record field display |
| `PRSP-Read-RecordRead-Template-Row` | Individual field row |
| `PRSP-Read-RecordButtonBar-Template` | Edit/Save/Cancel buttons |
| `PRSP-Read-RecordTab-Template` | Tab content container |
| `PRSP-Read-RecordTabNav-Template` | Tab navigation |

## Renderables

| Renderable Hash | Template | Use |
|-----------------|----------|-----|
| `PRSP_Renderable_Read_Basic` | Basic template | Single column layout |
| `PRSP_Renderable_Read_Split` | Split template | Two-panel layout |
| `PRSP_Renderable_Read_Tab` | Tab template | Tabbed layout |

## Example Usage

```javascript
// Navigate to view a record
pict.providers.RecordSetRouter.pictRouter.navigate('/PSRS/User/View/abc-123-def');

// Navigate to edit a record
pict.providers.RecordSetRouter.pictRouter.navigate('/PSRS/User/Edit/abc-123-def');

// Access the read view
const readView = pict.views['RSP-RecordSet-Read'];

// Switch modes programmatically
await readView.edit();  // To edit mode
await readView.save();  // Save and return to view
await readView.cancel(); // Cancel and return to view

// Switch tabs
readView.setTab('Activity');
```

## Updating Records

When in edit mode and the user clicks Save:

1. `onBeforeSave()` hook is called
2. The provider's `updateRecord()` method is called with form data
3. `onBeforeView()` hook is called
4. Navigation returns to view mode

The record data is stored at `pict.AppData['{RecordSet}Details']`.
