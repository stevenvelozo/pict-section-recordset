
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateMatch =
{
	ViewIdentifier: 'PRSP-FilterType-ExternalJoinDateMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-DateMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-DateMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-DateMatch-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinDateMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * Hook to prepare state on the render record before rendering.
	 *
	 * @param {Record<string, any>} pRecord - The record used for view rendering.
	 */
	prepareRecord(pRecord)
	{
		pRecord.ClauseDescriptor.DataType = 'DateTime';
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-ExternalJoin-DateMatch-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinDateMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinDateMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateMatch);
