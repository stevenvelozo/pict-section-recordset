
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericRange =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-NumericRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_NumericRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_NumericRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-NumericRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-NumericRange-Template] -->
	{~MTIWHA:Start Value:Record.StartCriterionAddress:Number~}
	{~MTIWHA:End Value:Record.EndCriterionAddress:Number~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-NumericRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_NumericRange',
			TemplateHash: 'PRSP-Filter-ExternalJoin-NumericRange-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_NumericRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinNumericRange extends ViewRecordSetSUBSETFilterBase
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
			//this.filter = this.addFilterClauseType('ExternalJoinNumericRange');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinNumericRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinNumericRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericRange);
