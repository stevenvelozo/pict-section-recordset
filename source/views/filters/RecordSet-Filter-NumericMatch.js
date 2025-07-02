
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_NumericMatch =
{
	ViewIdentifier: 'PRSP-Filter-NumericMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_NumericMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_NumericMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-NumericMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-NumericMatch-Template] -->
	{~MTIWHA:Value:Record.CriterionValueAddress:Number~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-NumericMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_NumericMatch',
			TemplateHash: 'PRSP-Filter-NumericMatch-Template',
			DestinationAddress: '#PRSP_Filter_NumericMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

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
			/** @type {import('pict/types/source/filters/FilterClauseLocal')} */
			//this.filter = this.addFilterClauseType('NumericMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterNumericMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterNumericMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_NumericMatch);
