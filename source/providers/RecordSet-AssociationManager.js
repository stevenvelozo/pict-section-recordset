const libPictProvider = require('pict-provider');

/** @type {Record<string, any>} */
const _DEFAULT_PROVIDER_CONFIGURATION =
{
	ProviderIdentifier: 'Pict-RecordSet-AssociationManager',

	AutoInitialize: true,
	AutoInitializeOrdinal: 0
};

/**
 * Central registry + data layer for joined-entity ASSOCIATIONS (the `XxxYyyJoin` convention: a join
 * row carrying its own `ID<Join>` plus an `ID<X>` and an `ID<Y>` pointing at either side).
 *
 * One `Association` is defined ONCE, symmetrically, with a `SideA` and a `SideB`. The UI (the
 * read-tab Association Editor and the Bulk Associate screen) resolves which side is "this side" by
 * matching the rendering recordset's name against the two sides — so opting Book→Authors and
 * Author→Books in are independent, light-config decisions.
 *
 * All join + display reads/writes go through the shared, cached `pict.EntityProvider` (the same one
 * the picker uses), so there is no bespoke REST plumbing and lookups de-duplicate across the app.
 */
class PictRecordSetAssociationManager extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		/** @type {Record<string, any>} */
		this.options;
		/** @type {import('pict')} */
		this.pict;

		/** @type {Record<string, Record<string, any>>} - Registered associations keyed by hash. */
		this.associations = {};

		/** @type {Record<string, any>} - Lazily-created EntityProviders scoped to a non-default URL prefix. */
		this._scopedEntityProviders = {};
	}

	/**
	 * Normalize one side definition, filling the light-config defaults: `Entity` falls back to
	 * `RecordSet`, `IDField` to `ID<Entity>`, `DisplayField` to `Name`, `SearchFields` to
	 * `[DisplayField]`, and `Sort` to `DisplayField`.
	 *
	 * @param {Record<string, any>} pSide
	 * @return {Record<string, any>}
	 */
	_normalizeSide(pSide)
	{
		const tmpSide = pSide || {};
		const tmpEntity = tmpSide.Entity || tmpSide.RecordSet;
		const tmpDisplayField = tmpSide.DisplayField || 'Name';
		return {
			RecordSet: tmpSide.RecordSet || tmpEntity,
			Entity: tmpEntity,
			IDField: tmpSide.IDField || `ID${tmpEntity}`,
			DisplayField: tmpDisplayField,
			SearchFields: (Array.isArray(tmpSide.SearchFields) && tmpSide.SearchFields.length > 0) ? tmpSide.SearchFields : [ tmpDisplayField ],
			// No default sort: alphabetical-by-display sorts empty values first (blank rows). The picker's
			// natural (PK) order is predictable; a host can opt into a Sort column explicitly.
			Sort: tmpSide.Sort || false,
			Title: tmpSide.Title || false,
			URLPrefix: tmpSide.URLPrefix || '',
			// Extra fields rendered as disambiguation chips in the picker (and the editor list), e.g.
			// ['ISBN'] or [{ Field: 'PublicationYear', Label: 'Year' }]. Passed to the picker as EntityTags.
			ChipFields: Array.isArray(tmpSide.ChipFields) ? tmpSide.ChipFields : [],
			// Columns for the matrix screen's record table — for picking complex records by several fields.
			TableColumns: this._normalizeColumns(tmpSide.TableColumns, tmpDisplayField),
		};
	}

	/**
	 * Normalize a side's TableColumns into `{ Key, DisplayName, Template? }` entries (string shorthand →
	 * `{ Key, DisplayName: Key }`). Defaults to a single column on the DisplayField when unset.
	 *
	 * @param {Array<string|Record<string, any>>|undefined} pColumns @param {string} pDisplayField
	 * @return {Array<Record<string, any>>}
	 */
	_normalizeColumns(pColumns, pDisplayField)
	{
		if (!Array.isArray(pColumns) || pColumns.length < 1)
		{
			return [ { Key: pDisplayField, DisplayName: pDisplayField } ];
		}
		return pColumns.map((pColumn) =>
		{
			if (typeof pColumn === 'string') { return { Key: pColumn, DisplayName: pColumn, DefaultHidden: false }; }
			return { Key: pColumn.Key, DisplayName: pColumn.DisplayName || pColumn.Key, Template: pColumn.Template || false, DefaultHidden: (pColumn.DefaultHidden === true) };
		});
	}

	/**
	 * Build a FoxHound LIKE filter for a search term across one or more fields (single → AND, multiple →
	 * OR'd in a paren group), mirroring the picker's entity search. Used by the matrix table fetch.
	 *
	 * @param {Array<string>} pSearchFields @param {string} pTerm
	 * @return {string}
	 */
	_buildSearchFilter(pSearchFields, pTerm)
	{
		const tmpEncoded = encodeURIComponent(`%${pTerm}%`);
		if (pSearchFields.length === 1)
		{
			return `FBV~${pSearchFields[0]}~LK~${tmpEncoded}`;
		}
		const tmpInner = pSearchFields.map((pField, pIndex) => `${pIndex === 0 ? 'FBV' : 'FBVOR'}~${pField}~LK~${tmpEncoded}`).join('~');
		return `FOP~0~(~0~${tmpInner}~FCP~0~)~0`;
	}

	/**
	 * Fetch one page of a side's records for the matrix table (search across its SearchFields + optional
	 * Sort, offset/limit paging). Returns the raw records + a `hasMore` flag.
	 *
	 * @param {string} pAssociationHash @param {string} pRecordSetName
	 * @param {string} pSearch @param {number} pCursor @param {number} pPageSize
	 * @return {Promise<{records: Array<Record<string, any>>, hasMore: boolean}>}
	 */
	fetchSidePage(pAssociationHash, pRecordSetName, pSearch, pCursor, pPageSize)
	{
		const tmpSides = this.resolveSides(pAssociationHash, pRecordSetName);
		if (!tmpSides)
		{
			return Promise.resolve({ records: [], hasMore: false });
		}
		const tmpSide = tmpSides.thisSide;
		const tmpEntityProvider = this._entityProvider(tmpSide.URLPrefix);
		const tmpStanzas = [];
		if (pSearch) { tmpStanzas.push(this._buildSearchFilter(tmpSide.SearchFields, pSearch)); }
		if (tmpSide.Sort) { tmpStanzas.push(`FSF~${tmpSide.Sort}~ASC~0`); }
		const tmpFilter = tmpStanzas.filter(Boolean).join('~');
		return new Promise((resolve) =>
		{
			tmpEntityProvider.getEntitySetPage(tmpSide.Entity, tmpFilter, pCursor, pPageSize, (pError, pRecords) =>
			{
				const tmpList = (!pError && Array.isArray(pRecords)) ? pRecords : [];
				if (pError) { this.pict.log.warn(`AssociationManager: matrix fetch failed for ${tmpSide.Entity}.`, pError); }
				return resolve({ records: tmpList, hasMore: (tmpList.length >= pPageSize) });
			});
		});
	}

	/**
	 * Register (or replace) an association definition.
	 *
	 * @param {string} pHash - Unique association hash (the `Association` key hosts reference).
	 * @param {Record<string, any>} pDefinition - `{ JoinEntity, JoinURLPrefix?, DefaultJoinValues?, SideA, SideB }`.
	 * @return {Record<string, any>|false} The normalized association, or false on invalid input.
	 */
	addAssociation(pHash, pDefinition)
	{
		if (!pHash || !pDefinition || !pDefinition.JoinEntity || !pDefinition.SideA || !pDefinition.SideB)
		{
			this.pict.log.error(`AssociationManager: addAssociation called with invalid definition for [${pHash}].`, pDefinition);
			return false;
		}
		const tmpAssociation = {
			Hash: pHash,
			JoinEntity: pDefinition.JoinEntity,
			JoinURLPrefix: pDefinition.JoinURLPrefix || '',
			DefaultJoinValues: pDefinition.DefaultJoinValues || {},
			SideA: this._normalizeSide(pDefinition.SideA),
			SideB: this._normalizeSide(pDefinition.SideB),
		};
		this.associations[pHash] = tmpAssociation;
		return tmpAssociation;
	}

	/**
	 * @param {string} pHash
	 * @return {Record<string, any>|undefined}
	 */
	getAssociation(pHash)
	{
		return this.associations[pHash];
	}

	/**
	 * Resolve which side of an association is "this side" (the rendering recordset) vs the "other side"
	 * (the one being associated). Matches on `RecordSet` first, then `Entity`.
	 *
	 * @param {string} pAssociationHash
	 * @param {string} pThisRecordSetName
	 * @return {{ association: Record<string, any>, thisSide: Record<string, any>, otherSide: Record<string, any> }|false}
	 */
	resolveSides(pAssociationHash, pThisRecordSetName)
	{
		const tmpAssociation = this.associations[pAssociationHash];
		if (!tmpAssociation)
		{
			this.pict.log.warn(`AssociationManager: no association registered for hash [${pAssociationHash}].`);
			return false;
		}
		if (tmpAssociation.SideA.RecordSet === pThisRecordSetName || tmpAssociation.SideA.Entity === pThisRecordSetName)
		{
			return { association: tmpAssociation, thisSide: tmpAssociation.SideA, otherSide: tmpAssociation.SideB };
		}
		if (tmpAssociation.SideB.RecordSet === pThisRecordSetName || tmpAssociation.SideB.Entity === pThisRecordSetName)
		{
			return { association: tmpAssociation, thisSide: tmpAssociation.SideB, otherSide: tmpAssociation.SideA };
		}
		this.pict.log.warn(`AssociationManager: recordset [${pThisRecordSetName}] is neither side of association [${pAssociationHash}].`);
		return false;
	}

	/**
	 * The EntityProvider to use for a given URL prefix. The shared (cached) `pict.EntityProvider` for the
	 * default prefix; a lazily-created, prefix-scoped instance otherwise (mirrors the recordset provider).
	 *
	 * @param {string} [pURLPrefix]
	 * @return {any}
	 */
	_entityProvider(pURLPrefix)
	{
		if (!pURLPrefix)
		{
			return this.pict.EntityProvider;
		}
		if (!this._scopedEntityProviders[pURLPrefix])
		{
			const tmpProvider = this.pict.instantiateServiceProviderWithoutRegistration('EntityProvider');
			tmpProvider.options.urlPrefix = pURLPrefix;
			this._scopedEntityProviders[pURLPrefix] = tmpProvider;
		}
		return this._scopedEntityProviders[pURLPrefix];
	}

	/**
	 * The join entity's identity column for an association (`ID<JoinEntity>`).
	 * @param {Record<string, any>} pAssociation
	 * @return {string}
	 */
	getJoinIDField(pAssociation)
	{
		return `ID${pAssociation.JoinEntity}`;
	}

	/**
	 * Compose a side's ChipFields into display chip strings for a record — the same `ISBN` / `{Field,
	 * Label, Template}` spec the picker's EntityTags uses, so the editor's current-associations list shows
	 * the same disambiguation chips as the add picker.
	 *
	 * @param {Array<string|Record<string, any>>} pChipFields
	 * @param {Record<string, any>} pRecord
	 * @return {Array<any>}
	 */
	composeChips(pChipFields, pRecord)
	{
		if (!Array.isArray(pChipFields) || pChipFields.length < 1 || !pRecord)
		{
			return [];
		}
		return pChipFields
			.map((pSpec) =>
			{
				if (typeof pSpec === 'string') { return pRecord[pSpec]; }
				if (pSpec && typeof pSpec === 'object')
				{
					const tmpValue = pSpec.Template ? this.pict.parseTemplate(pSpec.Template, pRecord) : pRecord[pSpec.Field];
					if (tmpValue === undefined || tmpValue === null || tmpValue === '') { return ''; }
					return pSpec.Label ? `${pSpec.Label}: ${tmpValue}` : tmpValue;
				}
				return '';
			})
			.filter((pChip) => (pChip !== undefined && pChip !== null && pChip !== ''));
	}

	/**
	 * Fetch the raw join rows for one anchor record (this side's id).
	 *
	 * @param {string} pAssociationHash
	 * @param {string} pThisRecordSetName
	 * @param {string|number} pThisID
	 * @return {Promise<Array<Record<string, any>>>}
	 */
	listJoinRecords(pAssociationHash, pThisRecordSetName, pThisID)
	{
		const tmpSides = this.resolveSides(pAssociationHash, pThisRecordSetName);
		if (!tmpSides || pThisID === undefined || pThisID === null || pThisID === '')
		{
			return Promise.resolve([]);
		}
		const tmpEntityProvider = this._entityProvider(tmpSides.association.JoinURLPrefix);
		const tmpFilter = `FBV~${tmpSides.thisSide.IDField}~EQ~${encodeURIComponent(pThisID)}`;
		return new Promise((resolve) =>
		{
			tmpEntityProvider.getEntitySet(tmpSides.association.JoinEntity, tmpFilter, (pError, pRecords) =>
			{
				if (pError)
				{
					this.pict.log.warn(`AssociationManager: failed to list ${tmpSides.association.JoinEntity} for ${tmpSides.thisSide.IDField}=${pThisID}.`, pError);
					return resolve([]);
				}
				return resolve(Array.isArray(pRecords) ? pRecords : []);
			});
		});
	}

	/**
	 * Fetch the join rows for MANY "this side" ids at once (`FBL~<thisIDField>~INN~<ids>`). Drives the
	 * dual-column matrix screen's existing-pair dedup, so cross-linking never creates duplicate joins.
	 *
	 * @param {string} pAssociationHash
	 * @param {string} pThisRecordSetName
	 * @param {Array<string|number>} pThisIDs
	 * @return {Promise<Array<Record<string, any>>>}
	 */
	listJoinRecordsForIDs(pAssociationHash, pThisRecordSetName, pThisIDs)
	{
		const tmpSides = this.resolveSides(pAssociationHash, pThisRecordSetName);
		if (!tmpSides || !Array.isArray(pThisIDs) || pThisIDs.length < 1)
		{
			return Promise.resolve([]);
		}
		const tmpEntityProvider = this._entityProvider(tmpSides.association.JoinURLPrefix);
		const tmpFilter = `FBL~${tmpSides.thisSide.IDField}~INN~${pThisIDs.join(',')}`;
		return new Promise((resolve) =>
		{
			tmpEntityProvider.getEntitySet(tmpSides.association.JoinEntity, tmpFilter, (pError, pRecords) =>
			{
				if (pError)
				{
					this.pict.log.warn(`AssociationManager: failed to list ${tmpSides.association.JoinEntity} for ${tmpSides.thisSide.IDField} IN (${pThisIDs.join(',')}).`, pError);
					return resolve([]);
				}
				return resolve(Array.isArray(pRecords) ? pRecords : []);
			});
		});
	}

	/**
	 * The other-side ids currently associated with one anchor record (for culling the picker).
	 *
	 * @param {string} pAssociationHash
	 * @param {string} pThisRecordSetName
	 * @param {string|number} pThisID
	 * @return {Promise<Array<any>>}
	 */
	async listAssociatedIDs(pAssociationHash, pThisRecordSetName, pThisID)
	{
		const tmpSides = this.resolveSides(pAssociationHash, pThisRecordSetName);
		if (!tmpSides)
		{
			return [];
		}
		const tmpJoins = await this.listJoinRecords(pAssociationHash, pThisRecordSetName, pThisID);
		return tmpJoins
			.map((pJoin) => pJoin[tmpSides.otherSide.IDField])
			.filter((pValue) => (pValue !== undefined && pValue !== null && pValue !== ''));
	}

	/**
	 * Resolve the other-side records currently associated with one anchor, decorated for the list UI:
	 * `{ JoinID, OtherID, Display, OtherRecord, JoinRecord }`. One join row per item (so the remove
	 * button can delete the exact join record), with the other-side display resolved in a single
	 * `FBL~<otherIDField>~INN~<ids>` fetch.
	 *
	 * @param {string} pAssociationHash
	 * @param {string} pThisRecordSetName
	 * @param {string|number} pThisID
	 * @return {Promise<Array<Record<string, any>>>}
	 */
	async listAssociatedRecords(pAssociationHash, pThisRecordSetName, pThisID)
	{
		const tmpSides = this.resolveSides(pAssociationHash, pThisRecordSetName);
		if (!tmpSides)
		{
			return [];
		}
		const tmpJoinIDField = this.getJoinIDField(tmpSides.association);
		const tmpJoins = await this.listJoinRecords(pAssociationHash, pThisRecordSetName, pThisID);
		const tmpOtherIDs = tmpJoins
			.map((pJoin) => pJoin[tmpSides.otherSide.IDField])
			.filter((pValue) => (pValue !== undefined && pValue !== null && pValue !== ''));

		let tmpByID = {};
		if (tmpOtherIDs.length > 0)
		{
			const tmpEntityProvider = this._entityProvider(tmpSides.otherSide.URLPrefix);
			const tmpFilter = `FBL~${tmpSides.otherSide.IDField}~INN~${tmpOtherIDs.join(',')}`;
			const tmpOthers = await new Promise((resolve) =>
			{
				tmpEntityProvider.getEntitySet(tmpSides.otherSide.Entity, tmpFilter, (pError, pRecords) =>
				{
					if (pError)
					{
						this.pict.log.warn(`AssociationManager: failed to resolve ${tmpSides.otherSide.Entity} display records.`, pError);
						return resolve([]);
					}
					return resolve(Array.isArray(pRecords) ? pRecords : []);
				});
			});
			for (let i = 0; i < tmpOthers.length; i++)
			{
				tmpByID[tmpOthers[i][tmpSides.otherSide.IDField]] = tmpOthers[i];
			}
		}

		return tmpJoins
			.filter((pJoin) => (pJoin[tmpSides.otherSide.IDField] !== undefined && pJoin[tmpSides.otherSide.IDField] !== null && pJoin[tmpSides.otherSide.IDField] !== ''))
			.map((pJoin) =>
			{
				const tmpOtherID = pJoin[tmpSides.otherSide.IDField];
				const tmpOtherRecord = tmpByID[tmpOtherID] || {};
				const tmpDisplay = (tmpOtherRecord[tmpSides.otherSide.DisplayField] !== undefined && tmpOtherRecord[tmpSides.otherSide.DisplayField] !== null && tmpOtherRecord[tmpSides.otherSide.DisplayField] !== '')
					? tmpOtherRecord[tmpSides.otherSide.DisplayField]
					: `#${tmpOtherID}`;
				return {
					JoinID: pJoin[tmpJoinIDField],
					OtherID: tmpOtherID,
					Display: tmpDisplay,
					Chips: this.composeChips(tmpSides.otherSide.ChipFields, tmpOtherRecord).map((pChip) => ({ Text: pChip })),
					OtherRecord: tmpOtherRecord,
					JoinRecord: pJoin,
				};
			});
	}

	/**
	 * Create one join row linking an anchor record to an other-side record. Stamps any configured
	 * `DefaultJoinValues` (e.g. a constant tenant id). The join's GUID is auto-generated server-side.
	 *
	 * @param {string} pAssociationHash
	 * @param {string} pThisRecordSetName
	 * @param {string|number} pThisID
	 * @param {string|number} pOtherID
	 * @return {Promise<Record<string, any>>}
	 */
	createJoin(pAssociationHash, pThisRecordSetName, pThisID, pOtherID)
	{
		const tmpSides = this.resolveSides(pAssociationHash, pThisRecordSetName);
		if (!tmpSides)
		{
			return Promise.reject(new Error(`AssociationManager: cannot create join for [${pAssociationHash}] from [${pThisRecordSetName}].`));
		}
		const tmpRecord = Object.assign({}, tmpSides.association.DefaultJoinValues);
		tmpRecord[tmpSides.thisSide.IDField] = pThisID;
		tmpRecord[tmpSides.otherSide.IDField] = pOtherID;
		const tmpEntityProvider = this._entityProvider(tmpSides.association.JoinURLPrefix);
		return new Promise((resolve, reject) =>
		{
			tmpEntityProvider.createEntity(tmpSides.association.JoinEntity, tmpRecord, (pError, pBody) =>
			{
				if (pError)
				{
					return reject(pError);
				}
				return resolve(pBody);
			});
		});
	}

	/**
	 * Delete one join row (the row a list item carries as `JoinRecord`, or any record with the join id).
	 *
	 * @param {string} pAssociationHash
	 * @param {Record<string, any>} pJoinRecord
	 * @return {Promise<Record<string, any>>}
	 */
	removeJoin(pAssociationHash, pJoinRecord)
	{
		const tmpAssociation = this.associations[pAssociationHash];
		if (!tmpAssociation || !pJoinRecord)
		{
			return Promise.reject(new Error(`AssociationManager: cannot remove join for [${pAssociationHash}].`));
		}
		const tmpJoinID = pJoinRecord[this.getJoinIDField(tmpAssociation)];
		const tmpEntityProvider = this._entityProvider(tmpAssociation.JoinURLPrefix);
		return new Promise((resolve, reject) =>
		{
			tmpEntityProvider.deleteEntity(tmpAssociation.JoinEntity, tmpJoinID, (pError, pBody) =>
			{
				if (pError)
				{
					return reject(pError);
				}
				return resolve(pBody);
			});
		});
	}

	/**
	 * Build a `createEntityPicker` config for one side, optionally culling a live set of ids (a function
	 * so the cull re-evaluates on every search as associations change).
	 *
	 * @param {Record<string, any>} pSide - A normalized side.
	 * @param {(() => Array<any>)|false} pGetExcludedIDsFn - Returns ids to exclude (NIN), or falsy for none.
	 * @param {Record<string, any>} [pOverrides] - Extra picker options (DestinationAddress, ValueAddress, Mode, OnChange, …).
	 * @return {Record<string, any>}
	 */
	_pickerConfigForSide(pSide, pGetExcludedIDsFn, pOverrides)
	{
		const tmpConfig = {
			Entity: pSide.Entity,
			ValueField: pSide.IDField,
			TextField: pSide.DisplayField,
			SearchFields: pSide.SearchFields,
			Sort: pSide.Sort,
		};
		// Disambiguation chips (ISBN, year, …) — the picker renders these as badges on each option/chip.
		// TagLast so they sit AFTER the label ("Title  ISBN  Year"), matching the editor list rows.
		if (Array.isArray(pSide.ChipFields) && pSide.ChipFields.length > 0)
		{
			tmpConfig.EntityTags = pSide.ChipFields;
			tmpConfig.TagLast = true;
		}
		if (typeof pGetExcludedIDsFn === 'function')
		{
			tmpConfig.BaseFilter = () =>
			{
				const tmpIDs = pGetExcludedIDsFn();
				return (Array.isArray(tmpIDs) && tmpIDs.length > 0) ? `FBL~${pSide.IDField}~NIN~${tmpIDs.join(',')}` : '';
			};
		}
		return Object.assign(tmpConfig, pOverrides || {});
	}

	/**
	 * Picker config for the OTHER side of an association (the records being associated), culling the
	 * currently-associated ids.
	 *
	 * @param {string} pAssociationHash
	 * @param {string} pThisRecordSetName
	 * @param {(() => Array<any>)|false} pGetExcludedIDsFn
	 * @param {Record<string, any>} [pOverrides]
	 * @return {Record<string, any>|false}
	 */
	buildOtherPickerConfig(pAssociationHash, pThisRecordSetName, pGetExcludedIDsFn, pOverrides)
	{
		const tmpSides = this.resolveSides(pAssociationHash, pThisRecordSetName);
		if (!tmpSides)
		{
			return false;
		}
		return this._pickerConfigForSide(tmpSides.otherSide, pGetExcludedIDsFn, pOverrides);
	}

	/**
	 * Picker config for the ANCHOR side of an association (the bulk screen's "pick a record to associate
	 * to" control). No cull.
	 *
	 * @param {string} pAssociationHash
	 * @param {string} pAnchorRecordSetName
	 * @param {Record<string, any>} [pOverrides]
	 * @return {Record<string, any>|false}
	 */
	buildAnchorPickerConfig(pAssociationHash, pAnchorRecordSetName, pOverrides)
	{
		const tmpSides = this.resolveSides(pAssociationHash, pAnchorRecordSetName);
		if (!tmpSides)
		{
			return false;
		}
		return this._pickerConfigForSide(tmpSides.thisSide, false, pOverrides);
	}
}

module.exports = PictRecordSetAssociationManager;
module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;
