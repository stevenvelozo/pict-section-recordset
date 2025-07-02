
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_StringRange =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-StringRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_StringRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_StringRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-StringRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-StringRange-Template] -->
	{~MTIWHA:Start Value:Record.StartCriterionAddress:String~}
	{~MTIWHA:End Value:Record.EndCriterionAddress:String~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-StringRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_StringRange',
			TemplateHash: 'PRSP-Filter-ExternalJoin-StringRange-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_StringRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinStringRange extends ViewRecordSetSUBSETFilterBase
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
			//this.filter = this.addFilterClauseType('ExternalJoinStringRange');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinStringRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinStringRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_StringRange);
