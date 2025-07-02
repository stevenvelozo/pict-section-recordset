
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base.js');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_ExternalJoinStringMatch =
{
	ViewIdentifier: 'PRSP-Filter-ExternalJoinStringMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_ExternalJoinStringMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_ExternalJoinStringMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-ExternalJoinStringMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-ExternalJoinStringMatch-Template] -->
	<!--FIXME: how to get the right label in here? -->
	{~MTIWHA:Value:Record.CriterionValueAddress:String~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-ExternalJoinStringMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_ExternalJoinStringMatch',
			TemplateHash: 'PRSP-Filter-ExternalJoinStringMatch-Template',
			DestinationAddress: '#PRSP_Filter_ExternalJoinStringMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterExternalJoinStringMatch extends ViewRecordSetSUBSETFilterBase
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
			//this.filter = this.addFilterClauseType('ExternalJoinStringMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterExternalJoinStringMatch;
module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterExternalJoinStringMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_ExternalJoinStringMatch);

