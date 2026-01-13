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
			<select id="FilterPersistenceView-StoredFiltersSelect" onchange="_Pict.views['FilterPersistenceView'].setFilterExperienceToSelection(event)" name="StoredFilterName">
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
		this.filterExperienceSelection = null;
	}

	/**
	 * Toggles the filter persistence UI for a given record set and view context.
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
		const tmpFilterExperienceList = this.pict.providers.FilterDataProvider.getAllFiltersExperiencesForRecordSet(pRecordSet, pViewContext);
		// get the current filter experience hash from the URL
		const tmpExperienceURLParam = window.location.hash.split('/FilterExperience/')?.[1] || '';
		// look in the map for the filter experience with the given hash
		const filterExperiences = this.pict.providers.FilterDataProvider.getAllFiltersExperiencesForRecordSet(pRecordSet, pViewContext);
		const matchingExperience = filterExperiences.find((pExperience) => pExperience.FilterExperienceHash === tmpFilterExperienceList.find((exp) => exp.FilterExperienceEncodedURLParam === tmpExperienceURLParam)?.FilterExperienceHash);
		// If we found a matching experience, set it as the current filter name		
		if (matchingExperience && (matchingExperience.FilterExperienceEncodedURLParam === tmpExperienceURLParam))
		{
			this.pict.providers.FilterDataProvider.setCurrentFilterName(matchingExperience, pRecordSet, pViewContext);
		}
		else
		{
			this.pict.providers.FilterDataProvider.setCurrentFilterName(null, pRecordSet, pViewContext, null);
		}
		this.buildSelectOptionsForAvailableFilterExperiences();
		return true;
	}

	/**
	 * Sets the filter experience to load based on user selection.
	 * @param {Event} event - The event object.
	 * @returns {boolean} - Returns true when the filter experience has been set.
	 */
	setFilterExperienceToSelection(event)
	{
		event.preventDefault();
		event.stopPropagation();

		/* @type {HTMLSelectElement} */
		const selectedFilterSelectElement = document.getElementById('FilterPersistenceView-StoredFiltersSelect');
		// @ts-ignore
		this.filterExperienceSelection = selectedFilterSelectElement ? selectedFilterSelectElement.value : null;
		return true;
	}

	/**
	 * Closes the filter persistence UI.
	 * @returns {boolean} - Returns true when the UI has been closed.
	 */
	closeFilterPersistenceUI()
	{
		this.currentRecordSet = null;
		this.currentViewContext = null;
		// show the button that was hidden when opening the UI
		document.getElementById('PRSP_Filter_Button_Manage').style.display = 'inline-block';
		document.getElementById('FilterPersistenceView-Content').innerHTML = '';
		return true;
	}

	/**
	 * Builds the select options for available filter experiences. Sets the current filter as selected and indicates it in the option text.
	 * @returns {boolean} - Returns true when the options have been built.
	 */
	buildSelectOptionsForAvailableFilterExperiences()
	{
		let optionList = []
		const filterExperienceList = this.pict.providers.FilterDataProvider.getAllFiltersExperiencesForRecordSet(this.currentRecordSet, this.currentViewContext);
		// add a default option at the top
		optionList.push('<option value="">-- Select a Stored Filter --</option>');
		for (const i in filterExperienceList)
		{
			if (filterExperienceList[i].ExcludedFromSelection) continue; // skip excluded ones (like LATEST, DEFAULT, etc)
			// if the current filter is the active one, mention that in the option text
			const isCurrent = this.pict.providers.FilterDataProvider.isCurrentFilterExperienceHash(this.currentRecordSet, this.currentViewContext, filterExperienceList[i].FilterExperienceHash);
			const selectedText = isCurrent ? ' (Current)' : '';
			const optionElement = `<option ${isCurrent ? 'selected' : ''} value="${filterExperienceList[i].FilterExperienceHash}">${filterExperienceList[i].FilterDisplayName || filterExperienceList[i].FilterExperienceHash}${selectedText}</option>`;
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
		const selectedFilterExperienceHash = this.filterExperienceSelection;
		if (!selectedFilterExperienceHash)
		{
			this.pict.log.warn('No filter experience selected to load.');
			return false;
		}
		this.pict.providers.FilterDataProvider.loadFilterMeta(this.currentRecordSet, this.currentViewContext, selectedFilterExperienceHash);
		this.pict.log.info(`Filter persistence settings have been loaded for filter: ${selectedFilterExperienceHash}`);
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
	
		this.pict.providers.FilterDataProvider.saveFilterMeta(this.currentRecordSet, this.currentViewContext, false);
		this.buildSelectOptionsForAvailableFilterExperiences();
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

		// TODO: Just doing a reset and close here for now, but may want to do something different here? Do we need a clear button for manage filters?
		this.pict.views['PRSP-Filters'].handleReset(event, this.currentRecordSet, this.currentViewContext);
		this.closeFilterPersistenceUI();
		this.pict.log.info('Filter persistence settings have been cleared.');
		return true;
	}

	/**
	 * Deletes the filter persistence settings for the current selection of filter experiences.
	 * @param {Event} event - The event object.
	 * @returns {boolean} - Returns true when the settings have been deleted.
	 */
	deleteFilterPersistenceSettings(event)
	{
		event.preventDefault();
		event.stopPropagation();

		const selectedFilterExperienceHash = this.filterExperienceSelection;
		if (!selectedFilterExperienceHash)
		{
			this.pict.log.warn('No filter experience selected to delete.');
			return false;
		}
		this.pict.providers.FilterDataProvider.removeFilterMeta(this.currentRecordSet, this.currentViewContext, selectedFilterExperienceHash);
		this.buildSelectOptionsForAvailableFilterExperiences();
		this.pict.log.info(`Filter persistence settings have been deleted for filter: ${selectedFilterExperienceHash}`);
		return true;
	}
}

module.exports = viewFilterPersistenceView;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_FilterPersistenceView;