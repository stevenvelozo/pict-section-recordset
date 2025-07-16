
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_StringRange =
{
	ViewIdentifier: 'PRSP-FilterType-StringRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-StringRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-StringRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-StringRange-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterStringRange extends ViewRecordSetSUBSETFilterBaseRange
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-StringRange-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterStringRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterStringRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_StringRange);
