
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_StringRange =
{
	ViewIdentifier: 'PRSP-Filter-StringRange',

	DefaultRenderable: 'PRSP_Renderable_Filter_StringRange',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_StringRange',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-StringRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-StringRange-Template] -->
	{~MTIWHA:Start Value:Record.StartCriterionAddress:String~}
	{~MTIWHA:End Value:Record.EndCriterionAddress:String~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-StringRange-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_StringRange',
			TemplateHash: 'PRSP-Filter-StringRange-Template',
			DestinationAddress: '#PRSP_Filter_StringRange_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterStringRange extends ViewRecordSetSUBSETFilterBase
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
			/** @type {import('pict/types/source/filters/FilterClauseLocal')} */
			//this.filter = this.addFilterClauseType('StringRange');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterStringRange;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterStringRange.default_configuration, _DEFAULT_CONFIGURATION_Filter_StringRange);
