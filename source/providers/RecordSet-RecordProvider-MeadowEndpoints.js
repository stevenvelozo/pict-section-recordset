
const libRecordSetProviderBase = require('./RecordSet-RecordProvider-Base.js');

/**
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetFilter} RecordSetFilter
 * @typedef {import('./RecordSet-RecordProvider-Base.js').RecordSetResult} RecordSetResult
 */

/**
 * Class representing a data change detection provider for Pict dynamic forms.
 * @extends libRecordSetProviderBase
 */
class MeadowEndpointsRecordSetProvider extends libRecordSetProviderBase
{
	/**
	 * Creates an instance of RecordSetProvider.
	 * @param {import('pict')} pFable - The Fable object.
	 * @param {Record<string, any>} [pOptions] - Custom options for the provider.
	 * @param {string} [pServiceHash] - The service hash.
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		/** @type {Record<string, any>} */
		this.options;
		/** @type {import('pict') & {
		 *      log: any,
		 *      services:
		 *      {
		 *			PictSectionRecordSet: InstanceType<import('../Pict-Section-RecordSet.js')>,
		 *			[key: string]: any,
		 *		},
		 *      instantiateServiceProviderWithoutRegistration: (hash: String) => any,
		 *      PictSectionRecordSet: InstanceType<import('../Pict-Section-RecordSet.js')>
		 *  }} */
		this.pict;
		this.fable = this.pict;
		/** @type {string} */
		this.Hash;
		/** @type {string} */
		this.UUID;
		//TODO: make this typedef better
		/** @type {Record<string, any>} */
		this._Schema = { };
	}

	/** @return {import('pict/types/source/Pict-Meadow-EntityProvider.js')} */
	get entityProvider()
	{
		/** @type {import('pict/types/source/Pict-Meadow-EntityProvider.js')} */
		//TODO: figure out a pattern to share this with other consumers, to consolidate cache
		this._EntityProvider = this.pict.instantiateServiceProviderWithoutRegistration('EntityProvider');
		if (this.options.URLPrefix)
		{
			this._EntityProvider.options.urlPrefix = this.options.URLPrefix;
		}
		return this._EntityProvider;
	}

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
		// FIXME: The GUIDS are returning false to isNaN so this doesn't work
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
			this.entityProvider.getEntity(this.options.Entity, pIDOrGuid, (pError, pResult) =>
			{
				if (pError)
				{
					return reject(pError);
				}
				resolve(pResult);
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
			this.entityProvider.getEntitySet(this.options.Entity, `FBV~GUID${this.options.Entity}~EQ~${encodeURIComponent(pGuid)}`, (pError, pResult) =>
			{
				if (pError)
				{
					return reject(pError);
				}
				if (pResult.length > 1)
				{
					this.pict.log.error(`Multiple ${this.options.Entity} records found for GUID ${pGuid}`, { Records: pResult });
				}
				resolve(pResult[0]);
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
		const tmpEntity = pOptions.Entity || this.options.Entity;
		if (this.pict.LogNoisiness > 1)
		{
			this.pict.log.info(`Reading ${tmpEntity} records`, { Options: pOptions });
		}
		return new Promise((resolve, reject) =>
		{
			// using a space here, otherwise you get a `//` in the URL which breaks some stuff
			this.entityProvider.getEntitySetPage(tmpEntity, pOptions.FilterString ? pOptions.FilterString : ' ', pOptions.Offset || 0, pOptions.PageSize || 250, (pError, pResult) =>
			{
				if (pError)
				{
					return reject(pError);
				}
				resolve({ Records: pResult, Facets: { } });
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
		const tmpEntity = pOptions.Entity || this.options.Entity;
		if (this.pict.LogNoisiness > 1)
		{
			this.pict.log.info(`Counting ${tmpEntity} records`, { Options: pOptions });
		}
		//TODO: lite support / other variants?
		return new Promise((resolve, reject) =>
		{
			this.entityProvider.getEntitySetRecordCount(tmpEntity, pOptions.FilterString, (pError, pCount) =>
			{
				if (pError)
				{
					return reject(pError);
				}
				resolve({ Count: pCount });
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
			this.entityProvider.restClient.postJSON({
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
			this.entityProvider.restClient.putJSON({
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
			this.entityProvider.restClient.delJSON({
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
		super.onInitializeAsync((pError) =>
		{
			this.initializeEntitySchema(() =>
			{
				return fCallback(pError);
			});
		});
	}

	/**
	 * @param {(error?: Error) => void} fCallback - The callback function.
	 */
	initializeEntitySchema(fCallback)
	{
		this.fable.log.info('Initializing RecordSetProvider-MeadowEndpoints');
		const checkSession = this.pict.services.PictSectionRecordSet ? this.pict.services.PictSectionRecordSet.checkSession.bind(this.pict.services.PictSectionRecordSet) : async () => true;
		checkSession('Schema').then(async (supported) =>
		{
			if (!supported)
			{
				return fCallback();
			}
			this.entityProvider.restClient.getJSON(`${this.options.URLPrefix}${this.options.Entity}/Schema`, (error, response, result) =>
			{
				if (error)
				{
					throw error;
				}
				this._Schema = result;
				return fCallback(null);
			});
		}).catch((error) =>
		{
			this._Schema = null;
			this.fable.log.error('Error checking session for schema', error);
			return fCallback(error);
		});
	}

	async getRecordSchema()
	{
		if (!this._Schema)
		{
			await new Promise((resolve, reject) => this.initializeEntitySchema((pError) =>
			{
				if (pError)
				{
					return reject(pError);
				}
				resolve();
			}));
		}
		return this._Schema;
	}

	/**
	 * Abstract decoration method for core records. Subclasses should implement this method to decorate records with additional information.
	 *
	 * @param {Array<Record<string, any>>} pRecords - The records to decorate.
	 * @return {Promise<void>}
	 */
	async decorateCoreRecords(pRecords)
	{
		if (!this.options.RecordDecorationConfiguration)
		{
			return;
		}
		if (!Array.isArray(this.options.RecordDecorationConfiguration))
		{
			this.pict.log.error('RecordDecorationConfiguration is not an array', { RecordDecorationConfiguration: this.options.RecordDecorationConfiguration });
			return;
		}
		this.pict.Bundle[this.Hash] = { CoreEntityRecordSubset: pRecords };
		const config = [{ Type: 'SetStateAddress', StateAddress: `Bundle[${this.Hash}]` }].concat(this.options.RecordDecorationConfiguration);

		try
		{
			await new Promise((resolve, reject) => this.pict.EntityProvider.gatherDataFromServer(config, (err) =>
			{
				if (err)
				{
					return reject(err);
				}
				resolve();
			}));
		}
		catch (error)
		{
			this.pict.log.error(`MeadowEndpointsRecordSetProvider: Error gathering data from server for record decoration: ${error.message}`, { Stack: error.stack });
		}
	}
}

module.exports = MeadowEndpointsRecordSetProvider;
