
const ViewRecordSetSUBSETFilterBaseRange = require('./RecordSet-Filter-Base-Range.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_DateRange =
{
	ViewIdentifier: 'PRSP-FilterType-DateRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-DateRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-DateRange-Template] -->
	{~IWVDA:PSRSFilterProxyView:Record.StartClauseDescriptor~}
	{~IWVDA:PSRSFilterProxyView:Record.EndClauseDescriptor~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-DateRange-Template] -->
`
		}
	],
};

class ViewRecordSetSUBSETFilterDateRange extends ViewRecordSetSUBSETFilterBaseRange
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

		pRecord.StartClauseDescriptor.DataType = pRecord.DataType || 'DateTime';
		pRecord.StartClauseDescriptor.PictForm = pRecord.PictForm || {};
		pRecord.EndClauseDescriptor.DataType = pRecord.DataType || 'DateTime';
		pRecord.EndClauseDescriptor.PictForm = pRecord.PictForm || {};
	}

	/**
	 * FIXME: this be wrong
	 *
	 * @param {(error?: Error) => void} fCallback
	 * @return {void}
	 */
	onBeforeInitializeAsync(fCallback)
	{
		return super.onBeforeInitializeAsync((pError) =>
		{
			/** @type {import('pict/types/source/filters/FilterClauseLocal')} */
			//this.filter = this.addFilterClauseType('DateRange');

			return fCallback(pError);
		});
	}

	getFilterFormTemplate()
	{
		return 'PRSP-Filter-DateRange-Template';
	}
}

module.exports = ViewRecordSetSUBSETFilterDateRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterDateRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_DateRange);

