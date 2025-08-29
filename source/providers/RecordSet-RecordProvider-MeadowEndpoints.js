
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
		this._Schema;
		/** @type {Record<string, Record<string, any>>} */
		this._Experiences = { };
		/** @type {Record<string, Record<string, any>>} */
		this._FiltersByField = { };
	}

	/** @return {import('pict/types/source/Pict-Meadow-EntityProvider.js')} */
	get entityProvider()
	{
		if (!this._EntityProvider)
		{
			/** @type {import('pict/types/source/Pict-Meadow-EntityProvider.js')} */
			//TODO: figure out a pattern to share this with other consumers, to consolidate cache
			this._EntityProvider = this.pict.instantiateServiceProviderWithoutRegistration('EntityProvider');
			if (this.options.URLPrefix)
			{
				this._EntityProvider.options.urlPrefix = this.options.URLPrefix;
			}
		}

		return this._EntityProvider;
	}

	/**
	 * @return {Array<string>} - The fields to ignore for filter availability.
	 */
	get ignoreFilterFields()
	{
		if (Array.isArray(this.options.IgnoreFilterFields))
		{
			return this.options.IgnoreFilterFields;
		}
		return [];
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

	_prepareFilterState(pEntity, pOptions, pFilterExperienceResultAddress = 'Records')
	{
		const tmpClauses = [].concat(this.pict.Bundle._ActiveFilterState?.[pOptions.Entity || this.options.Entity]?.FilterClauses || []);
		const tmpExperience = Object.assign({}, this.pict.Bundle._ActiveFilterState?.[pOptions.Entity || this.options.Entity]?.Experience || {});
		if (!tmpExperience.ResultDestinationAddress)
		{
			tmpExperience.ResultDestinationAddress = `Bundle._ActiveFilterState[\`${this.options.RecordSet}\`].${pFilterExperienceResultAddress}`;
		}
		if (!tmpExperience.Entity)
		{
			tmpExperience.Entity = pEntity;
		}
		if (pOptions.FilterString && typeof pOptions.FilterString === 'string' && pOptions.FilterString.trim().length > 0)
		{
			tmpClauses.push({ Type: 'RawFilter', Value: pOptions.FilterString });
		}
		return [ tmpClauses, tmpExperience ];
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
			const [ tmpClauses, tmpExperience ] = this._prepareFilterState(tmpEntity, pOptions);
			this.pict.providers.FilterManager.loadRecordPageByFilterUsingProvider(this.entityProvider, tmpClauses, tmpExperience, pOptions.Offset || 0, pOptions.PageSize || 250, (pError) =>
			{
				if (pError)
				{
					return reject(pError);
				}
				resolve({ Records: this.pict.resolveStateFromAddress(tmpExperience.ResultDestinationAddress), Facets: { } });
			});
			// using a space here, otherwise you get a `//` in the URL which breaks some stuff
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
			const [ tmpClauses, tmpExperience ] = this._prepareFilterState(tmpEntity, pOptions, 'Count');
			this.pict.providers.FilterManager.countRecordsByFilterUsingProivider(this.entityProvider, tmpClauses, tmpExperience, (pError) =>
			{
				if (pError)
				{
					return reject(pError);
				}
				resolve({ Count: this.pict.resolveStateFromAddress(tmpExperience.ResultDestinationAddress) });
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
	 * @param {string} pSchemaField - The schema field name.
	 * @param {Record<string, any>} pColumn - The full column definition from the schema.
	 * @param {Record<string, any>} [pMeadowSchemaField] - The meadow schema field definition.
	 */
	getFieldFilterClauses(pSchemaField, pColumn, pMeadowSchemaField)
	{
		/** @type {Record<string, any>} */
		let tmpRangeClause;
		let tmpFieldFilterClauses = this.options.FieldFilterClauses?.[pSchemaField];
		if (!Array.isArray(tmpFieldFilterClauses))
		{
			let tmpFieldType = pColumn.type;
			if (pMeadowSchemaField && typeof pMeadowSchemaField.Type === 'string')
			{
				tmpFieldType = pMeadowSchemaField.Type.toLowerCase();
			}
			tmpFieldFilterClauses = [];
			const tmpFieldHumanName = this._getHumanReadableFieldName(pSchemaField);
			const isUserAuditField = ['CreatingIDUser', 'DeletingIDUser', 'UpdatingIDUser'].includes(pSchemaField);
			const customFilterClauses = this.options.Filters?.[pSchemaField];
			if (pSchemaField.startsWith('ID') || pSchemaField.startsWith('ParentID') || isUserAuditField || customFilterClauses)
			{
				for (const customField of Array.isArray(customFilterClauses) ? customFilterClauses : [customFilterClauses])
				{
					const remoteTableName = customField?.RemoteTable || pSchemaField.split('ID')[1];
					const fieldName = isUserAuditField ? this._getHumanReadableFieldName(pSchemaField) : this._getHumanReadableEntityName(remoteTableName);
					tmpFieldFilterClauses.push(Object.assign(
					{
						"Label": `${ fieldName }`,
						"Type": "InternalJoinSelectedValueList",
						"ExternalFilterByColumns": remoteTableName === 'User' ? [ 'NameFirst', 'NameLast' ] : [ 'Name' ],
						"ExternalRecordDisplayTemplate": remoteTableName === 'User' ? '{~D:Record.Data.NameFirst~} {~D:Record.Data.NameLast~}' : '{~D:Record.Name~}',
						"CoreConnectionColumn": pSchemaField,
						"RemoteTable": `${ remoteTableName }`,
						"JoinExternalConnectionColumn": `ID${ remoteTableName }`,
						"JoinInternalConnectionColumn": pSchemaField,
						'DisplayName': `Selected Records`,
						'Ordinal': tmpFieldFilterClauses.length + 1,
						'FilterKey': pSchemaField,
						'ClauseKey': `${pSchemaField}_Selected`
					}, customField));
				}
			}
			else
			{
				switch (tmpFieldType)
				{
					case 'string':
					case 'autoguid':
						tmpFieldFilterClauses.push({ FilterKey: pSchemaField, ClauseKey: `${pSchemaField}_Match_Exact`, DisplayName: `Exact Match`, Type: 'StringMatch', FilterByColumn: pSchemaField, ExactMatch: true, Ordinal: tmpFieldFilterClauses.length + 1 });
						tmpFieldFilterClauses.push({ FilterKey: pSchemaField, ClauseKey: `${pSchemaField}_Match_Fuzzy`, DisplayName: `Partial Match`, Type: 'StringMatch', FilterByColumn: pSchemaField, ExactMatch: false , Ordinal: tmpFieldFilterClauses.length + 1 });
						tmpRangeClause = { FilterKey: pSchemaField, ClauseKey: `${pSchemaField}_Range`, DisplayName: `In Range`, Type: 'StringRange', FilterByColumn: pSchemaField , Ordinal: tmpFieldFilterClauses.length + 1 };
						tmpRangeClause.MinimumLabel = `Minimum ${tmpFieldHumanName}`;
						tmpRangeClause.MaximumLabel = `Maximum ${tmpFieldHumanName}`;
						tmpFieldFilterClauses.push(tmpRangeClause);
						break;
					case 'date':
					case 'datetime':
					case 'createdate':
					case 'updatedate':
						tmpFieldFilterClauses.push({ FilterKey: pSchemaField, ClauseKey: `${pSchemaField}_Match_Exact`, DisplayName: `Exact Match`, Type: 'DateMatch', FilterByColumn: pSchemaField, ExactMatch: true , Ordinal: tmpFieldFilterClauses.length + 1 });
						tmpFieldFilterClauses.push({ FilterKey: pSchemaField, ClauseKey: `${pSchemaField}_Match_Fuzzy`, DisplayName: `Partial Match`, Type: 'DateMatch', FilterByColumn: pSchemaField, ExactMatch: false , Ordinal: tmpFieldFilterClauses.length + 1 });
						tmpRangeClause = { FilterKey: pSchemaField, ClauseKey: `${pSchemaField}_Range`, DisplayName: `In Range`, Type: 'DateRange', FilterByColumn: pSchemaField , Ordinal: tmpFieldFilterClauses.length + 1 };
						tmpRangeClause.MinimumLabel = `Minimum ${tmpFieldHumanName}`;
						tmpRangeClause.MaximumLabel = `Maximum ${tmpFieldHumanName}`;
						tmpFieldFilterClauses.push(tmpRangeClause);
						break;
					case 'boolean': //TODO: we didn't add filters for this - they are just numeric but it's weird for the user, maybe we should add views for this that account for the difference
					case 'deleted':
					case 'integer':
					case 'decimal':
					case 'autoidentity':
					case 'createiduser':
					case 'updateiduser':
					case 'deleteiduser':
						tmpFieldFilterClauses.push({ FilterKey: pSchemaField, ClauseKey: `${pSchemaField}_Match_Exact`, DisplayName: `Exact Match`, Type: 'NumericMatch', FilterByColumn: pSchemaField, ExactMatch: true , Ordinal: tmpFieldFilterClauses.length + 1 });
						tmpFieldFilterClauses.push({ FilterKey: pSchemaField, ClauseKey: `${pSchemaField}_Match_Fuzzy`, DisplayName: `Partial Match`, Type: 'NumericMatch', FilterByColumn: pSchemaField, ExactMatch: false , Ordinal: tmpFieldFilterClauses.length + 1 });
						tmpRangeClause = { FilterKey: pSchemaField, ClauseKey: `${pSchemaField}_Range`, DisplayName: `In Range`, Type: 'NumericRange', FilterByColumn: pSchemaField , Ordinal: tmpFieldFilterClauses.length + 1 };
						tmpRangeClause.MinimumLabel = `Minimum ${tmpFieldHumanName}`;
						tmpRangeClause.MaximumLabel = `Maximum ${tmpFieldHumanName}`;
						tmpFieldFilterClauses.push(tmpRangeClause);
						break;
					default:
						this.pict.log.warn(`Unsupported field type ${pColumn.type} for field ${pSchemaField}`, { Schema: pColumn });
				}
			}
		}
		return tmpFieldFilterClauses;
	}

	/**
	 * @param {(error?: Error) => void} fCallback - The callback function.
	 */
	onInitializeAsync(fCallback)
	{
		super.onInitializeAsync((pError) =>
		{
			//FIXME: load the most recent experience from local storage using the other provider
			//       how do we control the initialization order of the providers?
			if (this.options.FilterExperiences && typeof this.options.FilterExperiences === 'object' && !Array.isArray(this.options.FilterExperiences))
			{
				this.pict.Bundle._ActiveFilterState = this.pict.Bundle._ActiveFilterState || {};
				this.pict.Bundle._ActiveFilterState[this.options.RecordSet] = this.pict.Bundle._ActiveFilterState[this.options.RecordSet] || {};
				const tmpEntityFilterState = this.pict.Bundle._ActiveFilterState[this.options.RecordSet];
				tmpEntityFilterState.Experience = tmpEntityFilterState.Experience || {};
				for (const tmpKey of Object.keys(this.options.FilterExperiences))
				{
					const tmpExperience = this.options.FilterExperiences[tmpKey];
					if (!tmpExperience.FilterCriteriaHash && !Array.isArray(tmpExperience.FilterClauses))
					{
						this.log.warn(`Filter experience ${tmpKey} has invalid Criteria`, { Experience: tmpExperience });
						continue;
					}
					if (tmpExperience.FilterCriteriaHash)
					{
						// load from hash
						const tmpClauses = this.pict.providers.FilterManager.getFilterCriteria(tmpExperience.FilterCriteriaHash);
						if (!tmpClauses)
						{
							this.pict.log.warn(`Filter experience ${tmpKey} filter criteria hash ${tmpExperience.FilterCriteriaHash} not found`, { Experience: tmpExperience });
							continue;
						}
						//TODO: handle Ordinal / generate if missing
						this._Experiences[tmpKey] = JSON.parse(JSON.stringify(tmpExperience));
						this._Experiences[tmpKey].FilterClauses = JSON.parse(JSON.stringify(tmpClauses));
						for (const tmpClause of this._Experiences[tmpKey].FilterClauses)
						{
							tmpClause.FilterCriteriaHash = tmpExperience.FilterCriteriaHash;
							if (!tmpClause.FilterByColumn && !tmpClause.CoreConnectionColumn && !tmpClause.JoinInternalConnectionColumn)
							{
								this.log.warn(`Filter experience ${tmpKey} clause does not have filter by column configured`, { Clause: tmpClause });
								continue;
							}
							if (tmpClause.FilterDefinitionHash)
							{
								const tmpFilter = this.pict.providers.FilterManager.getFilter(tmpClause.FilterDefinitionHash);
								if (!tmpFilter)
								{
									this.pict.log.warn(`Filter experience ${tmpKey} filter criteria hash ${tmpClause.FilterDefinitionHash} not found`, { Experience: tmpExperience });
									continue;
								}
								Object.assign(tmpClause, tmpFilter); //TODO: is there a risk of leakage here?
								if (tmpClause.FilterByColumn && typeof tmpClause.Type === 'string')
								{
									if (tmpClause.Type.startsWith('InternalJoin'))
									{
										tmpClause.JoinInternalConnectionColumn = tmpClause.FilterByColumn;
									}
									else if (tmpClause.Type.startsWith('ExternalJoin'))
									{
										tmpClause.CoreConnectionColumn = tmpClause.FilterByColumn;
									}
								}
							}
						}
						if (tmpExperience.Default && !tmpEntityFilterState.FilterClauses)
						{
							tmpEntityFilterState.FilterClauses = JSON.parse(JSON.stringify(this._Experiences[tmpKey].FilterClauses));
							for (const tmpClause of tmpEntityFilterState.FilterClauses)
							{
								tmpClause.Hash = `${tmpClause.FilterByColumn}-${tmpClause.Type}-${this.pict.getUUID()}`;
							}
						}
						continue;
					}
					this._Experiences[tmpKey] = JSON.parse(JSON.stringify(tmpExperience));
					if (tmpExperience.Default && !tmpEntityFilterState.FilterClauses)
					{
						tmpEntityFilterState.FilterClauses = JSON.parse(JSON.stringify(tmpExperience.FilterClauses));
					}
				}
			}
			this.initializeEntitySchema(() =>
			{
				if (pError)
				{
					return fCallback(pError);
				}
				this.initializeFilterSchema();
				return fCallback();
			});
		});
	}

	/**
	 * @param {string} pEntity - The schema field name.
	 * @return {string} - The human-readable name for the entity.
	 */
	_getHumanReadableEntityName(pEntity)
	{
		return pEntity.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space before capital letters
	}

	/**
	 * @param {string} pSchemaField - The schema field name.
	 * @return {string} - The human-readable name for the schema field.
	 */
	_getHumanReadableFieldName(pSchemaField)
	{
		if (!this._Schema || !this._Schema.properties || !this._Schema.properties[pSchemaField])
		{
			return pSchemaField;
		}
		if (pSchemaField === `ID${this.options.Entity}`)
		{
			return `${this._getHumanReadableEntityName(this.options.Entity)} Unique Database ID`;
		}
		if (pSchemaField === `GUID${this.options.Entity}`)
		{
			return `${this._getHumanReadableEntityName(this.options.Entity)} Unique Identifier`;
		}
		if (pSchemaField === 'CreatingIDUser')
		{
			return 'Created By User';
		}
		if (pSchemaField === 'CreateDate')
		{
			return 'Date Created';
		}
		if (pSchemaField === 'UpdatingIDUser')
		{
			return 'Last Updated By User';
		}
		if (pSchemaField === 'UpdateDate')
		{
			return 'Date Last Updated';
		}
		if (pSchemaField.startsWith('ID'))
		{
			return this._getHumanReadableEntityName(pSchemaField.split('ID')[1]);
		}
		if (pSchemaField.startsWith('ParentID'))
		{
			return 'Parent ' + this._getHumanReadableEntityName(pSchemaField.split('ID')[1]);
		}
		return pSchemaField.replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
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
					this.fable.log.error(`Error fetching schema: ${error?.message || error}`, { Stack: error?.stack });
					this._Schema = null;
					return fCallback(error);
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

	initializeFilterSchema()
	{
		const tmpSchema = this._Schema;
		if (!tmpSchema || !tmpSchema.properties)
		{
			return;
		}
		const tmpProperties = tmpSchema?.properties;
		// loop through the schema and add the columns to the tableCells
		let tmpOrdinal = 0;
		for (const tmpSchemaField in tmpProperties)
		{
			if (this.ignoreFilterFields.includes(tmpSchemaField))
			{
				continue;
			}
			++tmpOrdinal;
			const tmpColumn = tmpProperties[tmpSchemaField];
			const tmpMeadowSchemaField = tmpSchema.MeadowSchema?.Schema?.find?.((f) => f.Column === tmpSchemaField);
			let tmpFieldFilterSchema = this._FilterSchema[tmpSchemaField];
			if (!tmpFieldFilterSchema)
			{
				this._FilterSchema[tmpSchemaField] = tmpFieldFilterSchema = { };
			}
			if (!tmpFieldFilterSchema.FilterKey)
			{
				tmpFieldFilterSchema.FilterKey = tmpSchemaField;
			}
			if (!tmpFieldFilterSchema.RecordSet)
			{
				tmpFieldFilterSchema.RecordSet = this.options.RecordSet;
			}
			if (!tmpFieldFilterSchema.DisplayName)
			{
				tmpFieldFilterSchema.DisplayName = this._getHumanReadableFieldName(tmpSchemaField);
			}
			if (!tmpFieldFilterSchema.Description)
			{
				tmpFieldFilterSchema.Description = `Filter by ${tmpFieldFilterSchema.DisplayName}`;
			}
			if (!tmpFieldFilterSchema.HelpText)
			{
				tmpFieldFilterSchema.HelpText = `Filter by ${tmpFieldFilterSchema.DisplayName} for the ${this._getHumanReadableEntityName(this.options.Entity)} entity.`;
			}
			if (tmpFieldFilterSchema.Ordinal == null)
			{
				tmpFieldFilterSchema.Ordinal = tmpOrdinal;
			}
			if (!Array.isArray(tmpFieldFilterSchema.AvailableClauses))
			{
				tmpFieldFilterSchema.AvailableClauses = [];
			}
			const tmpFieldFilterClauses = this.getFieldFilterClauses(tmpSchemaField, tmpColumn, tmpMeadowSchemaField);
			if (Array.isArray(tmpFieldFilterClauses) && tmpFieldFilterClauses.length > 0)
			{
				for (const tmpFilterClause of tmpFieldFilterClauses)
				{
					//TODO: allow customization of filter order
					tmpFilterClause.Ordinal = tmpFieldFilterSchema.AvailableClauses.length + 1;
					tmpFieldFilterSchema.AvailableClauses.push(tmpFilterClause);
				}
			}
		}
		if (typeof this.pict.providers.FilterManager.filters === 'object')
		{
			for (const tmpFilterKey of Object.keys(this.pict.providers.FilterManager.filters))
			{
				const tmpFilterClause = this.pict.providers.FilterManager.filters[tmpFilterKey];
				if (tmpFilterClause.CoreConnectionColumn === `ID${this.options.Entity}`)
				{
					//FIXME: I don't think using filter key is right here
					let tmpFieldFilterSchema = this._FilterSchema[tmpFilterKey];
					if (!tmpFieldFilterSchema)
					{
						this._FilterSchema[tmpFilterKey] = tmpFieldFilterSchema = { };
					}
					if (!tmpFieldFilterSchema.FilterKey)
					{
						tmpFieldFilterSchema.FilterKey = tmpFilterKey;
					}
					if (!tmpFieldFilterSchema.RecordSet)
					{
						tmpFieldFilterSchema.RecordSet = this.options.RecordSet;
					}
					const tmpFieldHumanName = this._getHumanReadableFieldName(tmpFilterKey);
					if (tmpFilterClause.DisplayName)
					{
						tmpFieldFilterSchema.DisplayName = tmpFilterClause.DisplayName;
					}
					if (!tmpFieldFilterSchema.DisplayName)
					{
						tmpFieldFilterSchema.DisplayName = tmpFieldHumanName;
					}
					if (!tmpFieldFilterSchema.Description)
					{
						tmpFieldFilterSchema.Description = tmpFilterClause.Description || `Filter by ${tmpFieldFilterSchema.DisplayName}`;
					}
					if (!tmpFieldFilterSchema.HelpText)
					{
						tmpFieldFilterSchema.HelpText = tmpFilterClause.HelpText || `Filter by ${tmpFieldFilterSchema.DisplayName} for the ${this._getHumanReadableEntityName(this.options.Entity)} entity.`;
					}
					if (tmpFieldFilterSchema.Ordinal == null)
					{
						tmpFieldFilterSchema.Ordinal = tmpOrdinal;
					}
					if (!Array.isArray(tmpFieldFilterSchema.AvailableClauses))
					{
						tmpFieldFilterSchema.AvailableClauses = [];
					}
					tmpFieldFilterSchema.AvailableClauses.push(tmpFilterClause);
					if (!tmpFilterClause.FilterKey)
					{
						tmpFilterClause.FilterKey = tmpFilterKey;
					}
					if (!tmpFilterClause.ClauseKey)
					{
						tmpFilterClause.ClauseKey = tmpFilterKey;
					}
					if (!tmpFilterClause.DisplayName)
					{
						tmpFilterClause.DisplayName = tmpFieldHumanName;
					}
					tmpFilterClause.Ordinal = tmpFieldFilterSchema.AvailableClauses.length + 1;
				}
			}
		}
	}

	/**
	 * @return {Promise<Record<string, any>>} The schema of the record.
	 */
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
				this.initializeFilterSchema();
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
