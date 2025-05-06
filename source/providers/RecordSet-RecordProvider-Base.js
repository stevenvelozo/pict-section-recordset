
const libPictProvider = require('pict-provider');

/**
 * Default configuration for the RecordSetProvider provider.
 * @type {Record<string, any>}
 */
const _DefaultProviderConfiguration = {
	ProviderIdentifier: 'Pict-RecordSetProvider',
	AutoInitialize: true,
	AutoInitializeOrdinal: 0,
	AutoSolveWithApp: false,
};

/**
 * @typedef {Object} RecordSetFilter
 * @property {string} [Entity] - The entity name. Can be used as an override to achieve LiteExtended, etc.
 * @property {string} [FilterString] - A meadow endpoint style filter to apply.
 * @property {number} [Offset] - The starting record number for pagination.
 * @property {number} [PageSize] - The starting record number for pagination.
 * @property {string} [Operation] - The operation to perform (e.g., 'Count').
 */

/**
 * Base record set provider.
 * @extends libPictProvider
 */
class RecordSetProviderBase extends libPictProvider
{
	/**
	 * Creates an instance of RecordSetProvider.
	 * @param {import('fable')} pFable - The Fable object.
	 * @param {Record<string, any>} [pOptions] - Custom options for the provider.
	 * @param {string} [pServiceHash] - The service hash.
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		const tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(_DefaultProviderConfiguration)), pOptions);

		super(pFable, tmpOptions, pServiceHash);

		/** @type {Record<string, any>} */
		this.options;
		/** @type {import('fable')} */
		this.fable;
		/** @type {import('pict')} */
		this.pict;
	}

	/**
	 * Get a record by its ID or GUID.
	 *
	 * @param {string|number} pIDOrGuid - The ID or GUID of the record.
	 */
	async getRecord(pIDOrGuid)
	{
		this.pict.log.info(`RecordSetProviderBase.getRecord(${pIDOrGuid})`);
		return { };
	}

	/**
	 * Get a record by its ID or GUID.
	 *
	 * @param {string|number} pGuid - The ID or GUID of the record.
	 */
	async getRecordByGUID(pGuid)
	{
		this.pict.log.info(`RecordSetProviderBase.getRecordByGUID(${pGuid})`);
		return { };
	}

	/**
	 * Read records from the provider.
	 *
	 * @param {RecordSetFilter} pOptions - Options for the read operation.
	 */
	async getRecords(pOptions)
	{
		this.pict.log.info(`RecordSetProviderBase.getRecords(${JSON.stringify(pOptions)})`);
		return [];
	}

	/**
	 * Read records from the provider.
	 *
	 * @param {RecordSetFilter} pOptions - Options for the read operation.
	 */
	async getRecordSetCount(pOptions)
	{
		this.pict.log.info(`RecordSetProviderBase.getRecordSetCount(${JSON.stringify(pOptions)})`);
		return { Count: 0 };
	}

	/**
	 * Create a new record.
	 *
	 * @param {Record<string, any>} pRecord - The record to create.
	 */
	async createRecord(pRecord)
	{
		this.pict.log.info(`RecordSetProviderBase.createRecord(${JSON.stringify(pRecord)})`);
		return pRecord;
	}

	/**
	 * Update a record.
	 *
	 * @param {Record<string, any>} pRecord - The record to update.
	 */
	async updateRecord(pRecord)
	{
		this.pict.log.info(`RecordSetProviderBase.updateRecord(${JSON.stringify(pRecord)})`);
		return pRecord;
	}

	/**
	 * Delete a record.
	 *
	 * @param {Record<string, any>} pRecord - The record to delete.
	 */
	async deleteRecord(pRecord)
	{
		this.pict.log.info(`RecordSetProviderBase.deleteRecord(${JSON.stringify(pRecord)})`);
	}

	/**
	 * Read a record.
	 *
	 * @param {string|number} pIDOrGuid - The ID or GUID of the record.
	 */
	async readRecord(pIDOrGuid)
	{
		this.pict.log.info(`RecordSetProviderBase.readRecord(${pIDOrGuid})`);
		return { };
	}

	/**
	 * Read records from the provider.
	 *
	 * @param {RecordSetFilter} pOptions - Options for the read operation.
	 */
	async readRecords(pOptions)
	{
		this.pict.log.info(`RecordSetProviderBase.readRecords(${JSON.stringify(pOptions)})`);
		return [];
	}

	/**
	 * Clone a record.
	 *
	 * @param {Record<string, any>} pRecord - The record to clone.
	 */
	async cloneRecord(pRecord)
	{
		return this.createRecord(this.cleanRecord(pRecord));
	}

	/**
	 * Remove any intrinsic identifiers from a record.
	 *
	 * @param {Record<string, any>} pRecord - The record to clean.
	 */
	cleanRecord(pRecord)
	{
		return pRecord;
	}

	/**
	 * @return {Record<string, any>} The schema of the record.
	 */
	get recordSchema()
	{
		return { };
	}
}

module.exports = RecordSetProviderBase;
module.exports.default_configuration = _DefaultProviderConfiguration;
