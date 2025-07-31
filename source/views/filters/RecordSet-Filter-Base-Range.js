
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

		pRecord.StartClauseAddress = pRecord.ClauseValuesAddress + '.Start';
		pRecord.EndClauseAddress = pRecord.ClauseValuesAddress + '.End';

		pRecord.StartClauseDescriptor =
		{
			Hash: this.fable.DataFormat.sanitizeObjectKey(`${pRecord.StartClauseAddress}_${this.constructor.name}`),
			Address: pRecord.StartClauseAddress,
			//TODO: figure out a nice pattern for extracting a name for the field from the filter - and allow the filter author to provide the label here
			Name: pRecord.MinimumLabel || `Minimum ${pRecord.ExternalFilterByColumn || pRecord.ExternalFilterByColumns?.[0] || pRecord.FilterByColumn || pRecord.FilterByColumns?.[0] || 'Value'}`,
			DataType: 'String',
		};

		pRecord.EndClauseDescriptor =
		{
			Hash: this.fable.DataFormat.sanitizeObjectKey(`${pRecord.EndClauseAddress}_${this.constructor.name}`),
			Address: pRecord.EndClauseAddress,
			Name: pRecord.MaximumLabel || `Maximum ${pRecord.ExternalFilterByColumn || pRecord.ExternalFilterByColumns?.[0] || pRecord.FilterByColumn || pRecord.FilterByColumns?.[0] || 'Value'}`,
			DataType: 'String',
		};
	}
}

module.exports = ViewRecordSetSUBSETFilterBaseRange;
