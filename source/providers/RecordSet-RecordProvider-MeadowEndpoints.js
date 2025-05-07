
const libRecordSetProviderBase = require('./RecordSet-RecordProvider-Base.js');

/**
 * @typedef {(error?: Error, result?: any) => void} RestClientCallback
 *
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetFilter} RecordSetFilter
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetResult} RecordSetResult
 *
 * @typedef {{
 *  getJSON(pOptionsOrURL: string | Record<string, any>, fCallback: RestClientCallback): void,
 *  putJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  postJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  patchJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  headJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  delJSON(pOptions: Record<string, any>, fCallback: RestClientCallback): void,
 *  getRawText(pOptionsOrURL: string | Record<string, any>, fCallback: RestClientCallback): void,
 * }} RestClient
 */

/**
 * Class representing a data change detection provider for Pict dynamic forms.
 * @extends libRecordSetProviderBase
 */
class RecordSetProvider extends libRecordSetProviderBase
{
	/**
	 * Creates an instance of RecordSetProvider.
	 * @param {import('fable')} pFable - The Fable object.
	 * @param {Record<string, any>} [pOptions] - Custom options for the provider.
	 * @param {string} [pServiceHash] - The service hash.
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		/** @type {RestClient} */
		this.restClient;
		/** @type {Record<string, any>} */
		this.options;
		/** @type {import('fable')} */
		this.fable;
		/** @type {import('pict')} */
		this.pict;
		//TODO: make this typedef better
		/** @type {Record<string, any>} */
		this._Schema = { };
	}

	/**
	 * @typedef {(error?: Error, result?: T) => void} RecordSetCallback
	 * @template T = Record<string, any>
	 */

	/**
	 * Get a record by its ID or GUID.
	 *
	 * @param {string|number} pIDOrGuid - The ID or GUID of the record.
	 */
	async getRecord(pIDOrGuid)
	{
		if (!this.options.Entity)
		{
			throw new Error('Entity is not defined in the provider options.');
		}
		if (typeof pIDOrGuid === 'string' && isNaN(parseInt(pIDOrGuid)))
		{
			return this.getRecordByGUID(pIDOrGuid);
		}
		if (this.pict.LogNoisiness > 1)
		{
			this.pict.log.info(`Reading ${this.options.Entity} record by ID`, { ID: pIDOrGuid });
		}
		return new Promise((resolve, reject) =>
		{
			this.restClient.getJSON(`${this.options.URLPrefix}${this.options.Entity}/${pIDOrGuid}`, (error, response, result) =>
			{
				if (error)
				{
					return reject(error);
				}
				resolve(result);
			});
		});
	}

	/**
	 * Get a record by its ID or GUID.
	 *
	 * @param {string|number} pGuid - The ID or GUID of the record.
	 */
	async getRecordByGUID(pGuid)
	{
		if (!this.options.Entity)
		{
			throw new Error('Entity is not defined in the provider options.');
		}
		if (this.pict.LogNoisiness > 1)
		{
			this.pict.log.info(`Reading ${this.options.Entity} record by GUID`, { GUID: pGuid });
		}
		return new Promise((resolve, reject) =>
		{
			this.restClient.getJSON(`${this.options.URLPrefix}${this.options.Entity}s/FilteredTo/FBV~GUID${this.options.Entity}~EQ~${encodeURIComponent(pGuid)}`, (error, response, result) =>
			{
				if (error)
				{
					return reject(error);
				}
				resolve(result[0]);
			});
		});
	}

	/**
	 * Read records from the provider.
	 *
	 * @param {RecordSetFilter} pOptions - Options for the read operation.
	 * @return {Promise<RecordSetResult>} - The result of the read operation.
	 */
	async getRecords(pOptions)
	{
		if (!this.options.Entity && !pOptions.Entity)
		{
			throw new Error('Entity is not defined in the provider options.');
		}
		if (this.pict.LogNoisiness > 1)
		{
			this.pict.log.info(`Reading ${this.options.Entity} records`, { Options: pOptions });
		}
		const filterString = pOptions.FilterString ? `/FilteredTo/${pOptions.FilterString}` : '';
		const pagination = `/${pOptions.Offset || 0}/${pOptions.PageSize || 250}`;
		//TODO: lite support / other variants?
		return new Promise((resolve, reject) =>
		{
			this.restClient.getJSON(`${this.options.URLPrefix}${this.options.Entity || pOptions.Entity}s${filterString}${pagination}`, (error, response, result) =>
			{
				if (error)
				{
					return reject(error);
				}
				resolve({ Records: result, Facets: { } });
			});
		});
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
		return this.getRecords({ FilterString: pFilterString, Offset: pOffset, PageSize: pPageSize });
	}

	/**
	 * Read records from the provider.
	 *
	 * @param {RecordSetFilter} pOptions - Options for the read operation.
	 */
	async getRecordSetCount(pOptions)
	{
		if (!this.options.Entity && !pOptions.Entity)
		{
			throw new Error('Entity is not defined in the provider options.');
		}
		if (this.pict.LogNoisiness > 1)
		{
			this.pict.log.info(`Counting ${this.options.Entity} records`, { Options: pOptions });
		}
		const filterString = pOptions.FilterString ? `/FilteredTo/${pOptions.FilterString}` : '';
		//TODO: lite support / other variants?
		return new Promise((resolve, reject) =>
		{
			this.restClient.getJSON(`${this.options.URLPrefix}${this.options.Entity || pOptions.Entity}s/Count${filterString}`, (error, response, result) =>
			{
				if (error)
				{
					return reject(error);
				}
				resolve(result);
			});
		});
	}

	/**
	 * Create a new record.
	 *
	 * @param {Record<string, any>} pRecord - The record to create.
	 */
	async createRecord(pRecord)
	{
		return new Promise((resolve, reject) =>
		{
		if (this.pict.LogNoisiness > 1)
		{
			this.pict.log.info(`Creating record ${this.options.Entity}`, { Record: pRecord });
		}
			this.restClient.postJSON({
				url: `${this.options.URLPrefix}${this.options.Entity}`,
				body: pRecord,
			}, (error, response, result) =>
			{
				if (error)
				{
					return reject(error);
				}
				resolve(result);
			});
		});
	}

	/**
	 * Update a record.
	 *
	 * @param {Record<string, any>} pRecord - The record to update.
	 */
	async updateRecord(pRecord)
	{
		if (this.pict.LogNoisiness > 1)
		{
			this.pict.log.info(`Updating record ${this.options.Entity} ${pRecord[`ID${this.options.Entity}`]}`);
		}
		return new Promise((resolve, reject) =>
		{
			this.restClient.putJSON({
				url: `${this.options.URLPrefix}${this.options.Entity}`,
				body: pRecord,
			}, (error, response, result) =>
			{
				if (error)
				{
					return reject(error);
				}
				resolve(result);
			});
		});
	}

	/**
	 * Delete a record.
	 *
	 * @param {Record<string, any>} pRecord - The record to delete.
	 */
	async deleteRecord(pRecord)
	{
		if (this.pict.LogNoisiness > 1)
		{
			this.pict.log.info(`Deleting record ${this.options.Entity} ${pRecord[`ID${this.options.Entity}`]}`);
		}
		return new Promise((resolve, reject) =>
		{
			this.restClient.delJSON({
				url: `${this.options.URLPrefix}${this.options.Entity}/${pRecord[`ID${this.options.Entity}`]}`,
				body: pRecord,
			}, (error, response, result) =>
			{
				if (error)
				{
					return reject(error);
				}
				resolve(result);
			});
		});
	}

	/**
	 * Read a record.
	 *
	 * @param {string|number} pIDOrGuid - The ID or GUID of the record.
	 */
	async readRecord(pIDOrGuid)
	{
		return this.getRecord(pIDOrGuid);
	}

	/**
	 * Read records from the provider.
	 *
	 * @param {RecordSetFilter} pOptions - Options for the read operation.
	 * @return {Promise<RecordSetResult>} - The result of the read operation.
	 */
	async readRecords(pOptions)
	{
		return this.getRecords(pOptions);
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
		delete pRecord[`ID${this.options.Entity}`];
		delete pRecord[`GUID${this.options.Entity}`];
		return pRecord;
	}

	/**
	 * @param {(error?: Error) => void} fCallback - The callback function.
	 */
	onInitializeAsync(fCallback)
	{
		this.fable.log.info('Initializing RecordSetProvider-MeadowEndpoints');
		this.restClient = this.fable.RestClient;
		this.restClient.getJSON(`${this.options.URLPrefix}${this.options.Entity}/Schema`, (error, response, result) =>
		{
			if (error)
			{
				this._Schema = { };
				return fCallback(error);
			}
			this._Schema = result;
			return fCallback(null);
		});
	}

	get recordSchema()
	{
		return this._Schema;
	}
}

module.exports = RecordSetProvider;
