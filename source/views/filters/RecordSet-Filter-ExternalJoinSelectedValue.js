const ViewRecordSetSUBSETFilterEntityReferenceBase = require('./RecordSet-Filter-EntityReference-Base');

// External-join (through a junction table), single-select entity-reference filter. Shared base;
// entity seam = ExternalFilterByTable, single-select (replace, not append).
const _DEFAULT_CONFIGURATION =
{
	ViewIdentifier: 'PRSP-FilterType-ExternalJoinSelectedValue',
};

class ViewRecordSetSUBSETFilterExternalJoinSelectedValue extends ViewRecordSetSUBSETFilterEntityReferenceBase
{
	getSearchEntity(pClause)
	{
		return pClause.ExternalFilterByTable;
	}

	isMultiSelect()
	{
		return false;
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinSelectedValue;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterEntityReferenceBase.default_configuration, _DEFAULT_CONFIGURATION);
