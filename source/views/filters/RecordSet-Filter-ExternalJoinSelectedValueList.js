const ViewRecordSetSUBSETFilterEntityReferenceBase = require('./RecordSet-Filter-EntityReference-Base');

// External-join (through a junction table), multi-select entity-reference filter. Shared base;
// entity seam = ExternalFilterByTable.
const _DEFAULT_CONFIGURATION =
{
	ViewIdentifier: 'PRSP-FilterType-ExternalJoinSelectedValueList',
};

class ViewRecordSetSUBSETFilterExternalJoinSelectedValueList extends ViewRecordSetSUBSETFilterEntityReferenceBase
{
	getSearchEntity(pClause)
	{
		return pClause.ExternalFilterByTable;
	}

	isMultiSelect()
	{
		return true;
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinSelectedValueList;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterEntityReferenceBase.default_configuration, _DEFAULT_CONFIGURATION);
