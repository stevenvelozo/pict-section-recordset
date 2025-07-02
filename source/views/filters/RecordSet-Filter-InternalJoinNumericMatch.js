
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericMatch =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-NumericMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_InternalJoin_NumericMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_InternalJoin_NumericMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-NumericMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-NumericMatch-Template] -->
	{~MTIWHA:Value:Record.CriterionValueAddress:Number~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-NumericMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_InternalJoin_NumericMatch',
			TemplateHash: 'PRSP-Filter-InternalJoin-NumericMatch-Template',
			DestinationAddress: '#PRSP_Filter_InternalJoin_NumericMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinNumericMatch extends ViewRecordSetSUBSETFilterBase
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
			/** @type {import('pict/types/source/filters/FilterClauseInternalJoin')} */
			//this.filter = this.addFilterClauseType('InternalJoinNumericMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinNumericMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinNumericMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_NumericMatch);
