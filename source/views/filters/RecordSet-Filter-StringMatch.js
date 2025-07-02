
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_StringMatch =
{
	ViewIdentifier: 'PRSP-Filter-StringMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_StringMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_StringMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-StringMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-StringMatch-Template] -->
	{~MTIWHA:Value:Record.CriterionValueAddress:String~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-StringMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_StringMatch',
			TemplateHash: 'PRSP-Filter-StringMatch-Template',
			DestinationAddress: '#PRSP_Filter_StringMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterStringMatch extends ViewRecordSetSUBSETFilterBase
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
			//this.filter = this.addFilterClauseType('StringMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterStringMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterStringMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_StringMatch);
