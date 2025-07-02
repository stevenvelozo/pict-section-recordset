
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateMatch =
{
	ViewIdentifier: 'PRSP-Filter-InternalJoin-DateMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_InternalJoin_DateMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_InternalJoin_DateMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-InternalJoin-DateMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-InternalJoin-DateMatch-Template] -->
	{~MTIWHA:Date:Record.CriterionValueAddress:DateTime~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-InternalJoin-DateMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_InternalJoin_DateMatch',
			TemplateHash: 'PRSP-Filter-InternalJoin-DateMatch-Template',
			DestinationAddress: '#PRSP_Filter_InternalJoin_DateMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterInternalJoinDateMatch extends ViewRecordSetSUBSETFilterBase
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
			//this.filter = this.addFilterClauseType('InternalJoinDateMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterInternalJoinDateMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterInternalJoinDateMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_InternalJoin_DateMatch);
