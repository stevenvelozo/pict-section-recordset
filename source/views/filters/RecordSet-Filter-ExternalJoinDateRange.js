
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateRange =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-DateRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_DateRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_DateRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-DateRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-DateRange-Template] -->
	{~MTIWHA:Start Date:Record.StartCriterionAddress:DateTime~}
	{~MTIWHA:End Date:Record.EndCriterionAddress:DateTime~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-DateRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_DateRange',
			TemplateHash: 'PRSP-Filter-ExternalJoin-DateRange-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_DateRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinDateRange extends ViewRecordSetSUBSETFilterBase
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
			/** @type {import('pict/types/source/filters/FilterClauseExternalJoin')} */
			//this.filter = this.addFilterClauseType('ExternalJoinDateRange');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinDateRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinDateRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateRange);
