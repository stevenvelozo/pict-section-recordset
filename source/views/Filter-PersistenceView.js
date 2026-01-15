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
			<label for="CurrentFilterName">Current Filter Experience:</label>
			<input type="text" id="FilterPersistenceView-CurrentFilterNameInput" name="CurrentFilterName" value="" onfocus="this.select()" />
			<button type="button" id="FilterPersistenceView-SaveFilterButton" onclick="_Pict.views['FilterPersistenceView'].saveFilterPersistenceSettings(event)">Save</button>
		</div>
		<div class="FilterPersistenceView-StoredSettings">
			<label for="StoredFilterName">Stored Filter Experiences:</label>
			<select id="FilterPersistenceView-StoredFiltersSelect" onchange="_Pict.views['FilterPersistenceView'].setFilterExperienceToSelection(event)" name="StoredFilterName">
				<!-- Options will be populated dynamically -->
			</select>
			<button type="button" id="FilterPersistenceView-LoadFilterButton" onclick="_Pict.views['FilterPersistenceView'].loadFilterPersistenceSettings(event)">Load</button>
			<button type="button" id="FilterPersistenceView-SetAsDefaultButton" onclick="_Pict.views['FilterPersistenceView'].toggleFilterExperienceAsTheDefault(event, true)">Set As Default</button>
			<button type="button" id="FilterPersistenceView-RemoveAsDefaultButton" onclick="_Pict.views['FilterPersistenceView'].toggleFilterExperienceAsTheDefault(event, false)">Remove As Default</button>
			<button type="button" id="FilterPersistenceView-DeleteFilterButton" onclick="_Pict.views['FilterPersistenceView'].deleteFilterPersistenceSettings(event)">Delete</button>
		</div>
		<div class="FilterPersistenceView-OptionalSettings">
			<label for="OptionalSettings">Optional Settings:</label>
			<label for="OptionalSettings-RememberLastUsed">
				<input type="checkbox" id="OptionalSettings-RememberLastUsed" name="RememberLastUsed" onchange="_Pict.views['FilterPersistenceView'].toggleRememberLastUsedFilterExperience(event)"	 />
				Remember my last search filter experience
			</label>
		</div>
	</div>
	<div id="FilterPersistenceView-Footer">
		<button type="button" id="FilterPersistenceView-CloseManageFiltersButton" onclick="_Pict.views['FilterPersistenceView'].closeFilterPersistenceUI()">Close Manage Filters</button>
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
		this.pict.providers.FilterDataProvider.initializeFilterExperienceSettings(pRecordSet, pViewContext);

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
		// BUG?: We are doing a double lookup here to match both the name and the encoded URL param, because just looking up by URL param alone can lead to issues if there are multiple experiences with the same URL param but different names.
		const matchingExperience = filterExperiences.find((pExperience) => pExperience.FilterExperienceHash === tmpFilterExperienceList.find((exp) => exp.FilterExperienceEncodedURLParam === tmpExperienceURLParam)?.FilterExperienceHash);
		// If we found a matching experience (both name and encoded URL param), set it as the current filter name and the active selection in the selector	
		if (matchingExperience && (matchingExperience.FilterExperienceEncodedURLParam === tmpExperienceURLParam))
		{
			this.pict.providers.FilterDataProvider.setCurrentFilterName(matchingExperience, pRecordSet, pViewContext);
			this.filterExperienceSelection = matchingExperience.FilterExperienceHash;
			// check if the current filter experience is set as default on load, so we can set the button states accordingly
			const isDefault = this.pict.providers.FilterDataProvider.isDefaultFilterExperience(pRecordSet, pViewContext, this.filterExperienceSelection);
			this.handleSelectionButtonStates(isDefault);
		}
		else
		{
			this.pict.providers.FilterDataProvider.setCurrentFilterName(null, pRecordSet, pViewContext, null);
			this.filterExperienceSelection = null;
			this.handleSelectionButtonStates(null);
		}
		// set checkbox for "Remember Last Used Filter Experience" based on provider setting
		const checkboxElement = document.getElementById('OptionalSettings-RememberLastUsed');
		if (checkboxElement)
		{
			// @ts-ignore
			checkboxElement.checked = this.pict.providers.FilterDataProvider.getRememberLastUsedFilterExperience(this.currentRecordSet, this.currentViewContext);
		}
		// build the select options for available filter experiences
		this.buildSelectOptionsForAvailableFilterExperiences();
		return true;
	}

	/**
	 * Updates the filter experience settings for a given record set and view context.
	 * @param {string} pRecordSet - The identifier of the record set.
	 * @param {string} pViewContext - The context of the view.
	 * @param {object} pSettings - The settings to update.
	 * @returns {boolean} - Returns true when the settings have been updated.
	 */
	updateFilterExperienceSettings(pRecordSet, pViewContext, pSettings)
	{
		if (pRecordSet && pViewContext)
		{
			this.pict.providers.FilterDataProvider.initializeFilterExperienceSettings(pRecordSet, pViewContext);
			this.currentRecordSet = pRecordSet;
			this.currentViewContext = pViewContext;
			// for any settings that may have changed, update those without replacing the whole settings object
			this.pict.providers.FilterDataProvider.updateFilterExperienceSettingsFromStorage(pRecordSet, pViewContext, pSettings);
			// build the select options for available filter experiences
			this.buildSelectOptionsForAvailableFilterExperiences();
		}
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
		// check if the selected filter experience is set as default on load, so we can set the button states accordingly
		const isDefault = this.pict.providers.FilterDataProvider.isDefaultFilterExperience(this.currentRecordSet, this.currentViewContext, this.filterExperienceSelection);
		this.handleSelectionButtonStates(isDefault);
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
		this.filterExperienceSelection = null;
		this.handleSelectionButtonStates(null);
		// show the button that was hidden when opening the UI
		document.getElementById('PRSP_Filter_Button_Manage').style.display = 'inline-block';
		// Clear the content of the Filter Persistence View (it will re-render next time it's opened)
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
		optionList.push('<option value="">-- Select a stored Filter Experience --</option>');
		// iterate through the filter experiences and build the option elements
		for (const key in filterExperienceList)
		{ 
			// skip excluded ones (if needed for hidden/internal use)
			if (filterExperienceList[key].ExcludedFromSelection) 
			{
				continue;
			}
			// if the current filter is the active/default one, mention that in the option text for clarity
			const isCurrent = this.pict.providers.FilterDataProvider.isCurrentFilterExperience(this.currentRecordSet, this.currentViewContext, filterExperienceList[key].FilterExperienceHash);
			const isDefault = this.pict.providers.FilterDataProvider.isDefaultFilterExperience(this.currentRecordSet, this.currentViewContext, filterExperienceList[key].FilterExperienceHash);
			let addOnText = '';
			if (isCurrent)
			{
				addOnText += ' (Current)';
			}
			if (isDefault)
			{
				addOnText += ' (Default)';
			}
			const optionElement = `<option ${ isCurrent ? 'selected' : ''} value="${filterExperienceList[key].FilterExperienceHash}">${filterExperienceList[key].FilterDisplayName || filterExperienceList[key].FilterExperienceHash}${addOnText}</option>`;
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
	 * Toggles the "Remember Last Used Filter Experience" setting in the Filter Data Provider.
	 * @param {Event} event - The event object.
	 * @returns {boolean} - Returns true when the setting has been toggled.
	 */
	toggleRememberLastUsedFilterExperience(event)
	{
		event.preventDefault();
		event.stopPropagation();

		const checkboxElement = document.getElementById('OptionalSettings-RememberLastUsed');
		// @ts-ignore
		const rememberLastUsed = checkboxElement ? checkboxElement.checked : false;

		this.pict.providers.FilterDataProvider.setRememberLastUsedFilterExperience(this.currentRecordSet, this.currentViewContext, rememberLastUsed);
		this.pict.log.info(`Remember Last Used Filter Experience has been ${rememberLastUsed ? 'enabled' : 'disabled'}.`);
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
	 * Sets the filter experience as the default for the current record set and view context.
	 * @param {Event} event - The event object.
	 * @param {boolean} isDefault - Whether to set as default or not.
	 * @returns {boolean} - Returns true when the settings have been set as default.
	 */
	toggleFilterExperienceAsTheDefault(event, isDefault)
	{
		event.preventDefault();
		event.stopPropagation();

		const selectedFilterExperienceHash = this.filterExperienceSelection;
		if (!selectedFilterExperienceHash)
		{
			this.pict.log.warn('No filter experience selected to set as default.');
			return false;
		}
		// set or unset the default filter experience on load in the provider
		this.pict.providers.FilterDataProvider.setDefaultFilterExperience(this.currentRecordSet, this.currentViewContext, selectedFilterExperienceHash, isDefault);
		this.handleSelectionButtonStates(isDefault);
		
		this.buildSelectOptionsForAvailableFilterExperiences();
		this.pict.log.info(`Filter experience ${selectedFilterExperienceHash} has been ${isDefault ? 'set' : 'unset'} as the default on load.`);
		return true;
	}

	/**
	 * Handles the button states for the filter experience selection.
	 * @param {boolean} isDefault - Whether the filter experience is set as default or not.
	 */
	handleSelectionButtonStates(isDefault)
	{
		if (!this.filterExperienceSelection)
		{
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-LoadFilterButton', 'style', 'display: none;');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-SetAsDefaultButton', 'style', 'display: none;');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-RemoveAsDefaultButton', 'style', 'display: none;');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-DeleteFilterButton', 'style', 'display: none;');
			return;
		}
		else
		{
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-LoadFilterButton', 'style', 'display: inline-block;');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-DeleteFilterButton', 'style', 'display: inline-block;');
		}
		// handle the set/remove default buttons separately when we have a selection
		if (isDefault)
		{
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-SetAsDefaultButton', 'style', 'display: none;');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-RemoveAsDefaultButton', 'style', 'display: inline-block;');
		}
		else
		{
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-SetAsDefaultButton', 'style', 'display: inline-block;');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-RemoveAsDefaultButton', 'style', 'display: none;');
		}
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