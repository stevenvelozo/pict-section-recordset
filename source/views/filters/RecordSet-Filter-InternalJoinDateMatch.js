
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateMatch =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-DateMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-DateMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-DateMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-DateMatch-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinDateMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * @param {Record<string, any>} pRecord
	 */
	prepareRecord(pRecord)
	{
		super.prepareRecord(pRecord);

		pRecord.ClauseDescriptor.DataType = 'DateTime';
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-InternalJoin-DateMatch-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinDateMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinDateMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateMatch);
