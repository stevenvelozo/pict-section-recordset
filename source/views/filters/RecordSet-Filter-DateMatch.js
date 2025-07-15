
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_DateMatch =
{
	ViewIdentifier: 'PRSP-Filter-DateMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-DateMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-DateMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-DateMatch-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterDateMatch extends ViewRecordSetSUBSETFilterBase
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
	//{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
		pRecord.ClauseDescriptor.DataType = 'DateTime';
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-DateMatch-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterDateMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterDateMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_DateMatch);
