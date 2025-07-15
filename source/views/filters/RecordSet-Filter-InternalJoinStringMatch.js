
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringMatch =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-StringMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-StringMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-StringMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-StringMatch-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinStringMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-InternalJoin-StringMatch-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinStringMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinStringMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringMatch);
