const ViewRecordSetSUBSETFilterEntityReferenceBase = require('./RecordSet-Filter-EntityReference-Base');

// Internal-join, multi-select entity-reference filter. All behavior lives in the shared base; this
// only names the view type and points the entity seam at RemoteTable.
const _DEFAULT_CONFIGURATION =
{
	ViewIdentifier: 'PRSP-FilterType-InternalJoinSelectedValueList',
};

class ViewRecordSetSUBSETFilterInternalJoinSelectedValueList extends ViewRecordSetSUBSETFilterEntityReferenceBase
{
	getSearchEntity(pClause)
	{
		return pClause.RemoteTable;
	}

	isMultiSelect()
	{
		return true;
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinSelectedValueList;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterEntityReferenceBase.default_configuration, _DEFAULT_CONFIGURATION);
