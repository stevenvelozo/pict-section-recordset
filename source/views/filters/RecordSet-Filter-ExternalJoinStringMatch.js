
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoinStringMatch =
{
	ViewIdentifier: 'PRSP-FilterType-ExternalJoinStringMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoinStringMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoinStringMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoinStringMatch-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinStringMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-ExternalJoinStringMatch-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinStringMatch;
module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinStringMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoinStringMatch);

