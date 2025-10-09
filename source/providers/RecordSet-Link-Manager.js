const libPictProvider = require('pict-provider');

/** @type {Record<string, any>} */
const _DEFAULT_PROVIDER_CONFIGURATION =
{
	ProviderIdentifier: 'Pict-RecordSet-LinkManager',

	AutoInitialize: true,
	AutoInitializeOrdinal: 0
}

class PictRecordSetLinkManager extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		/** @type {Record<string, any>} */
		this.options;
		/** @type {import('pict')} */
		this.pict;

		// An array of link templates with a hash, name template and uri template.
		// Format:
		// {
		//   Name: "View Record",
		//   URL: "#/PSRS/{~D:Record.Payload.RecordSet~}/View/{~DVBK:Record.Data:Record.Payload.GUIDAddress~}",
		//   Default: true
		// }
		this.linkTemplates = [];
	}

	/**
	 * TODO: Add the ability to add routes that are scoped to particular entity types
	 *
	 * @param {string} pNameTemplate - The name template for the record link.
	 * @param {string} pURLTemplate - The URL template for the record link.
	 * @param {boolean} pDefault - Whether this is a default link template.
	 *
	 * @return {Record<string, any>} - The link template object that was added.
	 */
	addRecordLinkTemplate(pNameTemplate, pURLTemplate, pDefault)
	{
		let tmpDefaultAction = (typeof(pDefault) !== 'undefined') ? pDefault : false;

		const tmpLinkTemplateObject = (
			{
				Name: pNameTemplate,
				URL: pURLTemplate,
				Default: tmpDefaultAction
			});

		this.linkTemplates.push(tmpLinkTemplateObject);

		return tmpLinkTemplateObject;
	}
}

module.exports = PictRecordSetLinkManager;
module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;
