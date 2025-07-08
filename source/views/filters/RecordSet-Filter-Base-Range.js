
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

class ViewRecordSetSUBSETFilterBaseRange extends ViewRecordSetSUBSETFilterBase
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

		pRecord.StartCriterionAddress = pRecord.CriterionValuesAddress + '.Start';
		pRecord.EndCriterionAddress = pRecord.CriterionValuesAddress + '.End';

		pRecord.StartCriterionDescriptor =
		{
			Address: pRecord.StartCriterionAddress,
			//TODO: figure out a nice pattern for extracting a name for the field from the filter - and allow the filter author to provide the label here
			Name: pRecord.MinimumLabel || `Minimum ${pRecord.ExternalFilterByColumn || pRecord.ExternalFilterByColumns?.[0] || pRecord.FilterByColumn || pRecord.FilterByColumns?.[0] || 'Value'}`,
			DataType: 'String',
		};

		pRecord.EndCriterionDescriptor =
		{
			Address: pRecord.EndCriterionAddress,
			Name: pRecord.MaximumLabel || `Maximum ${pRecord.ExternalFilterByColumn || pRecord.ExternalFilterByColumns?.[0] || pRecord.FilterByColumn || pRecord.FilterByColumns?.[0] || 'Value'}`,
			DataType: 'String',
		};
	}
}

module.exports = ViewRecordSetSUBSETFilterBaseRange;
