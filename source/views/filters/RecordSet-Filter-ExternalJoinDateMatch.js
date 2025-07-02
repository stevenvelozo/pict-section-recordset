
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateMatch =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoin-DateMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoin_DateMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoin_DateMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoin-DateMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoin-DateMatch-Template] -->
	{~MTIWHA:Date:Record.CriterionValueAddress:DateTime~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoin-DateMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoin_DateMatch',
			TemplateHash: 'PRSP-Filter-ExternalJoin-DateMatch-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoin_DateMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

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
			/** @type {import('pict/types/source/filters/FilterClauseExternalJoin')} */
			//this.filter = this.addFilterClauseType('ExternalJoinDateMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinDateMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinDateMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoin_DateMatch);
