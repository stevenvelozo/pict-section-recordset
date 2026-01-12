const libPictView = require('pict-view');

const _DEFAULT_CONFIGURATION_FilterPersistenceView = (
{
	ViewIdentifier: 'FilterPersistenceView',

	DefaultRenderable: 'FilterPersistenceView-Container',
	DefaultDestinationAddress: '#FilterPersistenceView-Container',
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
			Hash: 'FilterPersistenceView-Container',
			Template: /*html*/`
<!-- DefaultPackage pict view template: [FilterPersistenceView-Container] -->
<div id="FilterPersistenceView-Content">
	<!-- Content for Filter Persistence View goes here -->
	<div id="FilterPersistenceView-Header">
		<h3>Filter Persistence Settings</h3>
	</div>
	<div id="FilterPersistenceView-Body">
		<div class="FilterPersistenceView-ActiveSettings">
			<label for="CurrentFilterName">Current Filter Set:</label>
			<input type="text" id="FilterPersistenceView-CurrentFilterNameInput" name="CurrentFilterName" value="" />
			<button type="button" onclick="_Pict.views['FilterPersistenceView'].saveFilterPersistenceSettings(event)">Save Filter</button>
			<button type="button" onclick="_Pict.views['FilterPersistenceView'].clearFilterPersistenceSettings(event)">Clear Filter</button>
		</div>
		<div class="FilterPersistenceView-StoredSettings">
			<label for="StoredFilterName">Stored Filter Sets:</label>
			<select id="FilterPersistenceView-StoredFiltersSelect" onchange="_Pict.views['FilterPersistenceView'].setFilterExperienceToLoad(event)" name="StoredFilterName">
				<!-- Options will be populated dynamically -->
			</select>
			<button type="button" onclick="_Pict.views['FilterPersistenceView'].loadFilterPersistenceSettings(event)">Load Filter</button>
			<button type="button" onclick="_Pict.views['FilterPersistenceView'].deleteFilterPersistenceSettings(event)">Delete Filter</button>
		</div>
	</div>
	<div id="FilterPersistenceView-Footer">
		<button type="button" onclick="_Pict.views['FilterPersistenceView'].closeFilterPersistenceUI()">Close Manage Filters</button>
	</div>
</div>
<!-- DefaultPackage end view template:  [FilterPersistenceView-Container] -->
		`
			}
		],

		Renderables:
		[
			{
				RenderableHash: 'FilterPersistenceView-Renderable',
				TemplateHash: 'FilterPersistenceView-Container',
				DestinationAddress: '#FilterPersistenceView-Container',
				RenderMethod: 'replace'
			},

		],

	Manifests: {}
});

class viewFilterPersistenceView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_CONFIGURATION_FilterPersistenceView, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.currentRecordSet = null;
		this.currentViewContext = null;
		this.filterExperienceToLoad = null;
	}

	/**
	 * Toggles the filter persistence UI for a given record set and view context.
	 *
	 * @param {string} pRecordSet - The identifier of the record set.
	 * @param {string} pViewContext - The context of the view.
	 * @returns {boolean} - Returns true when the UI has been toggled.
	 */
	openFilterPersistenceUI(pRecordSet, pViewContext)
	{
		this.currentRecordSet = pRecordSet;
		this.currentViewContext = pViewContext;
		// hide the button that was just clicked on (will use a different button to close the UI)
		document.getElementById('PRSP_Filter_Button_Manage').style.display = 'none';
		// Implement the logic for toggling filter persistence UI here
		this.render('FilterPersistenceView-Renderable', undefined, { RecordSet: pRecordSet, ViewContext: pViewContext });
		this.pict.providers.FilterDataProvider.setCurrentFilterName(null, pRecordSet);
		this.buildSelectOptionsForAvailableFilterExperiences();
		return true;
	}

	/**
	 * Sets the filter experience to load based on user selection.
	 *
	 * @param {Event} event - The event object.
	 * @returns {boolean} - Returns true when the filter experience has been set.
	 */
	setFilterExperienceToLoad(event)
	{
		event.preventDefault();
		event.stopPropagation();

		/* @type {HTMLSelectElement} */
		const selectedFilterSelectElement = document.getElementById('FilterPersistenceView-StoredFiltersSelect');
		this.filterExperienceToLoad = selectedFilterSelectElement ? selectedFilterSelectElement.value : null;
		return true;
	}

	/**
	 * Closes the filter persistence UI.
	 *
	 * @returns {boolean} - Returns true when the UI has been closed.
	 */
	closeFilterPersistenceUI()
	{
		this.currentRecordSet = null;
		this.currentViewContext = null;
		// show the button that was hidden when opening the UI
		document.getElementById('PRSP_Filter_Button_Manage').style.display = 'inline-block';
		// Implement the logic for closing/hiding filter persistence UI here
		document.getElementById('FilterPersistenceView-Content').innerHTML = '';
		return true;
	}

	
	buildSelectOptionsForAvailableFilterExperiences()
	{
		// for each, make it a selectable option in the UI
		let optionList = []
		const filterMetaList = this.pict.providers.FilterDataProvider.getAllFiltersExperiencesForRecordSet(this.currentRecordSet, this.currentViewContext);
		for (const i in filterMetaList)
		{
			if (filterMetaList[i].FilterExperienceHash === 'LATEST') continue; // skip the LATEST pseudo-filter
			// if the current filter is the active one, mention that in the option text
			const isCurrent = this.pict.providers.FilterDataProvider.isCurrentFilterExperienceHash(this.currentRecordSet, this.currentViewContext, filterMetaList[i].FilterExperienceHash);
			const selectedText = isCurrent ? ' (Current)' : '';
			const optionElement = `<option value="${filterMetaList[i].FilterExperienceHash}">${filterMetaList[i].FilterDisplayName || filterMetaList[i].FilterExperienceHash}${selectedText}</option>`;
			optionList.push(optionElement);
		}
		/* @type {HTMLSelectElement} */
		const storedFiltersSelect = document.getElementById('FilterPersistenceView-StoredFiltersSelect');
		if (storedFiltersSelect)
		{
			storedFiltersSelect.innerHTML = optionList.join('\n');
		}
		return true;
	}

	/**
	 * Loads the filter persistence settings for the current selection of filter experiences.
	 * @param {Event} event - The event object.
	 * @returns {boolean} - Returns true when the settings have been loaded.
	 */
	loadFilterPersistenceSettings(event)
	{
		event.preventDefault();
		event.stopPropagation();
		const selectedFilterHash = this.filterExperienceToLoad;
		if (!selectedFilterHash)
		{
			this.pict.log.warn('No filter experience selected to load.');
			return false;
		}
		this.pict.providers.FilterDataProvider.loadFilterMeta(this.currentRecordSet, this.currentViewContext, selectedFilterHash, true);
		this.pict.log.info(`Filter persistence settings have been loaded for filter: ${selectedFilterHash}`);
		return true;
	}

	/**
	 * Saves the filter persistence settings for the current selection of filter experiences.
	 * @param {Event} event - The event object.
	 * @returns {boolean} - Returns true when the settings have been saved.
	 */
	saveFilterPersistenceSettings(event)
	{
		event.preventDefault();
		event.stopPropagation();
	
		this.pict.providers.FilterDataProvider.saveFilterMeta(this.currentRecordSet, this.currentViewContext, false, () => {
			this.buildSelectOptionsForAvailableFilterExperiences();
		});
		this.pict.log.info('Filter persistence settings have been saved.');
		return true;
	}

	/**
	 * Clears the filter persistence settings for the current record set and view context.
	 * @param {Event} event - The event object.
	 * @returns {boolean} - Returns true when the settings have been cleared.
	 */
	clearFilterPersistenceSettings(event)
	{
		event.preventDefault();
		event.stopPropagation();

		// TODO: Just doing a reset and close here for now, but may want to do something different later?
		this.pict.providers['PRSP-Filters'].handleReset(event, this.currentRecordSet, this.currentViewContext);
		this.closeFilterPersistenceUI();
		this.pict.log.info('Filter persistence settings have been cleared.');
		return true;
	}
}

module.exports = viewFilterPersistenceView;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_FilterPersistenceView;