
const FilterClauseInternalJoin = require('pict/types/source/filters/FilterClauseInternalJoin');
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

class ViewRecordSetSUBSETFilterInternalJoinDateRange extends ViewRecordSetSUBSETFilterBase
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
			/** @type {FilterClauseInternalJoin} */
			this.filter = this.addFilterClauseType('InternalJoinDateRange');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinDateRange;

