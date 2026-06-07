const ViewRecordSetSUBSETFilterEntityReferenceBase = require('./RecordSet-Filter-EntityReference-Base');

// Internal-join, single-select entity-reference filter. Shared base; entity seam = RemoteTable,
// single-select (replace, not append).
const _DEFAULT_CONFIGURATION =
{
	ViewIdentifier: 'PRSP-FilterType-InternalJoinSelectedValue',
};

class ViewRecordSetSUBSETFilterInternalJoinSelectedValue extends ViewRecordSetSUBSETFilterEntityReferenceBase
{
	getSearchEntity(pClause)
	{
		return pClause.RemoteTable;
	}

	isMultiSelect()
	{
		return false;
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinSelectedValue;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterEntityReferenceBase.default_configuration, _DEFAULT_CONFIGURATION);
