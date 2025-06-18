
const FilterClauseLocal = require('pict/types/source/filters/FilterClauseLocal');
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

class ViewRecordSetSUBSETFilterNumericMatch extends ViewRecordSetSUBSETFilterBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * NOTE: example of a subclass setting up filters for that specific filter type: should not be here in the bas class.
	 *
	 * @param {(error?: Error) => void} fCallback
	 * @return {void}
	 */
	onBeforeInitializeAsync(fCallback)
	{
		return super.onBeforeInitializeAsync((pError) =>
		{
			/** @type {FilterClauseLocal} */
			this.filter = this.addFilterClauseType('NumericMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterNumericMatch;

