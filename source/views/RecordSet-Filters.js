const libPictView = require('pict-view');

/** @type {Record<string, any>} */
const _DEFAULT_CONFIGURATION_SUBSET_Filter =
{
	ViewIdentifier: 'PRSP-SUBSET-Filters',

	DefaultRenderable: 'PRSP_Renderable_Filters',
	DefaultDestinationAddress: '#PRSP_Filters_Container',
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

	Templates:
	[
		{
			Hash: 'PRSP-SUBSET-Filters-Template',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filters-Template] -->
	<section id="PRSP_Filters_Container">
		<form id="PRSP_Filter_Form" onsubmit="_Pict.views['PRSP-Filters'].handleSearch(event, '{~D:Record.RecordSet~}', '{~D:Record.ViewContext~}'); return false;">
			{~T:PRSP-SUBSET-Filters-Template-Input-Fieldset~}
			<div id="PRSP_Filter_Instances">
				{~FIV:Record~}
			</div>
			{~T:PRSP-SUBSET-Filters-Template-Button-Fieldset~}
		</form>
	</section>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filters-Template] -->
`
		},
		{
			Hash: 'PRSP-SUBSET-Filters-Template-Input-Fieldset',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filters-Template-Input-Fieldset] -->
	<fieldset>
		<label for="filter">Filter:</label>
		<input type="text" name="filter">
	</fieldset>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filters-Template-Input-Fieldset] -->
`
		},
		{
			Hash: 'PRSP-SUBSET-Filters-Template-Button-Fieldset',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filters-Template-Button-Fieldset] -->
	<fieldset>
		<button type="button" id="PRSP_Filter_Button_Reset" onclick="_Pict.views['PRSP-Filters'].handleReset(event, '{~D:Record.RecordSet~}', '{~D:Record.ViewContext~}')">Reset</button>
		<button type="submit" id="PRSP_Filter_Button_Apply">Apply</button>
	</fieldset>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filters-Template-Button-Fieldset] -->
`
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PRSP_Renderable_Filters',
			TemplateHash: 'PRSP-SUBSET-Filters-Template',
			DestinationAddress: '#PRSP_Filters_Container',
			RenderMethod: 'replace'
		},
	],

	Manifests: {},
};

//FIXME: export this from PSF?
const libPictViewDynamicForm = require('pict-section-form/source/views/Pict-View-DynamicForm.js');

class ViewRecordSetSUBSETFilters extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_SUBSET_Filter, pOptions);
		super(pFable, tmpOptions, pServiceHash);
		/** @type {import('fable') & import('pict') & { PictSectionRecordSet: import('../Pict-Section-RecordSet.js') }} */
		this.pict;

		const tmpDynamicInputViewSection = (
		{
			"Hash": "PSRSDynamicInputs",
			"Name": "Custom Dynamic Inputs",
			"ViewHash": "PSRSFilterProxyView",

			"AutoMarshalDataOnSolve": true,
			"IncludeInMetatemplateSectionGeneration": false,

			"Manifests": {
				"Section": {
					"Scope": "PSRSDynamic",
					"Sections": [
						{
							"Hash": "PSRSDynamicInputs",
							"Name": "Dynamic Inputs"
						}
					],
					"Descriptors": {
						"PSRS.DynamicInputPlaceholder": {
							"Name": "DynamicInputPlaceholder",
							"Hash": "DynamicInputPlaceholder",
							"DataType": "String",
							"Macro": {
								"HTMLSelector": ""
							},
							"PictForm": {
								"Section": "PSRSDynamicInputs"
							}
						}
					}
				}
			}
		});
		if (!this.pict.views[tmpDynamicInputViewSection.ViewHash])
		{
			const tmpViewConfiguration = Object.assign({}, tmpDynamicInputViewSection);
			this.pict.addView(tmpViewConfiguration.ViewHash, tmpViewConfiguration, libPictViewDynamicForm);
			this.pict.views[tmpDynamicInputViewSection.ViewHash].viewMarshalDestination = 'Bundle';
		}
	}

	//NOTE: two methods below copied from the pict-section-form metacontroller
	//TODO: consider subclassing the dynamic view to somehow mark these as filter views so we can only operate on those views

	/**
	 * Marshals data from the view to the model, usually AppData (or configured data store).
	 *
	 * @returns {any} The result of the superclass's onMarshalFromView method.
	 */
	onMarshalFromView()
	{
		let tmpViewList = Object.keys(this.fable.views);
		for (let i = 0; i < tmpViewList.length; i++)
		{
			if (this.fable.views[tmpViewList[i]].isPictSectionForm)
			{
				this.fable.views[tmpViewList[i]].marshalFromView();
			}
		}
		return super.onMarshalFromView();
	}

	/**
	 * Marshals the data to the view from the model, usually AppData (or configured data store).
	 *
	 * @returns {any} The result of the super.onMarshalToView() method.
	 */
	onMarshalToView()
	{
		let tmpViewList = Object.keys(this.fable.views);
		for (let i = 0; i < tmpViewList.length; i++)
		{
			if (this.fable.views[tmpViewList[i]].isPictSectionForm)
			{
				this.fable.views[tmpViewList[i]].marshalToView();
			}
		}
		return super.onMarshalToView();
	}

	/**
	 * @param {Event} pEvent - The DOM event that triggered the search
	 * @param {string} pRecordSet - The record set being filtered
	 * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
	 */
	handleSearch(pEvent, pRecordSet, pViewContext)
	{
		pEvent.preventDefault(); // don't submit the form
		pEvent.stopPropagation();
		const tmpSearchString = this.pict.ContentAssignment.readContent(`input[name="filter"]`);
		this.performSearch(pRecordSet, pViewContext, tmpSearchString ? String(tmpSearchString) : '');
	}

	/**
	 * @param {string} pRecordSet - The record set being filtered
	 * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
	 * @param {string} [pFilterString] - The filter string to apply, defaults to a single space if not provided
	 */
	performSearch(pRecordSet, pViewContext, pFilterString)
	{
		const tmpPictRouter = this.pict.providers.PictRouter;
		const tmpProviderConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations[pRecordSet];
		let filterExpr = '';
		if (pFilterString)
		{
			/** @type {Array<string>} */
			const searchFields = tmpProviderConfiguration?.SearchFields ?? [ 'Name' ];
			filterExpr = searchFields.map((filterField) => `FBVOR~${filterField}~LK~${encodeURIComponent(`%${pFilterString}%`)}`).join('~');
		}
		let tmpURLTemplate = tmpProviderConfiguration[`RecordSetFilterURLTemplate-${pViewContext}`] || tmpProviderConfiguration[`RecordSetFilterURLTemplate-Default`];
		if (!tmpURLTemplate)
		{
			if (pViewContext === 'Dashboard' || pViewContext === 'List')
			{
				tmpURLTemplate = `/PSRS/${pRecordSet}/${pViewContext}/FilteredTo/{~D:Record.FilterString~}`;
			}
		}
		let tmpURL;
		if (tmpURLTemplate)
		{
			tmpURL = this.pict.parseTemplate(tmpURLTemplate,
				{
					RecordSet: pRecordSet,
					FilterString: filterExpr,
				});
		}
		else
		{
			tmpURL = `/PSRS/${pRecordSet}/List/FilteredTo/${filterExpr}`;
		}
		if (tmpURL.endsWith('FilteredTo/') || tmpURL.includes('FilteredTo//'))
		{
			tmpURL = tmpURL.replace(/\/FilteredTo\//, '');
		}
		const tmpFilterExperienceSerialized = this.serializeFilterExperience(this.pict.Bundle._Filters[pRecordSet]?.Criteria);
		if (tmpFilterExperienceSerialized)
		{
			tmpURL += `/FilterExperience/${encodeURIComponent(tmpFilterExperienceSerialized)}`;
		}
		//FIXME: this doesn't force a re-render if other filters have changes, but aren't in the URL - so we either need to put them in the URL, or force a re-render based on the filter states
		tmpPictRouter.router.navigate(tmpURL);
	}

	/**
	 * @param {Event} pEvent - The DOM event that triggered the search
	 * @param {string} pRecordSet - The record set being filtered
	 * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
	 */
	handleReset(pEvent, pRecordSet, pViewContext)
	{
		pEvent.preventDefault();
		this.pict.ContentAssignment.assignContent('input[name="filter"]', '');
		this.performSearch(pRecordSet, pViewContext);
	}

	/**
	 * Lifecycle hook that triggers after the view is rendered.
	 *
	 * @param {import('pict-view').Renderable} pRenderable - The renderable that was rendered.
	 * @param {string} pRenderDestinationAddress - The address where the renderable was rendered.
	 * @param {any} pRecord - The record (data) that was used by the renderable.
	 * @param {string} pContent - The content that was rendered.
	 */
	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		//FIXME: since this is rendering to the DOM indirectly, can't marshal right after render; need to fix this better, if this even works
		setTimeout(() =>
		{
			this.onMarshalToView();
		}, 1);
		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}

	/**
	 * Lifecycle hook that triggers after the view is rendered (async flow).
	 *
	 * @param {import('pict-view').ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */
	onAfterRenderAsync(fCallback)
	{
		return super.onAfterRenderAsync((pError) =>
		{
			//FIXME: since this is rendering to the DOM indirectly, can't marshal right after render; need to fix this better, if this even works
			setTimeout(() =>
			{
				this.onMarshalToView();
			}, 1);
			fCallback(pError);
		});
	}

	serializeFilterExperience(pExperience)
	{
		for (const tmpClause of pExperience)
		{
			//FIXME: hack because scalar not always supported
			if (typeof tmpClause.Value !== undefined && !tmpClause.Type.includes('Range'))
			{
				tmpClause.Values = [ tmpClause.Value ];
			}
		}
		if (!pExperience || typeof pExperience !== 'object')
		{
			return '';
		}
		return JSON.stringify(pExperience);
	}

	deserializeFilterExperience(pExperience)
	{
		if (!pExperience || typeof pExperience !== 'string')
		{
			//TODO: if the default filters expand, how we wanna handle that?
			return null;
		}
		return JSON.parse(pExperience);
	}
}

module.exports = ViewRecordSetSUBSETFilters;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_SUBSET_Filter;

