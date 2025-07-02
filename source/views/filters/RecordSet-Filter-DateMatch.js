
const ViewRecordSetSUBSETFilterBase = require('./RecordSet-Filter-Base');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_Filter_DateMatch =
{
	ViewIdentifier: 'PRSP-Filter-DateMatch',

	DefaultRenderable: 'PRSP_Renderable_Filter_DateMatch',
	DefaultDestinationAddress: '#PRSP_Renderable_Filter_DateMatch',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-DateMatch-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-DateMatch-Template] -->
	{~MTIWHA:Date:Record.CriterionValueAddress:DateTime~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-DateMatch-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_DateMatch',
			TemplateHash: 'PRSP-Filter-DateMatch-Template',
			DestinationAddress: '#PRSP_Filter_DateMatch_Container',
			RenderMethod: 'replace'
		}
	],
};

class ViewRecordSetSUBSETFilterDateMatch extends ViewRecordSetSUBSETFilterBase
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
			//this.filter = this.addFilterClauseType('DateMatch');

			return fCallback(pError);
		});
	}
}

module.exports = ViewRecordSetSUBSETFilterDateMatch;

module.exports.default_configuration = Object.assign({}, ViewRecordSetSUBSETFilterDateMatch.default_configuration, _DEFAULT_CONFIGURATION_Filter_DateMatch);
