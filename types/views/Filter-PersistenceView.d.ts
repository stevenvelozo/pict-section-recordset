export = viewFilterPersistenceView;
declare class viewFilterPersistenceView extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    currentRecordSet: string;
    currentViewContext: string;
    filterExperienceSelection: any;
    filterExperienceInitialized: boolean;
    /**
     * Initializes the filter persistence view UI for a given record set and view context. This will render the UI and populate it with the relevant filter experiences for the given context.
     * @param {string} pRecordSet - The identifier of the record set.
     * @param {string} pViewContext - The context of the view.
     * @param {function} pCallback - A callback function to be executed after initializing the UI.
     * @returns {boolean} - Returns true when the UI has been initialized.
     */
    initializeFilterPersistenceViewUI(pRecordSet: string, pViewContext: string, pCallback: Function): boolean;
    /**
     * Updates the current filter experience name in the input field based on the current filter experience applied for the given record set and view context. This is used to ensure that if the filter experience was modified outside of the UI (ex: through the URL hash), we can reflect that in the input field and also handle the button states accordingly to prevent unintended consequences of saving in an invalid state.
     * @param {string} pRecordSet - The identifier of the record set.
     * @param {string} pViewContext - The context of the view.
     * @param {boolean} pIgnoreCurrentExperienceURLParam - Whether to ignore the current experience when updating the input field, use this when in a modified state and the url is now outdated, to generate a new name.
     */
    updateDisplayNameInputWithCurrentFilterExperience(pRecordSet: string, pViewContext: string, pIgnoreCurrentExperienceURLParam?: boolean): void;
    /**
     * Toggles the filter persistence UI for a given record set and view context
     * @param {string} pRecordSet - The identifier of the record set.
     * @param {string} pViewContext - The context of the view.
     * @param {function} pCallback - A callback function to be executed after toggling the UI.
     * @returns {boolean} - Returns true when the UI has been toggled.
     */
    openFilterPersistenceUI(pRecordSet: string, pViewContext: string, pCallback: Function): boolean;
    /**
     * Handles the state of the filter experience when it has been modified from the URL hash instead of through the UI, which can lead to an invalid state for saving if the user tries to save without realizing the current experience was modified outside of the UI.
     * This method will show a warning message and disable the save/set as default/remove as default/delete buttons to prevent unintended consequences of saving in that state, and will prompt the user to load a filter experience through the UI or refresh the page to reset the state before they can save. It will also disable the current filter name input and set a warning message in it to indicate that the user needs to apply or reset filters changes to be able to save settings. If the filter experience is not in that modified state, it will ensure the buttons are enabled and the current filter name input is enabled and populated with the current filter experience name for better visibility when saving.
     */
    handleModifiedFiltersState(): void;
    /**
     * Updates the filter experience settings for a given record set and view context.
     * @param {string} pRecordSet - The identifier of the record set.
     * @param {string} pViewContext - The context of the view.
     * @param {object} pSettings - The settings to update.
     * @returns {boolean} - Returns true when the settings have been updated.
     */
    updateFilterExperienceSettings(pRecordSet: string, pViewContext: string, pSettings: object): boolean;
    /**
     * Sets the filter experience to load based on user selection.
     * @param {Event} event - The event object.
     * @returns {boolean} - Returns true when the filter experience has been set.
     */
    setFilterExperienceToSelection(event: Event): boolean;
    /**
     * Closes the filter persistence UI.
     * @returns {boolean} - Returns true when the UI has been closed.
     */
    closeFilterPersistenceUI(): boolean;
    /**
     * Builds the select options for available filter experiences. Sets the current filter as selected and indicates it in the option text.
     * @returns {boolean} - Returns true when the options have been built.
     */
    buildSelectOptionsForAvailableFilterExperiences(): boolean;
    /**
     * Toggles the "Remember Last Used Filter Experience" setting in the Filter Data Provider.
     * @param {Event} event - The event object.
     * @returns {boolean} - Returns true when the setting has been toggled.
     */
    toggleRememberLastUsedFilterExperience(event: Event): boolean;
    /**
     * Loads the filter persistence settings for the current selection of filter experiences.
     * @param {Event} event - The event object.
     * @returns {boolean} - Returns true when the settings have been loaded.
     */
    loadFilterPersistenceSettings(event: Event, pCallback: any): boolean;
    /**
     * Saves the filter persistence settings for the current selection of filter experiences.
     * @param {Event} event - The event object.
     * @param {function} [pCallback] - A callback function to be executed after saving the settings.
     * @returns {boolean} - Returns true when the settings have been saved.
     */
    /** HTML-escape a value for safe display in the modal. */
    _escapeHTML(pValue: any): string;
    /** Describe a single active filter clause in plain English (e.g. "Date Created between A and B"). */
    _describeFilterClause(pClause: any): string;
    /**
     * @returns {{ summary: string, count: string }} A plain-English summary of the current
     * search + filter clauses, and the matched record count (from the rendered list total).
     */
    _describeCurrentFilter(): {
        summary: string;
        count: string;
    };
    /**
     * Prompt for a name (via pict-section-modal when available) and save the current search +
     * filters as a named experience. The modal previews the filter in plain English and the
     * number of records it matches. Falls back to the generated name with no prompt if the
     * modal section is not registered in the host app.
     *
     * @param {Event} pEvent
     */
    promptSaveFilterExperience(pEvent: Event): boolean;
    saveFilterPersistenceSettings(event: any, pCallback: any): boolean;
    /**
     * Sets the filter experience as the default for the current record set and view context.
     * @param {Event} event - The event object.
     * @param {boolean} isDefault - Whether to set as default or not.
     * @param {function} [pCallback] - A callback function to be executed after toggling the default setting.
     * @returns {boolean} - Returns true when the settings have been set as default.
     */
    toggleFilterExperienceAsTheDefault(event: Event, isDefault: boolean, pCallback?: Function): boolean;
    /**
     * Handles the button states for the filter experience selection.
     * @param {boolean} isDefault - Whether the filter experience is set as default or not.
     */
    handleSelectionButtonStates(isDefault: boolean): void;
    /**
     * Deletes the filter persistence settings for the current selection of filter experiences.
     * @param {Event} event - The event object.
     * @param {function} [pCallback] - A callback function to be executed after deleting the settings.
     * @returns {boolean} - Returns true when the settings have been deleted.
     */
    deleteFilterPersistenceSettings(event: Event, pCallback?: Function): boolean;
}
declare namespace viewFilterPersistenceView {
    export { _DEFAULT_CONFIGURATION_FilterPersistenceView as default_configuration };
}
import libPictView = require("pict-view");
declare namespace _DEFAULT_CONFIGURATION_FilterPersistenceView {
    let ViewIdentifier: string;
    let DefaultRenderable: string;
    let DefaultDestinationAddress: string;
    let DefaultTemplateRecordAddress: boolean;
    let AutoInitialize: boolean;
    let AutoInitializeOrdinal: number;
    let AutoRender: boolean;
    let AutoRenderOrdinal: number;
    let AutoSolveWithApp: boolean;
    let AutoSolveOrdinal: number;
    let CSS: string;
    let CSSPriority: number;
    let Templates: {
        Hash: string;
        Template: string;
    }[];
    let Renderables: {
        RenderableHash: string;
        TemplateHash: string;
        DestinationAddress: string;
        RenderMethod: string;
    }[];
    let Manifests: {};
}
//# sourceMappingURL=Filter-PersistenceView.d.ts.map