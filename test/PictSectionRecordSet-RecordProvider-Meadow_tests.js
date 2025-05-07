/*
	Unit tests for PictSectionRecordSet Basic
	
*/

// This is temporary, but enables unit tests
const libBrowserEnv = require('browser-env');
libBrowserEnv();

const libPictApplication = require('pict-application');
const libPictView = require('pict-view');

const Chai = require('chai');
const Expect = Chai.expect;

const libPict = require('pict');

const libPictSectionRecordSet = require('../source/Pict-Section-RecordSet.js');

class DoNothingApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		pOptions.AutoRenderMainViewportViewAfterInitialize = false;
		pOptions.AutoRenderViewsAfterInitialize = false;
		super(pFable, pOptions, pServiceHash);

		let resolveFunc;
		/** @type {Promise & { resolve?: () => void }} */
		this._initialized = new Promise(function (resolve)
		{
			resolveFunc = resolve;
		});
		this._initialized.resolve = resolveFunc;
	}

	get iniitalized()
	{
		return this._initialized;
	}

	onAfterInitialize()
	{
		this._initialized.resolve();
		return super.onAfterInitialize();
	}
}

class DoNothingView extends libPictView
{
	constructor(pPict, pOptions)
	{
		super(pPict, pOptions);
	}
}

suite
(
	'PictSectionRecordSet RecordProvider MeadowEndpoints Tests',
	() =>
	{
		setup(() => { });

		suite
			(
				'Basic Basic Tests',
				() =>
				{
					let _Pict;
					setup(async () =>
					{
						_Pict = new libPict();
						_Pict.LogNoisiness = 2;
						let _PictEnvironment = new libPict.EnvironmentObject(_Pict);

						let _Application = new DoNothingApplication(_Pict, {});
						_Pict.addProvider('BooksProvider', { Entity: 'Book', URLPrefix: 'http://www.datadebase.com:8086/1.0/' }, require('../source/providers/RecordSet-RecordProvider-MeadowEndpoints.js'));
						await new Promise((resolve, reject) => _Application.initializeAsync((error) =>
						{
							if (error)
							{
								return reject(error);
							}
							resolve();
						}));
					});

					test('getRecord by ID', async () =>
					{
						const book = await _Pict.providers.BooksProvider.getRecord(1);
						Expect(book).to.be.an('object', 'Book should be an object.');
						Expect(book).to.have.property('IDBook', 1, 'Book should have an id of 1.');
						Expect(book).to.have.property('GUIDBook', 'ca811611-59c9-4b4a-9864-df5145f7785d', 'Book should have a guid of "ca811611-59c9-4b4a-9864-df5145f7785d".');
						Expect(book.Title).to.equal('Angels & Demons', 'Book should have a title of "Angels & Demons".');
					}); // ca811611-59c9-4b4a-9864-df5145f7785d

					test('getRecord by GUID', async () =>
					{
						const book = await _Pict.providers.BooksProvider.getRecord('ca811611-59c9-4b4a-9864-df5145f7785d');
						Expect(book).to.be.an('object', 'Book should be an object.');
						Expect(book).to.have.property('IDBook', 1, 'Book should have an id of 1.');
						Expect(book).to.have.property('GUIDBook', 'ca811611-59c9-4b4a-9864-df5145f7785d', 'Book should have a guid of "ca811611-59c9-4b4a-9864-df5145f7785d".');
						Expect(book.Title).to.equal('Angels & Demons', 'Book should have a title of "Angels & Demons".');
					});

					test('getRecords with no options', async () =>
					{
						const { Records: books } = await _Pict.providers.BooksProvider.getRecords({ });
						Expect(books).to.be.an('array', 'Books should be an array.');
						Expect(books.length).to.equal(250, 'Books should have one record.');
					});

					test('getRecords with pagination', async () =>
					{
						const { Records: books } = await _Pict.providers.BooksProvider.getRecords({ Offset: 1, PageSize: 1 });
						Expect(books).to.be.an('array', 'Books should be an array.');
						Expect(books.length).to.equal(1, 'Books should have one record.');
						const book = books[0];
						Expect(book).to.be.an('object', 'Book should be an object.');
						Expect(book).to.have.property('IDBook', 2, 'Book should have an id of 2.');
						Expect(book).to.have.property('GUIDBook', 'c854b3f1-539a-47fa-acca-c1b90629c220', 'Book should have a guid of "c854b3f1-539a-47fa-acca-c1b90629c220".');
						Expect(book.Title).to.equal(`Harry Potter and the Philosopher's Stone`, `Book should have a title of "Harry Potter and the Philosopher's Stone".`);
					});

					test('getRecords with filter', async () =>
					{
						const { Records: books } = await _Pict.providers.BooksProvider.getRecords({ FilterString: 'FBV~ISBN~GE~804139024~FSF~ISBN~ASC~0' });
						Expect(books).to.be.an('array', 'Books should be an array.');
						const book = books[0];
						Expect(book).to.be.an('object', 'Book should be an object.');
						Expect(book.ISBN).to.equal('804139024', 'Book should have an ISBN of "804139024".');
					});

					test('getRecordsInline with no options', async () =>
					{
						const { Records: books } = await _Pict.providers.BooksProvider.getRecordsInline();
						Expect(books).to.be.an('array', 'Books should be an array.');
						Expect(books.length).to.equal(250, 'Books should have one record.');
					});

					test('getRecordsInline with pagination', async () =>
					{
						const { Records: books } = await _Pict.providers.BooksProvider.getRecordsInline('', 1, 1);
						Expect(books).to.be.an('array', 'Books should be an array.');
						Expect(books.length).to.equal(1, 'Books should have one record.');
						const book = books[0];
						Expect(book).to.be.an('object', 'Book should be an object.');
						Expect(book).to.have.property('IDBook', 2, 'Book should have an id of 2.');
						Expect(book).to.have.property('GUIDBook', 'c854b3f1-539a-47fa-acca-c1b90629c220', 'Book should have a guid of "c854b3f1-539a-47fa-acca-c1b90629c220".');
						Expect(book.Title).to.equal(`Harry Potter and the Philosopher's Stone`, `Book should have a title of "Harry Potter and the Philosopher's Stone".`);
					});

					test('getRecordsInline with filter', async () =>
					{
						const { Records: books } = await _Pict.providers.BooksProvider.getRecordsInline('FBV~ISBN~GE~804139024~FSF~ISBN~ASC~0');
						Expect(books).to.be.an('array', 'Books should be an array.');
						const book = books[0];
						Expect(book).to.be.an('object', 'Book should be an object.');
						Expect(book.ISBN).to.equal('804139024', 'Book should have an ISBN of "804139024".');
					});

					test('createRecord and deleteRecord', async () =>
					{
						const book = await _Pict.providers.BooksProvider.createRecord({ Title: 'Test Book', ISBN: '1234567890' });
						Expect(book).to.be.an('object', 'Book should be an object.');
						Expect(book.IDBook).to.be.greaterThan(0, 'Book should have an id greater than 0.');
						book.Title = 'Test Book 2';
						const updartedBook = await _Pict.providers.BooksProvider.updateRecord(book);
						Expect(updartedBook).to.be.an('object', 'Book should be an object.');
						Expect(updartedBook.IDBook).to.equal(book.IDBook, 'Book should have the same id.');
						Expect(updartedBook.Title).to.equal('Test Book 2', 'Book should have a title of "Test Book 2".');
						await _Pict.providers.BooksProvider.deleteRecord(book);
						const existenceCheck = await _Pict.providers.BooksProvider.getRecord(book.IDBook);
						Expect(existenceCheck.Error).to.equal('Record not Found');
					});

					test('recordSchema', async () =>
					{
						const schema = await _Pict.providers.BooksProvider.recordSchema;
						Expect(schema).to.be.an('object', 'Schema should be an object.');
						Expect(Object.keys(schema).length).to.be.greaterThan(0, 'Schema should have properties.');
					});
				});
	}
);
