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
	<form id="PRSP_Filter_Form" onsubmit="_Pict.views['PRSP-Filters'].handleSearch(event, '{~D:Record.RecordSet~}', '{~D:Record.ViewContext~}'); return false;">
		{~T:PRSP-SUBSET-Filters-Template-Input-Fieldset~}
		<div id="PRSP_Filter_Instances">
			{~FIV:Record~}
		</div>
		{~T:PRSP-SUBSET-Filters-Template-Button-Fieldset~}
		{~T:PRSP-SUBSET-Filters-Template-AddFilter-Fieldset~}
		{~T:PRSP-SUBSET-Filters-Template-ManageFilters-Fieldset~}
	</form>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filters-Template] -->
`
		},
		{
			Hash: 'PRSP-SUBSET-Filters-Template-Input-Fieldset',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filters-Template-Input-Fieldset] -->
	<fieldset>
		<label for="search_filter">Filter:</label>
		<input id="search_filter" type="text" name="filter">
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
		{
			Hash: 'PRSP-SUBSET-Filters-Template-ManageFilters-Fieldset',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filters-Template-ManageFilters-Fieldset] -->
	<fieldset>
		<button type="button" id="PRSP_Filter_Button_Manage" onclick="_Pict.views['PRSP-Filters'].handleManage(event, '{~D:Record.RecordSet~}', '{~D:Record.ViewContext~}')">Manage Filters</button>
		<div id="FilterPersistenceView-Container"></div>
	</fieldset>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filters-Template-ManageFilters-Fieldset] -->
`
		},
		{
			Hash: 'PRSP-SUBSET-Filters-Template-AddFilter-Fieldset',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filters-Template-AddFilter-Fieldset] -->
	<fieldset>
		<button type="button" id="PRSP_Filter_Button_Add" onclick="_Pict.views['PRSP-Filters'].selectFilterToAdd(event, '{~D:Record.RecordSet~}', '{~D:Record.ViewContext~}')">+</button>
		<div id="PRSP-SUBSET-Filters-Template-AddFilter-Dropdown"></div>
	</fieldset>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filters-Template-AddFilter-Fieldset] -->
`
		},
		{
			Hash: 'PRSP-SUBSET-Filters-Template-AddFilter-Dropdown',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filters-Template-AddFilter-Dropdown] -->
	<div>
		<select id="PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-Select" data-i-view-context="{~D:Record.ViewContext~}" onchange="event.preventDefault(); _Pict.views['PRSP-Filters'].render('PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown', undefined,
		{
			ViewContext: '{~D:Record.ViewContext~}',
			RecordSet: event.target.querySelector('option:checked').getAttribute('data-i-recordset'),
			FilterKey: event.target.querySelector('option:checked').getAttribute('data-i-filter-key'),
			AvailableClauses: _Pict.providers[\`RSP-Provider-\${event.target.querySelector('option:checked').getAttribute('data-i-recordset')}\`].getFilterClauseSchemaForKey(event.target.querySelector('option:checked').getAttribute('data-i-filter-key')).AvailableClauses,
		});">
			{~TS:PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-Entry:Scope.getFilterSchema()~}
		</select>
		<div id="PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown">
		</div>
	</div>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filters-Template-AddFilter-Dropdown] -->
`
		},
		{
			Hash: 'PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown] -->
	<select id="PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown-Select">
		{~TS:PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-Entry:Record.AvailableClauses~}
	</select>
	<button type="button" id="PRSP_Filter_Button_ConfirmAdd" onclick="_Pict.views['PRSP-Filters'].addFilter(event, '{~D:Record.RecordSet~}', '{~D:Record.ViewContext~}',
		document.getElementById('PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown').querySelector('option:checked').getAttribute('data-i-filter-key'),
		document.getElementById('PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown').querySelector('option:checked').getAttribute('data-i-clause-key'),
	)">Add Filter</button>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown] -->
`
		},
		{
			Hash: 'PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-Entry',
			Template: /*html*/`
	<!-- DefaultPackage pict view template: [PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-Entry] -->
	<option value="{~D:Record.FilterKey~}|{~D:Record.ClauseKey~}" data-i-recordset="{~D:Record.RecordSet~}" data-i-filter-key="{~D:Record.FilterKey~}" data-i-clause-key="{~D:Record.ClauseKey~}">
		{~D:Record.DisplayName~}
	</option>
	<!-- DefaultPackage end view template:	[PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-Entry] -->
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
		{
			RenderableHash: 'PRSP-SUBSET-Filters-Template-AddFilter-Dropdown',
			TemplateHash: 'PRSP-SUBSET-Filters-Template-AddFilter-Dropdown',
			ContentDestinationAddress: '#PRSP-SUBSET-Filters-Template-AddFilter-Dropdown',
			RenderMethod: 'replace',
		},
		{
			RenderableHash: 'PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown',
			TemplateHash: 'PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown',
			ContentDestinationAddress: '#PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown',
			RenderMethod: 'replace',
		},
	],

	Manifests: {},
};

//FIXME: export this from PSF?
const libPictViewDynamicForm = require('pict-section-form/source/views/Pict-View-DynamicForm.js');

const DynamicInputViewSectionDefinition = (
{
	"Hash": "PSRSDynamicInputs",
	"Name": "Custom Dynamic Inputs",
	"ViewHash": "PSRSFilterProxyView",

	"AutoMarshalDataOnSolve": true,
	"IncludeInMetatemplateSectionGeneration": false,

	"Manifests":
	{
		"Section":
		{
			"Scope": "PSRSDynamic",
			"Sections":
			[
				{
					"Hash": "PSRSDynamicInputs",
					"Name": "Dynamic Inputs"
				}
			],
			"Descriptors":
			{
				"PSRS.DynamicInputPlaceholder":
				{
					"Name": "DynamicInputPlaceholder",
					"Hash": "DynamicInputPlaceholder",
					"DataType": "String",
					"Macro":
					{
						"HTMLSelector": ""
					},
					"PictForm":
					{
						"Section": "PSRSDynamicInputs"
					}
				}
			}
		}
	}
});
class ViewRecordSetSUBSETFilters extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_SUBSET_Filter, pOptions);
		super(pFable, tmpOptions, pServiceHash);
		/** @type {import('fable') & import('pict') & { PictSectionRecordSet: import('../Pict-Section-RecordSet.js') }} */
		this.pict;

		if (!this.pict.views[DynamicInputViewSectionDefinition.ViewHash])
		{
			const tmpViewConfiguration = Object.assign({}, DynamicInputViewSectionDefinition);
			this.pict.addView(tmpViewConfiguration.ViewHash, tmpViewConfiguration, libPictViewDynamicForm);
			this.pict.views[DynamicInputViewSectionDefinition.ViewHash].viewMarshalDestination = 'Bundle';
		}
		for (const tmpView of Object.values(require('./filters')))
		{
			if (tmpView.default_configuration.ViewIdentifier && !this.pict.views[tmpView.default_configuration.ViewIdentifier])
			{
				this.pict.addView(tmpView.default_configuration.ViewIdentifier, {}, tmpView);
			}
		}
		this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		// Use a lookup table to find the index.
		this.lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
		for (let i = 0; i < this.chars.length; i++)
		{
			this.lookup[this.chars.charCodeAt(i)] = i;
		}
	}

	/**
	 * @return {string} - The marshalling prefix configured for filters. Usually 'Bundle.'
	 */
	getInformaryAddressPrefix()
	{
		return `${this.pict.views[DynamicInputViewSectionDefinition.ViewHash].viewMarshalDestination}.`;
	}

	/**
	 * @param {string} pAddress - The address of the informary to get the value from.
	 *
	 * @return {any} - The value at the given address, using the informary marshalling prefix.
	 */
	getInformaryScopedValue(pAddress)
	{
		const tmpCompositeAddress = `${this.getInformaryAddressPrefix()}${pAddress}`;
		return this.pict.resolveStateFromAddress(tmpCompositeAddress);
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
		//FIXME: store this filter string in the bundle so we can re-apply it on re-render
		const tmpSearchString = this.pict.ContentAssignment.readContent(`input[name="filter"]`);
		this.performSearch(pRecordSet, pViewContext, tmpSearchString ? String(tmpSearchString) : '');
		// TODO: Do we want to always set LATEST filter experience in local storage for persistence ON SEARCH or JUST MANAGE?
		//this.pict.providers.FilterDataProvider.saveFilterMeta(pRecordSet);
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
		this.render(undefined, undefined, { RecordSet: pRecordSet, ViewContext: pViewContext });
		this.serializeFilterExperience(this.pict.Bundle._ActiveFilterState[pRecordSet]?.FilterClauses).then((pFilterExperienceSerialized) =>
		{
			if (pFilterExperienceSerialized)
			{
				tmpURL += `/FilterExperience/${encodeURIComponent(pFilterExperienceSerialized)}`;
			}
			//FIXME: this doesn't force a re-render if other filters have changes, but aren't in the URL - so we either need to put them in the URL, or force a re-render based on the filter states
			tmpPictRouter.router.navigate(tmpURL);
		});
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
		const tmpFilterExperienceClauses = this.pict.Bundle._ActiveFilterState[pRecordSet]?.FilterClauses;
		if (Array.isArray(tmpFilterExperienceClauses))
		{
			for (const tmpClause of tmpFilterExperienceClauses)
			{
				delete tmpClause.Value;
				delete tmpClause.Values;
				delete tmpClause.SearchInputValue;
				delete tmpClause.SelectedValues;
				delete tmpClause.SearchResults;
				delete tmpClause.SearchResultsOffset;
				delete tmpClause.LoadMoreEnabled;
			}
		}
		this.performSearch(pRecordSet, pViewContext);
	}

	/**
	 * @param {Event} pEvent - The DOM event that triggered the search
	 * @param {string} pRecordSet - The record set being filtered
	 * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
	 * @returns {boolean} - Always returns false to prevent default action
	*/
	handleManage(pEvent, pRecordSet, pViewContext)
	{
		pEvent.preventDefault();
		this.pict.log.info(`Managing filters for record set: ${pRecordSet} in view context: ${pViewContext}`);
		this.pict.views.FilterPersistenceView.openFilterPersistenceUI(pRecordSet, pViewContext);
		return false;
	}

	/**
	 * @param {Event} pEvent - The DOM event that triggered the search
	 * @param {string} pRecordSet - The record set being filtered
	 * @param {string} pViewContext - The view context for the filter (ex. List, Dashboard)
	 */
	selectFilterToAdd(pEvent, pRecordSet, pViewContext)
	{
		pEvent.preventDefault();
		//const tmpRecordsetProvider = this.pict.providers['RSP-Provider-' + pRecordSet];
		//this.pict.log.info(`Selecting filter to add for record set: ${pRecordSet} in view context: ${pViewContext}`, tmpRecordsetProvider.getFilterSchema())
		this.renderWithScope(this.pict.providers[`RSP-Provider-${pRecordSet}`], 'PRSP-SUBSET-Filters-Template-AddFilter-Dropdown', undefined, { RecordSet: pRecordSet, ViewContext: pViewContext });
	}

	addFilter(pEvent, pRecordSet, pViewContext, pFilterKey, pClauseKey)
	{
		pEvent?.preventDefault();
		this.pict.log.info(`Adding filter: ${pFilterKey} with clause: ${pClauseKey} to record set: ${pRecordSet} in view context: ${pViewContext}`);
		this.pict.providers[`RSP-Provider-${pRecordSet}`].addFilterClause(pFilterKey, pClauseKey);
		//FIXME: we need the record from the original render here but no longer have it...
		this.render(undefined, undefined, { RecordSet: pRecordSet, ViewContext: pViewContext });
	}

	removeFilter(pEvent, pRecordSet, pViewContext, pSpecificFilterKey)
	{
		pEvent?.preventDefault();
		this.pict.log.info(`Removing filter: ${pSpecificFilterKey} from record set: ${pRecordSet} in view context: ${pViewContext}`);
		this.pict.providers[`RSP-Provider-${pRecordSet}`].removeFilterClause(pSpecificFilterKey);
		//FIXME: we need the record from the original render here but no longer have it...
		this.render(undefined, undefined, { RecordSet: pRecordSet, ViewContext: pViewContext });
	}

	getFilterSchema(pRecordSet)
	{
		const tmpRecordsetProvider = this.pict.providers['RSP-Provider-' + pRecordSet];
		return Object.values(tmpRecordsetProvider.getFilterSchema()).flatMap((pFilter) => pFilter.AvailableClauses || []);
	}

	/**
	 * Lifecycle hook that triggers after the view is rendered.
	 *
	 * @param {import('pict-view').Renderable} pRenderable - The renderable that was rendered.
	 */
	onAfterRender(pRenderable)
	{
		const res = super.onAfterRender(pRenderable);
		if (pRenderable?.RenderableHash === 'PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown')
		{
			return;
		}
		const tmpRecord = { };
		const tmpSelect = document.getElementById('PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-Select');
		if (tmpSelect)
		{
			const tmpActiveOption = document.getElementById('PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-Select')?.querySelector('option:checked')
			const tmpRecordSet = tmpActiveOption?.getAttribute('data-i-recordset');
			const tmpFilterKey = tmpActiveOption?.getAttribute('data-i-filter-key');
			const tmpViewContext = tmpSelect?.getAttribute('data-i-view-context');
			if (tmpRecordSet && tmpFilterKey)
			{
				const tmpProvider = this.pict.providers[`RSP-Provider-${tmpRecordSet}`];
				if (tmpProvider)
				{
					tmpRecord.RecordSet = tmpRecordSet;
					tmpRecord.FilterKey = tmpFilterKey;
					tmpRecord.ViewContext = tmpViewContext;
					tmpRecord.AvailableClauses = tmpProvider.getFilterClauseSchemaForKey(tmpFilterKey).AvailableClauses;
					if (Array.isArray(tmpRecord.AvailableClauses))
					{
						this.render('PRSP-SUBSET-Filters-Template-AddFilter-Dropdown-AddFilterClauseDropdown', undefined, tmpRecord, pRenderable);
					}
				}
			}
		}
		this.onMarshalToView();
		return res;
	}

	async serializeFilterExperience(pExperience)
	{
		if (!pExperience || typeof pExperience !== 'object')
		{
			return '';
		}
		const tmpExperience = JSON.parse(JSON.stringify(pExperience));
		for (const tmpClause of tmpExperience)
		{
			//FIXME: avoiding saving search results to the URL but this pattern isn't ideal
			delete tmpClause.SearchResults;
			delete tmpClause.SearchResultsOffset;
			delete tmpClause.LoadMoreEnabled;
		}
		return this.encode(await this.compress(JSON.stringify(tmpExperience)));
	}

	/**
	 * @param {string} pExperience - The serialized filter experience as a string.
	 *
	 * @return {Promise<Record<string, any>>} - The serialized filter experience as a string.
	 */
	async deserializeFilterExperience(pExperience)
	{
		if (!pExperience || typeof pExperience !== 'string')
		{
			//TODO: if the default filters expand, how we wanna handle that?
			return null;
		}
		return JSON.parse(await this.decompress(new Uint8Array(this.decode(pExperience))));
	}

	/**
	 * @param {string} string - The string to compress.
	 * @param {CompressionFormat} [encoding='gzip'] - The encoding to use for compression, defaults to 'gzip'.
	 *
	 * @return {Promise<ArrayBuffer>} - The compressed byte array.
	 */
	async compress(string, encoding = 'gzip')
	{
		const byteArray = new TextEncoder().encode(string);
		const cs = new CompressionStream(encoding);
		const writer = cs.writable.getWriter();
		writer.write(byteArray);
		writer.close();
		return new Response(cs.readable).arrayBuffer();
	}

	/**
	 * @param {Uint8Array} byteArray - The byte array to decompress.
	 * @param {CompressionFormat} [encoding='gzip'] - The encoding to use for compression, defaults to 'gzip'.
	 */
	async decompress(byteArray, encoding = 'gzip')
	{
		const cs = new DecompressionStream(encoding);
		const writer = cs.writable.getWriter();
		// @ts-ignore
		writer.write(byteArray);
		writer.close();
		return new Response(cs.readable).arrayBuffer().then((arrayBuffer) =>
		{
			return new TextDecoder().decode(arrayBuffer);
		});
	}

	/**
	 * @param {ArrayBuffer} arraybuffer - The ArrayBuffer to encode to Base64.
	 *
	 * @return {string} - The Base64 encoded string.
	 */
	encode(arraybuffer)
	{
		let bytes = new Uint8Array(arraybuffer),
			i,
			len = bytes.length,
			base64 = '';

		for (i = 0; i < len; i += 3)
		{
			base64 += this.chars[bytes[i] >> 2];
			base64 += this.chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
			base64 += this.chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
			base64 += this.chars[bytes[i + 2] & 63];
		}

		if (len % 3 === 2)
		{
			base64 = base64.substring(0, base64.length - 1) + '=';
		}
		else if (len % 3 === 1)
		{
			base64 = base64.substring(0, base64.length - 2) + '==';
		}

		return base64;
	};

	/**
	 * @param {string} base64 - The Base64 encoded string to decode to an ArrayBuffer.
	 *
	 * @return {ArrayBuffer} - The decoded ArrayBuffer.
	 */
	decode(base64)
	{
		let bufferLength = base64.length * 0.75,
			len = base64.length,
			i,
			p = 0,
			encoded1,
			encoded2,
			encoded3,
			encoded4;

		if (base64[base64.length - 1] === '=')
		{
			bufferLength--;
			if (base64[base64.length - 2] === '=')
			{
				bufferLength--;
			}
		}

		const arraybuffer = new ArrayBuffer(bufferLength),
			bytes = new Uint8Array(arraybuffer);

		for (i = 0; i < len; i += 4)
		{
			encoded1 = this.lookup[base64.charCodeAt(i)];
			encoded2 = this.lookup[base64.charCodeAt(i + 1)];
			encoded3 = this.lookup[base64.charCodeAt(i + 2)];
			encoded4 = this.lookup[base64.charCodeAt(i + 3)];

			bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
			bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
			bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
		}

		return arraybuffer;
	};
}

module.exports = ViewRecordSetSUBSETFilters;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_SUBSET_Filter;

