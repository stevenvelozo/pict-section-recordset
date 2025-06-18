
const FilterClauseExternalJoin = require('pict/types/source/filters/FilterClauseExternalJoin');
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

class ViewRecordSetSUBSETFilterExternalJoinDateMatch extends ViewRecordSetSUBSETFilterBase
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
			/** @type {FilterClauseExternalJoin} */
			this.filter = this.addFilterClauseType('ExternalJoinDateMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinDateMatch;

