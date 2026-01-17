export = viewFilterPersistenceView;
declare class viewFilterPersistenceView extends libPictView {
    constructor(pFable: any, pOptions: any, pServiceHash: any);
    currentRecordSet: string;
    currentViewContext: string;
    filterExperienceSelection: any;
    /**
     * Toggles the filter persistence UI for a given record set and view context.
     * @param {string} pRecordSet - The identifier of the record set.
     * @param {string} pViewContext - The context of the view.
     * @returns {boolean} - Returns true when the UI has been toggled.
     */
    openFilterPersistenceUI(pRecordSet: string, pViewContext: string): boolean;
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
    loadFilterPersistenceSettings(event: Event): boolean;
    /**
     * Saves the filter persistence settings for the current selection of filter experiences.
     * @param {Event} event - The event object.
     * @returns {boolean} - Returns true when the settings have been saved.
     */
    saveFilterPersistenceSettings(event: Event): boolean;
    /**
     * Sets the filter experience as the default for the current record set and view context.
     * @param {Event} event - The event object.
     * @param {boolean} isDefault - Whether to set as default or not.
     * @returns {boolean} - Returns true when the settings have been set as default.
     */
    toggleFilterExperienceAsTheDefault(event: Event, isDefault: boolean): boolean;
    /**
     * Handles the button states for the filter experience selection.
     * @param {boolean} isDefault - Whether the filter experience is set as default or not.
     */
    handleSelectionButtonStates(isDefault: boolean): void;
    /**
     * Deletes the filter persistence settings for the current selection of filter experiences.
     * @param {Event} event - The event object.
     * @returns {boolean} - Returns true when the settings have been deleted.
     */
    deleteFilterPersistenceSettings(event: Event): boolean;
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
    let CSS: boolean;
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