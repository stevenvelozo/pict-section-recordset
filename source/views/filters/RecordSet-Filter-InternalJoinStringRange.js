
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringRange =
{
	ViewIdentifier: 'PRSP-FilterType-InternalJoinStringRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-StringRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-StringRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-StringRange-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinStringRange extends ViewRecordSetSUBSETFilterBaseRange
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-InternalJoin-StringRange-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinStringRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinStringRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringRange);
