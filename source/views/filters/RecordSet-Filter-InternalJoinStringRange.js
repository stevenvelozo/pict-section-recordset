
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringRange =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-StringRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_InternalJoin_StringRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_InternalJoin_StringRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-StringRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-StringRange-Template] -->
	{~MTIWHA:Start Value:Record.StartCriterionAddress:String~}
	{~MTIWHA:End Value:Record.EndCriterionAddress:String~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-StringRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_InternalJoin_StringRange',
			TemplateHash: 'PRSP-Filter-InternalJoin-StringRange-Template',
			DestinationAddress: '#PRSP_Filter_InternalJoin_StringRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinStringRange extends ViewRecordSetSUBSETFilterBase
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
			/** @type {import('pict/types/source/filters/FilterClauseInternalJoin')} */
			//this.filter = this.addFilterClauseType('InternalJoinStringRange');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinStringRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinStringRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_StringRange);
