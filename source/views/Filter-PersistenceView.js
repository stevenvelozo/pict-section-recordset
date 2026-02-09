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
		<h3>Filter Experience Settings</h3>
	</div>
	<div id="FilterPersistenceView-Body">
		<div class="FilterPersistenceView-ActiveSettings">
			<label for="CurrentFilterName">Current Filter Experience:</label>
			<span id="FilterPersistenceView-CurrentFilterNameInput-ValidationMessage" style="color: red; font-size: 0.9em; margin-left: 10px;"></span>
			<input type="text" id="FilterPersistenceView-CurrentFilterNameInput" name="CurrentFilterName" value="" onfocus="this.select()" />
			<button type="button" id="FilterPersistenceView-SaveFilterButton" onclick="_Pict.views['FilterPersistenceView'].saveFilterPersistenceSettings(event)">
				<span id="FilterPersistenceView-SaveFilterButtonText">Save</span>
			</button>
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
		<button type="button" id="FilterPersistenceView-CloseManageFiltersButton" onclick="_Pict.views['FilterPersistenceView'].closeFilterPersistenceUI()">Close</button>
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
		this.filterExperienceInitialized = false;
	}
	

	/**
	 * Initializes the filter persistence view UI for a given record set and view context. This will render the UI and populate it with the relevant filter experiences for the given context.
	 * @param {string} pRecordSet - The identifier of the record set.
	 * @param {string} pViewContext - The context of the view.
	 * @param {function} pCallback - A callback function to be executed after initializing the UI.
	 * @returns {boolean} - Returns true when the UI has been initialized.
	 */
	initializeFilterPersistenceViewUI(pRecordSet, pViewContext, pCallback)
	{
		if (!pRecordSet || !pViewContext)
		{
			this.pict.log.error('RecordSet and ViewContext are required to open the Filter Persistence UI.');
			return false;
		}

		if (!this.filterExperienceInitialized)
		{
			this.pict.providers.FilterDataProvider.initializeFilterExperienceSettings(pRecordSet, pViewContext);
			this.filterExperienceInitialized = true;
		}
		this.currentRecordSet = pRecordSet;
		this.currentViewContext = pViewContext;
		// Implement the logic for toggling filter persistence UI here
		this.render('FilterPersistenceView-Renderable', undefined, { RecordSet: pRecordSet, ViewContext: pViewContext });
		
		// set checkbox for "Remember Last Used Filter Experience" based on provider setting
		const checkboxElement = document.getElementById('OptionalSettings-RememberLastUsed');
		if (checkboxElement)
		{
			// @ts-ignore
			checkboxElement.checked = this.pict.providers.FilterDataProvider.getRememberLastUsedFilterExperience(this.currentRecordSet, this.currentViewContext);
		}
		// build the select options for available filter experiences
		this.buildSelectOptionsForAvailableFilterExperiences();
		this.handleModifiedFiltersState();

		// if a callback function was provided, execute it after the UI has been generated
		if (pCallback && typeof pCallback === 'function')
		{
			pCallback();
		};
		return true;
	}

	/**
	 * Updates the current filter experience name in the input field based on the current filter experience applied for the given record set and view context. This is used to ensure that if the filter experience was modified outside of the UI (ex: through the URL hash), we can reflect that in the input field and also handle the button states accordingly to prevent unintended consequences of saving in an invalid state.
	 * @param {string} pRecordSet - The identifier of the record set.
	 * @param {string} pViewContext - The context of the view.
	 * @param {boolean} pIgnoreCurrentExperienceURLParam - Whether to ignore the current experience when updating the input field, use this when in a modified state and the url is now outdated, to generate a new name.
	 */
	updateDisplayNameInputWithCurrentFilterExperience(pRecordSet, pViewContext, pIgnoreCurrentExperienceURLParam = false)
	{
		const tmpFilterExperienceList = this.pict.providers.FilterDataProvider.getAllFiltersExperiencesForRecordSet(pRecordSet, pViewContext);
		// get the current filter experience hash from the URL
		const tmpExperienceURLParam = this.pict.providers.PictRouter?.router?.current?.[0].hashString?.split?.('/FilterExperience/')?.[1] || '';
		// look in the map for the filter experience with the given hash
		const filterExperiences = this.pict.providers.FilterDataProvider.getAllFiltersExperiencesForRecordSet(pRecordSet, pViewContext);
		// BUG?: We are doing a double lookup here to match both the name and the encoded URL param, because just looking up by URL param alone can lead to issues if there are multiple experiences with the same URL param but different names.
		const matchingExperience = filterExperiences.find((pExperience) => pExperience.FilterExperienceHash === tmpFilterExperienceList.find((exp) => exp.FilterExperienceEncodedURLParam === tmpExperienceURLParam)?.FilterExperienceHash);
		// If we found a matching experience (both name and encoded URL param), set it as the current filter name and the active selection in the selector	
		if (!pIgnoreCurrentExperienceURLParam && matchingExperience && (matchingExperience.FilterExperienceEncodedURLParam === tmpExperienceURLParam))
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
	}

	/**
	 * Toggles the filter persistence UI for a given record set and view context
	 * @param {string} pRecordSet - The identifier of the record set.
	 * @param {string} pViewContext - The context of the view.
	 * @param {function} pCallback - A callback function to be executed after toggling the UI.
	 * @returns {boolean} - Returns true when the UI has been toggled.
	 */
	openFilterPersistenceUI(pRecordSet, pViewContext, pCallback)
	{
		// hide the button that was just clicked on (will use a different button to close the UI)
		if (document.getElementById('PRSP_Filter_Button_Manage'))
		{
			document.getElementById('PRSP_Filter_Button_Manage').style.display = 'none';
		}
		// render the UI for managing filter persistence settings
		this.initializeFilterPersistenceViewUI(pRecordSet, pViewContext, pCallback);
		return true;
	}
	
	/**
	 * Handles the state of the filter experience when it has been modified from the URL hash instead of through the UI, which can lead to an invalid state for saving if the user tries to save without realizing the current experience was modified outside of the UI.
	 * This method will show a warning message and disable the save/set as default/remove as default/delete buttons to prevent unintended consequences of saving in that state, and will prompt the user to load a filter experience through the UI or refresh the page to reset the state before they can save. It will also disable the current filter name input and set a warning message in it to indicate that the user needs to apply or reset filters changes to be able to save settings. If the filter experience is not in that modified state, it will ensure the buttons are enabled and the current filter name input is enabled and populated with the current filter experience name for better visibility when saving.
	 */
	handleModifiedFiltersState()
	{
		// if the current filter experience was modified from the URL hash, show a warning toast to the user that they need to load a filter experience through the UI or refresh the page to reset the state before they can save, since saving in that state could lead to unintended consequences of saving an unintended filter experience as the default or overwriting an existing filter experience without realizing it
		if (this.pict.providers.FilterDataProvider.filterExperienceModifiedFromURLHash)
		{
			// disable the save and set as default buttons to prevent saving in this state
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-SaveFilterButton', 'disabled', 'disabled');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-SetAsDefaultButton', 'disabled', 'disabled');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-RemoveAsDefaultButton', 'disabled', 'disabled');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-DeleteFilterButton', 'disabled', 'disabled');
			this.pict.ContentAssignment.assignContent('#FilterPersistenceView-CurrentFilterNameInput-ValidationMessage', 'Please apply or reset filter changes to enable saving settings.');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-CurrentFilterNameInput', 'title', 'The current filter experience has been modified. Please apply or reset filter changes to enable saving settings and set a default filter experience.');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-CurrentFilterNameInput', 'disabled', 'disabled');
		}
		else
		{
			// re-enable the buttons in case they were disabled from being in a modified state, to allow saving and setting default again
			this.pict.ContentAssignment.removeAttribute('#FilterPersistenceView-SaveFilterButton', 'disabled');
			this.pict.ContentAssignment.removeAttribute('#FilterPersistenceView-SetAsDefaultButton', 'disabled');
			this.pict.ContentAssignment.removeAttribute('#FilterPersistenceView-RemoveAsDefaultButton', 'disabled');
			this.pict.ContentAssignment.removeAttribute('#FilterPersistenceView-DeleteFilterButton', 'disabled');
			this.pict.ContentAssignment.assignContent('#FilterPersistenceView-CurrentFilterNameInput-ValidationMessage', '');
			this.pict.ContentAssignment.setAttribute('#FilterPersistenceView-CurrentFilterNameInput', 'title', '');
			this.pict.ContentAssignment.removeAttribute('#FilterPersistenceView-CurrentFilterNameInput', 'disabled');
		}
		// regardless of the modified state, update the current filter name input to match the current filter experience for better visibility when saving and to ensure it reflects any changes that may have happened to the filter experience from the URL hash or elsewhere
		this.updateDisplayNameInputWithCurrentFilterExperience(this.currentRecordSet, this.currentViewContext, this.pict.providers.FilterDataProvider.filterExperienceModifiedFromURLHash);
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

		this.filterExperienceSelection = this.pict.ContentAssignment.readContent('#FilterPersistenceView-StoredFiltersSelect');
		// check if the selected filter experience is set as default on load, so we can set the button states accordingly
		const isDefault = this.pict.providers.FilterDataProvider.isDefaultFilterExperience(this.currentRecordSet, this.currentViewContext, this.filterExperienceSelection);
		this.handleSelectionButtonStates(isDefault);
		// set the current filter name in the provider to match the selection
		const tmpSelectedFilterExperience = this.pict.providers.FilterDataProvider.getFilterExperienceByHash(this.currentRecordSet, this.currentViewContext, this.filterExperienceSelection);
		let tmpBackupDisplayName = '';
		if (!tmpSelectedFilterExperience)
		{
			tmpBackupDisplayName = `New ${this.currentRecordSet} ${this.currentViewContext} Filter`;
		}
		this.pict.providers.FilterDataProvider.setCurrentFilterName(tmpSelectedFilterExperience, this.currentRecordSet, this.currentViewContext, tmpBackupDisplayName);
		// update the save button to text to be "Update" instead of "Save" if the selected filter experience is the current one, to indicate that clicking it will update the existing filter experience instead of creating a new one
		if (this.filterExperienceSelection && this.pict.providers.FilterDataProvider.isCurrentFilterExperience(this.currentRecordSet, this.currentViewContext, this.filterExperienceSelection))
		{	
			this.pict.ContentAssignment.assignContent('#FilterPersistenceView-SaveFilterButtonTextText', 'Update');
		}
		else
		{
			this.pict.ContentAssignment.assignContent('#FilterPersistenceView-SaveFilterButtonTextText', 'Save');
		}
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
		if (document.getElementById('PRSP_Filter_Button_Manage'))
		{
			document.getElementById('PRSP_Filter_Button_Manage').style.display = 'inline-block';
		}
		// Clear the content of the Filter Persistence View (if it's still on the DOM - it will re-render next time it's opened either way, but this is to ensure we don't have stale content if the view is still around in the DOM)
		if (document.getElementById('FilterPersistenceView-Content'))
		{
			document.getElementById('FilterPersistenceView-Content').innerHTML = '';
		}
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
		// after rebuilding the options, if there is a current selection, ensure the save button text is correct based on whether the current selection is the active filter experience or not
		if (this.filterExperienceSelection && this.pict.providers.FilterDataProvider.isCurrentFilterExperience(this.currentRecordSet, this.currentViewContext, this.filterExperienceSelection))
		{	
			this.pict.ContentAssignment.assignContent('#FilterPersistenceView-SaveFilterButtonText', 'Update');
		}
		else
		{
			this.pict.ContentAssignment.assignContent('#FilterPersistenceView-SaveFilterButtonText', 'Save');
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
	loadFilterPersistenceSettings(event, pCallback)
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
		this.pict.providers.FilterDataProvider.filterExperienceModifiedFromURLHash = false;
		// if a callback function was provided, execute it after loading the settings (toasts, etc.)
		if (pCallback && typeof pCallback === 'function')
		{
			pCallback();
		}
		return true;
	}

	/**
	 * Saves the filter persistence settings for the current selection of filter experiences.
	 * @param {Event} event - The event object.
	 * @param {function} [pCallback] - A callback function to be executed after saving the settings.
	 * @returns {boolean} - Returns true when the settings have been saved.
	 */
	saveFilterPersistenceSettings(event, pCallback)
	{
		event.preventDefault();
		event.stopPropagation();

		if (!this.currentRecordSet || !this.currentViewContext)
		{
			this.pict.log.warn('Missing a record set or view context to save filter persistence settings. Skipping save. CurrentRecordSet: ' + this.currentRecordSet + ', CurrentViewContext: ' + this.currentViewContext + ')');
			return false;
		}

		if (this.pict.providers.FilterDataProvider.filterExperienceModifiedFromURLHash)
		{
			this.pict.log.warn('The current filter experience has been modified from the URL hash and not through the UI, so it may not be in a valid state to save. Please load a filter experience through the UI or refresh the page to reset the state before saving.');
			return false;
		}

		this.pict.providers.FilterDataProvider.saveFilterMeta(this.currentRecordSet, this.currentViewContext, false);
		this.buildSelectOptionsForAvailableFilterExperiences();
		this.pict.log.info('Filter persistence settings have been saved.');
		// if a callback function was provided, execute it after saving the settings (toasts, etc.)
		if (pCallback && typeof pCallback === 'function')
		{
			pCallback();
		}
		return true;
	}

	/**
	 * Sets the filter experience as the default for the current record set and view context.
	 * @param {Event} event - The event object.
	 * @param {boolean} isDefault - Whether to set as default or not.
	 * @param {function} [pCallback] - A callback function to be executed after toggling the default setting.
	 * @returns {boolean} - Returns true when the settings have been set as default.
	 */
	toggleFilterExperienceAsTheDefault(event, isDefault, pCallback)
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
		// if a callback function was provided, execute it after setting the default (toasts, etc.)
		if (pCallback && typeof pCallback === 'function')
		{
			pCallback();
		}
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
	 * @param {function} [pCallback] - A callback function to be executed after deleting the settings.
	 * @returns {boolean} - Returns true when the settings have been deleted.
	 */
	deleteFilterPersistenceSettings(event, pCallback)
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
		// if a callback function was provided, execute it after deleting the settings (toasts, etc.)
		if (pCallback && typeof pCallback === 'function')
		{
			pCallback();
		}
		return true;
	}
}

module.exports = viewFilterPersistenceView;

module.exports.default_configuration = _DEFAULT_CONFIGURATION_FilterPersistenceView;