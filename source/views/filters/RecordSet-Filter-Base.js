const libPictView = require('pict-view');

const libFilterClauseLocal = require('pict').FilterClauseLocal;
const libFilterClauseInternalJoin = require('pict').FilterClauseInternalJoin;
const libFilterClauseExternalJoin = require('pict').FilterClauseExternalJoin;

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_SUBSET_Filter =
{
	ViewIdentifier: 'PRSP-SUBSET-Filter-Base',

	DefaultTemplateRecordAddress: false,

	// If this is set to true, when the App initializes this will.
	// While the App initializes, initialize will be called.
	AutoInitialize: false,
	AutoInitializeOrdinal: 0,

	// If this is set to true, when the App autorenders (on load) this will.
	// After the App initializes, render will be called.
	AutoRender: false,
	AutoRenderOrdinal: 0,

	AutoSolveWithApp: false,
	AutoSolveOrdinal: 0,

	CSS: false,
	CSSPriority: 500,

	Manifests: {},

	DefaultRenderable: 'PRSP_Renderable_Filter_Base',

	Templates:
	[
		{
			Hash: 'PRSP-Filter-DateRange-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-Filter-Base-Template] -->
	{~JD:Record~}
	<!-- DefaultPackage end view template:	[PRSP-Filter-Base-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filter_Base',
			TemplateHash: 'PRSP-Filter-Base-Template',
			DestinationAddress: '#PRSP_Filter_Base_Container',
			RenderMethod: 'replace',
		}
	],
};

class ViewRecordSetSUBSETFilterBase extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_SUBSET_Filter, pOptions);
		super(pFable, tmpOptions, pServiceHash);
		/** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, PictSectionRecordSet: import('../../Pict-Section-RecordSet.js') }} */
		this.pict;
	}

	/**
	 * Hook to prepare state on the render record before rendering.
	 *
	 * @param {Record<string, any>} pRecord - The record used for view rendering.
	 */
	prepareRecord(pRecord)
	{
		pRecord.CriterionValueAddress = pRecord.CriterionAddress + '.Value';
		pRecord.CriterionValuesAddress = pRecord.CriterionAddress + '.Values';
	}

	/*
	 * @param {import('pict/types/source/filters/Filter.js').FilterType} pType
	 * @param {string} [pColumnName]
	 *
	 * FIXME: figure out if we can resolve the string to type using JSDoc
	 * @return {any}
	addFilterClauseType(pType, pColumnName = '')
	{
		const tmpFilter = pType.startsWith('InternalJoin') ? new libFilterClauseInternalJoin(this.pict) :
			pType.startsWith('ExternalJoin') ? new libFilterClauseExternalJoin(this.pict) :
			new libFilterClauseLocal(this.pict);
		tmpFilter.type = pType;
		this.filterClauses.push(tmpFilter);
		if (tmpFilter instanceof libFilterClauseInternalJoin)
		{
			tmpFilter.joinInternalConnectionColumn = pColumnName;
			return tmpFilter;
		}
		if (tmpFilter instanceof libFilterClauseExternalJoin)
		{
			tmpFilter.coreConnectionColumn = pColumnName;
			return tmpFilter;
		}
		tmpFilter.filterByColumn = pColumnName;
		return tmpFilter;
	}

	 * @return {Array<import('pict/types/source/filters/FilterClauseBase.js').FilterClauseConfig>}
	serializeFilterClauses()
	{
		return this.filterClauses.map((clause) =>
		{
			return clause.generateFilterClauseConfig();
		});
	}
	 */
}

module.exports = ViewRecordSetSUBSETFilterBase;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_SUBSET_Filter;

