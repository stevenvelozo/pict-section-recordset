/*
	Unit tests for the RecordSet AssociationManager — the registry + data layer behind the Association
	read-tab editor and the Bulk Associate screen. The shared EntityProvider is stubbed so these tests
	exercise the pure association logic (side resolution, defaults, picker-cull filters, join CRUD
	payloads, list decoration) with no network.
*/

const libBrowserEnv = require('browser-env');

const Chai = require('chai');
const Expect = Chai.expect;

const libPict = require('pict');

const libAssociationManager = require('../source/providers/RecordSet-AssociationManager.js');

suite
(
	'PictSectionRecordSet AssociationManager',
	() =>
	{
		let _Pict;
		let _Manager;
		let _Stub;

		setup(() =>
		{
			libBrowserEnv({ url: 'http://localhost/' });
			_Pict = new libPict();
			_Pict.LogNoisiness = 0;

			_Manager = _Pict.addProvider('RecordSetAssociationManager', {}, libAssociationManager);

			// Stub the EntityProvider: capture every call, and return canned data keyed by entity.
			_Stub =
			{
				calls: [],
				JoinRows: [],
				OtherRows: [],
				getEntitySet: (pEntity, pFilter, fCallback) =>
				{
					_Stub.calls.push([ 'getEntitySet', pEntity, pFilter ]);
					if (pEntity === 'BookAuthorJoin' || pEntity === 'BookStoreCatalogJoin') { return fCallback(null, _Stub.JoinRows); }
					return fCallback(null, _Stub.OtherRows);
				},
				createEntity: (pEntity, pRecord, fCallback) =>
				{
					_Stub.calls.push([ 'createEntity', pEntity, pRecord ]);
					return fCallback(null, Object.assign({ [`ID${pEntity}`]: 999 }, pRecord));
				},
				deleteEntity: (pEntity, pID, fCallback) =>
				{
					_Stub.calls.push([ 'deleteEntity', pEntity, pID ]);
					return fCallback(null, {});
				},
			};
			// Every prefix resolves to the stub for these tests.
			_Manager._entityProvider = () => _Stub;

			_Manager.addAssociation('BookAuthor',
				{
					JoinEntity: 'BookAuthorJoin',
					SideA: { RecordSet: 'Book',   IDField: 'IDBook',   DisplayField: 'Title', SearchFields: [ 'Title' ] },
					SideB: { RecordSet: 'Author', IDField: 'IDAuthor', DisplayField: 'Name' },
				});
		});

		suite
		(
			'Definition + side resolution',
			() =>
			{
				test('normalizes the light-config side defaults', () =>
				{
					_Manager.addAssociation('Sparse', { JoinEntity: 'WidgetGadgetJoin', SideA: { Entity: 'Widget' }, SideB: { RecordSet: 'Gadget' } });
					const tmpAssociation = _Manager.getAssociation('Sparse');
					Expect(tmpAssociation.SideA.IDField).to.equal('IDWidget', 'IDField defaults to ID<Entity>.');
					Expect(tmpAssociation.SideA.DisplayField).to.equal('Name', 'DisplayField defaults to Name.');
					Expect(tmpAssociation.SideA.SearchFields).to.deep.equal([ 'Name' ], 'SearchFields defaults to [DisplayField].');
					Expect(tmpAssociation.SideB.Entity).to.equal('Gadget', 'Entity defaults to RecordSet.');
					Expect(tmpAssociation.SideB.IDField).to.equal('IDGadget', 'IDField derives from the defaulted Entity.');
				});

				test('rejects an invalid definition', () =>
				{
					Expect(_Manager.addAssociation('Bad', { SideA: {}, SideB: {} })).to.equal(false, 'missing JoinEntity is rejected.');
					Expect(_Manager.getAssociation('Bad')).to.equal(undefined);
				});

				test('resolves "this side" from each recordset', () =>
				{
					const tmpFromBook = _Manager.resolveSides('BookAuthor', 'Book');
					Expect(tmpFromBook.thisSide.Entity).to.equal('Book');
					Expect(tmpFromBook.otherSide.Entity).to.equal('Author');
					Expect(tmpFromBook.otherSide.IDField).to.equal('IDAuthor');

					const tmpFromAuthor = _Manager.resolveSides('BookAuthor', 'Author');
					Expect(tmpFromAuthor.thisSide.Entity).to.equal('Author');
					Expect(tmpFromAuthor.otherSide.Entity).to.equal('Book');
					Expect(tmpFromAuthor.otherSide.IDField).to.equal('IDBook');
				});

				test('returns false for a recordset that is neither side', () =>
				{
					Expect(_Manager.resolveSides('BookAuthor', 'Banana')).to.equal(false);
					Expect(_Manager.resolveSides('NopeAssociation', 'Book')).to.equal(false);
				});
			});

		suite
		(
			'Picker config (cull)',
			() =>
			{
				test('the other-side picker culls the currently-associated ids', () =>
				{
					const tmpConfig = _Manager.buildOtherPickerConfig('BookAuthor', 'Book', () => [ 3, 4, 5 ], { Mode: 'multi' });
					Expect(tmpConfig.Entity).to.equal('Author');
					Expect(tmpConfig.ValueField).to.equal('IDAuthor');
					Expect(tmpConfig.TextField).to.equal('Name');
					Expect(tmpConfig.Mode).to.equal('multi', 'overrides are merged in.');
					Expect(tmpConfig.BaseFilter()).to.equal('FBL~IDAuthor~NIN~3,4,5', 'the cull is a NIN over the excluded ids.');
				});

				test('the cull filter is empty when nothing is associated', () =>
				{
					const tmpConfig = _Manager.buildOtherPickerConfig('BookAuthor', 'Book', () => []);
					Expect(tmpConfig.BaseFilter()).to.equal('', 'no excluded ids -> no filter (matches everything).');
				});

				test('the anchor picker has no cull', () =>
				{
					const tmpConfig = _Manager.buildAnchorPickerConfig('BookAuthor', 'Book');
					Expect(tmpConfig.Entity).to.equal('Book');
					Expect(tmpConfig.ValueField).to.equal('IDBook');
					Expect(tmpConfig.BaseFilter).to.equal(undefined, 'the anchor side is not culled.');
				});

				test('ChipFields ride through to the picker config as EntityTags (TagLast)', () =>
				{
					_Manager.addAssociation('Chips',
						{
							JoinEntity: 'BookAuthorJoin',
							SideA: { RecordSet: 'Book',   IDField: 'IDBook',   ChipFields: [ 'ISBN', { Field: 'PublicationYear', Label: 'Year' } ] },
							SideB: { RecordSet: 'Author', IDField: 'IDAuthor' },
						});
					// From the Author side, the OTHER side is Book — so its ChipFields drive the picker.
					const tmpConfig = _Manager.buildOtherPickerConfig('Chips', 'Author', () => []);
					Expect(tmpConfig.EntityTags).to.deep.equal([ 'ISBN', { Field: 'PublicationYear', Label: 'Year' } ]);
					Expect(tmpConfig.TagLast).to.equal(true, 'chips sit after the label.');
					// No ChipFields -> no EntityTags.
					Expect(_Manager.buildAnchorPickerConfig('Chips', 'Author').EntityTags).to.equal(undefined);
				});
			});

		suite
		(
			'Chip composition',
			() =>
			{
				test('composeChips renders string fields and labeled fields, dropping blanks', () =>
				{
					const tmpRecord = { ISBN: '1416524797', PublicationYear: 2000, Genre: '' };
					const tmpChips = _Manager.composeChips([ 'ISBN', { Field: 'PublicationYear', Label: 'Year' }, 'Genre' ], tmpRecord);
					Expect(tmpChips).to.deep.equal([ '1416524797', 'Year: 2000' ], 'a string spec is the raw value; an object spec is "Label: value"; the empty Genre is dropped.');
				});

				test('composeChips returns [] for no fields or no record', () =>
				{
					Expect(_Manager.composeChips([], { ISBN: 'x' })).to.deep.equal([]);
					Expect(_Manager.composeChips([ 'ISBN' ], null)).to.deep.equal([]);
				});
			});

		suite
		(
			'Join CRUD',
			() =>
			{
				test('createJoin posts the join with both ids and any default values', async () =>
				{
					_Manager.addAssociation('TenantBookAuthor',
						{
							JoinEntity: 'BookAuthorJoin',
							DefaultJoinValues: { IDCustomer: 5 },
							SideA: { RecordSet: 'Book',   IDField: 'IDBook' },
							SideB: { RecordSet: 'Author', IDField: 'IDAuthor' },
						});
					await _Manager.createJoin('TenantBookAuthor', 'Book', 1, 7);
					const tmpCall = _Stub.calls.find((pCall) => pCall[0] === 'createEntity');
					Expect(tmpCall[1]).to.equal('BookAuthorJoin');
					Expect(tmpCall[2]).to.deep.equal({ IDCustomer: 5, IDBook: 1, IDAuthor: 7 }, 'this id, other id, and the default tenant id are all stamped.');
				});

				test('removeJoin deletes by the join record id', async () =>
				{
					await _Manager.removeJoin('BookAuthor', { IDBookAuthorJoin: 42, IDBook: 1, IDAuthor: 7 });
					const tmpCall = _Stub.calls.find((pCall) => pCall[0] === 'deleteEntity');
					Expect(tmpCall[1]).to.equal('BookAuthorJoin');
					Expect(tmpCall[2]).to.equal(42, 'the ID<JoinEntity> drives the delete.');
				});

				test('listAssociatedRecords resolves and decorates each join row', async () =>
				{
					// From the Book side: join rows carry IDAuthor; the other-side fetch returns Author rows.
					_Stub.JoinRows = [ { IDBookAuthorJoin: 11, IDBook: 1, IDAuthor: 7 }, { IDBookAuthorJoin: 12, IDBook: 1, IDAuthor: 8 } ];
					_Stub.OtherRows = [ { IDAuthor: 7, Name: 'Ursula' }, { IDAuthor: 8, Name: 'Octavia' } ];

					const tmpItems = await _Manager.listAssociatedRecords('BookAuthor', 'Book', 1);
					Expect(tmpItems.length).to.equal(2);
					Expect(tmpItems[0]).to.include({ JoinID: 11, OtherID: 7, Display: 'Ursula' });
					Expect(tmpItems[1]).to.include({ JoinID: 12, OtherID: 8, Display: 'Octavia' });

					// The join list was filtered to this anchor; the other-side fetch was an INN over the ids.
					const tmpJoinFetch = _Stub.calls.find((pCall) => pCall[0] === 'getEntitySet' && pCall[1] === 'BookAuthorJoin');
					Expect(tmpJoinFetch[2]).to.equal('FBV~IDBook~EQ~1');
					const tmpOtherFetch = _Stub.calls.find((pCall) => pCall[0] === 'getEntitySet' && pCall[1] === 'Author');
					Expect(tmpOtherFetch[2]).to.equal('FBL~IDAuthor~INN~7,8');
				});

				test('listAssociatedRecords falls back to a #id display when the other record is missing', async () =>
				{
					_Stub.JoinRows = [ { IDBookAuthorJoin: 11, IDBook: 1, IDAuthor: 7 } ];
					_Stub.OtherRows = []; // the author row could not be resolved
					const tmpItems = await _Manager.listAssociatedRecords('BookAuthor', 'Book', 1);
					Expect(tmpItems[0].Display).to.equal('#7', 'a dangling reference still renders its id.');
				});

				test('listJoinRecordsForIDs filters the join entity by an IN over the this-side ids (matrix dedup)', async () =>
				{
					_Stub.JoinRows = [ { IDBookAuthorJoin: 11, IDBook: 1, IDAuthor: 7 }, { IDBookAuthorJoin: 12, IDBook: 2, IDAuthor: 8 } ];
					const tmpRows = await _Manager.listJoinRecordsForIDs('BookAuthor', 'Book', [ 1, 2, 3 ]);
					Expect(tmpRows.length).to.equal(2);
					const tmpCall = _Stub.calls.find((pCall) => pCall[0] === 'getEntitySet' && pCall[1] === 'BookAuthorJoin');
					Expect(tmpCall[2]).to.equal('FBL~IDBook~INN~1,2,3', 'the join entity is filtered by the this-side ids.');
					Expect(await _Manager.listJoinRecordsForIDs('BookAuthor', 'Book', [])).to.deep.equal([], 'empty id list short-circuits to [].');
				});
			});
	}
);
