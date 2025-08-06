
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
 * @typedef {Object} RecordSetSearchRangeFacet
 * @property {string} Field - The field to facet on. Only indexed fields can be faceted.
 * @property {any} Start - The start of the range. (ex. 1900)
 * @property {any} End - The end of the range. (ex. 2025)
 * @property {any} Gap - The gap between range values. (ex. 25)
 * TODO: Support auto-generating ranges based on the data at rest?
 */

/**
 * @typedef {Object} RecordSetSearchFacetPayload
 * @property {boolean} [ReturnRecords] - If false, search will return facets only, not records.
 * @property {Array<string>} Fields - Requests to facet on all unique values of the given fields.
 * @property {Array<RecordSetSearchRangeFacet>} Ranges - Requests to facet on given ranges of field values.
 * TODO: support facet on custom query?
 */

/**
 * @typedef {Object} RecordSetResult
 * @property {Array<Record<string, any>>} Records - The records returned from the provider.
 * @property {Record<string, Record<string, number>> & { ByRange?: Record<string, number> }} Facets - The facets returned from the provider.
 */

/**
 * @typedef {Object} RecordSetFilter
 * @property {string} [Entity] - The entity name. Can be used as an override to achieve LiteExtended, etc.
 * @property {string} [FilterString] - A meadow endpoint style filter to apply.
 * @property {number} [Offset] - The starting record number for pagination.
 * @property {number} [PageSize] - The starting record number for pagination.
 * @property {RecordSetSearchFacetPayload} [Facets] - The faceting config for the search.
 */

/**
 * Base record set provider.
 * @extends libPictProvider
 */
class RecordSetProviderBase extends libPictProvider
{
	/**
	 * Creates an instance of RecordSetProvider.
	 * @param {import('pict')} pFable - The Fable object.
	 * @param {Record<string, any>} [pOptions] - Custom options for the provider.
	 * @param {string} [pServiceHash] - The service hash.
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		const tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(_DefaultProviderConfiguration)), pOptions);

		super(pFable, tmpOptions, pServiceHash);

		/** @type {Record<string, any>} */
		this.options;
		/** @type {import('pict')} */
		this.fable;
		/** @type {import('pict')} */
		this.pict;

		/** @type {Record<string, any>} */
		this._FilterSchema = { };
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

	/*
	get availableFilters()
	{
		return { IDBook: [ 'NumericMatch', 'NumericRange', 'ExternalJoinBookByAuthor' ], Title: [ 'StringMatch', 'StringRange' ] };
	}
	*/

	/**
	 * Read records from the provider.
	 *
	 * @param {RecordSetFilter} pOptions - Options for the read operation.
	 * @return {Promise<RecordSetResult>} - The result of the read operation.
	 */
	async getRecords(pOptions)
	{
		this.pict.log.info(`RecordSetProviderBase.getRecords(${JSON.stringify(pOptions)})`);
		return { Records: [], Facets: { } };
	}

	/**
	 * Read records from the provider.
	 *
	 * @param {RecordSetFilter} pOptions - Options for the read operation.
	 *
	 * @return {Promise<RecordSetResult>} - The result of the read operation.
	 */
	async getDecoratedRecords(pOptions)
	{
		const tmpRecords = await this.getRecords(pOptions);
		await this.decorateCoreRecords(tmpRecords.Records);
		return tmpRecords;
	}

	/**
	 * Read records from the provider.
	 *
	 * @param {string} [pFilterString] - The filter string to apply.
	 * @param {number} [pOffset] - The starting record number for pagination.
	 * @param {number} [pPageSize] - The number of records to return.
	 * @return {Promise<RecordSetResult>} - The result of the read operation.
	 */
	async getRecordsInline(pFilterString = '', pOffset = 0, pPageSize = 250)
	{
		this.pict.log.info(`RecordSetProviderBase.getRecordsInline(${pFilterString}, ${pOffset}, ${pPageSize})`);
		return { Records: [], Facets: { } };
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
	 * @return {Promise<Record<string, any>>} - The created record.
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
	 * @return {Promise<Record<string, any>>} - The updated record.
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
	 * @return {Promise<void>}
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
	 * @return {Promise<RecordSetResult>} - The result of the read operation.
	 */
	async readRecords(pOptions)
	{
		this.pict.log.info(`RecordSetProviderBase.readRecords(${JSON.stringify(pOptions)})`);
		return { Records: [], Facets: { } };
	}

	/**
	 * Clone a record.
	 *
	 * @param {Record<string, any>} pRecord - The record to clone.
	 * @return {Promise<Record<string, any>>} - The cloned record.
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

	/**
	 * Abstract decoration method for core records. Subclasses should implement this method to decorate records with additional information.
	 *
	 * @param {Array<Record<string, any>>} pRecords - The records to decorate.
	 * @return {Promise<void>}
	 */
	async decorateCoreRecords(pRecords)
	{
	}

	/**
	 * @return {Promise<Record<string, any>>} The schema of the record.
	 */
	async getRecordSchema()
	{
		throw new Error(`getRecordSchema must be implemented in a sub-class`);
	}

	/**
	 * @return {Array<string>} The keys of the filter schema.
	 */
	getFilterSchemaKeys()
	{
		return Object.keys(this._FilterSchema);
	}

	/**
	 * @param {string} pFilterKey - The filter key to get the schema for.
	 *
	 * @return {Record<string, any>} The schema for the filter clause.
	 */
	getFilterClauseSchemaForKey(pFilterKey)
	{
		return this._FilterSchema?.[pFilterKey];
	}

	/**
	 * @return {Record<string, Record<string, any>>} The schema for the filter clauses.
	 */
	getFilterSchema()
	{
		//FIXME: risk here that the schema hasn't been loaded - but don't want to make this async...
		/** @type {Record<string, Record<string, any>>} */
		const tmpSchema = {};
		for (const tmpKey of this.getFilterSchemaKeys())
		{
			tmpSchema[tmpKey] = this.getFilterClauseSchemaForKey(tmpKey);
		}
		return tmpSchema;
	}

	/**
	 * @param {string} pFilterKey - The filter key to add the clause for.
	 * @param {string} pClauseKey - The clause key to add.
	 */
	addFilterClause(pFilterKey, pClauseKey)
	{
		let tmpClause = this.getFilterClauseSchemaForKey(pFilterKey)?.AvailableClauses?.find?.((c) => c.ClauseKey == pClauseKey);
		if (!tmpClause)
		{
			this.pict.log.error(`RecordSetProviderBase.addFilterClause() - No filter clause schema found for key ${pFilterKey} and clause ${pClauseKey}.`);
			return;
		}
		tmpClause = JSON.parse(JSON.stringify(tmpClause));
		tmpClause.Hash = `${pFilterKey}-${pClauseKey}-${this.pict.getUUID()}`;
		tmpClause.Label = tmpClause.Label || tmpClause.DisplayName;
		const tmpClauses = this.getFilterClauses();
		tmpClauses.push(tmpClause);
	}

	/**
	 */
	clearFilterClauses()
	{
		const tmpClauses = this.pict.Bundle._ActiveFilterState?.[this.options.RecordSet]?.FilterClauses;
		if (!Array.isArray(tmpClauses))
		{
			return;
		}
		tmpClauses.length = 0; // Clear the array
	}

	/**
	 * @param {string} pSpecificFilterClauseHash - The hash of the specific filter clause to remove.
	 */
	removeFilterClause(pSpecificFilterClauseHash)
	{
		const tmpClauses = this.pict.Bundle._ActiveFilterState?.[this.options.RecordSet]?.FilterClauses;
		if (!Array.isArray(tmpClauses))
		{
			this.pict.log.error('RecordSetProviderBase.removeFilterClause() - No filter clauses found.');
			return;
		}
		const tmpClauseIndex = tmpClauses.findIndex((c) => pSpecificFilterClauseHash == c.Hash);
		if (tmpClauseIndex < 0)
		{
			this.pict.log.error(`RecordSetProviderBase.removeFilterClause() - Filter clause with hash ${pSpecificFilterClauseHash} not found.`);
			return;
		}
		tmpClauses.splice(tmpClauseIndex, 1);
	}

	/**
	 * @return {Array<Record<string, any>>} The filter clauses.
	 */
	getFilterClauses()
	{
		let tmpClauses = this.pict.Bundle._ActiveFilterState?.[this.options.RecordSet]?.FilterClauses;
		if (!Array.isArray(tmpClauses))
		{
			tmpClauses = [];
			this.pict.Bundle._ActiveFilterState = this.pict.Bundle._ActiveFilterState || {};
			this.pict.Bundle._ActiveFilterState[this.options.RecordSet] = this.pict.Bundle._ActiveFilterState[this.options.RecordSet] || {};
			this.pict.Bundle._ActiveFilterState[this.options.RecordSet].FilterClauses = tmpClauses;
		}
		return tmpClauses;
	}

	/**
	 * @param {string} pSpecificFilterClauseHash - The hash of the specific filter clause to move.
	 * @param {number} pOrdinal - The ordinal position to move the filter clause to.
	 */
	moveFilterClauseTo(pSpecificFilterClauseHash, pOrdinal)
	{
		const tmpClauses = this.pict.Bundle._ActiveFilterState?.[this.options.RecordSet]?.FilterClauses;
		if (!Array.isArray(tmpClauses))
		{
			this.pict.log.error('RecordSetProviderBase.moveFilterClauseTo() - No filter clauses found.');
			return;
		}
		if (pOrdinal < 0 || pOrdinal >= tmpClauses.length)
		{
			this.pict.log.error(`RecordSetProviderBase.moveFilterClauseTo() - Invalid ordinal ${pOrdinal}.`);
			return;
		}
		const tmpClauseIndex = tmpClauses.indexOf((c) => pSpecificFilterClauseHash == c.Hash);
		if (tmpClauseIndex < 0)
		{
			this.pict.log.error(`RecordSetProviderBase.moveFilterClauseTo() - Filter clause with hash ${pSpecificFilterClauseHash} not found.`);
			return;
		}
		const tmpClause = tmpClauses.splice(tmpClauseIndex, 1)[0];
		tmpClauses.splice(pOrdinal, 0, tmpClause);
	}

	/**
	 * @param {string} pSpecificFilterClauseHash - The hash of the specific filter clause to move.
	 * @param {number} pOrdinalOffset - The ordinal offset to move the filter clause by.
	 */
	moveFilterClauseBy(pSpecificFilterClauseHash, pOrdinalOffset)
	{
		const tmpClauses = this.pict.Bundle._ActiveFilterState?.[this.options.RecordSet]?.FilterClauses;
		if (!Array.isArray(tmpClauses))
		{
			this.pict.log.error('RecordSetProviderBase.moveFilterClauseBy() - No filter clauses found.');
			return;
		}
		const tmpClauseIndex = tmpClauses.indexOf((c) => pSpecificFilterClauseHash == c.Hash);
		if (tmpClauseIndex < 0)
		{
			this.pict.log.error(`RecordSetProviderBase.moveFilterClauseBy() - Filter clause with hash ${pSpecificFilterClauseHash} not found.`);
			return;
		}
		const tmpNewOrdinal = tmpClauseIndex + pOrdinalOffset;
		if (tmpNewOrdinal < 0 || tmpNewOrdinal >= tmpClauses.length)
		{
			this.pict.log.error(`RecordSetProviderBase.moveFilterClauseBy() - Invalid new ordinal ${tmpNewOrdinal} (offset of ${pOrdinalOffset} for original ordinal ${tmpClauseIndex}).`);
			return;
		}
		const tmpClause = tmpClauses.splice(tmpClauseIndex, 1)[0];
		tmpClauses.splice(tmpNewOrdinal, 0, tmpClause);
	}
}

module.exports = RecordSetProviderBase;
module.exports.default_configuration = _DefaultProviderConfiguration;
