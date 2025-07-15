
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_StringMatch =
{
	ViewIdentifier: 'PRSP-Filter-StringMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-StringMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-StringMatch-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.ClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-StringMatch-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterStringMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-StringMatch-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterStringMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterStringMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_StringMatch);
