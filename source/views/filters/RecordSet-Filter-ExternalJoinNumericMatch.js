
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericMatch =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-NumericMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_NumericMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_NumericMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-NumericMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-NumericMatch-Template] -->
	{~MTIWHA:Date:Record.CriterionValueAddress:DateTime~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-NumericMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_NumericMatch',
			TemplateHash: 'PRSP-Filter-ExternalJoin-NumericMatch-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_NumericMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinNumericMatch extends ViewRecordSetSUBSETFilterBase
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
			/** @type {import('pict/types/source/filters/FilterClauseExternalJoin')} */
			//this.filter = this.addFilterClauseType('ExternalJoinNumericMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinNumericMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinNumericMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_NumericMatch);
