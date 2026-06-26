/*
	Unit tests for the RecordSetCardManager — the config-driven record-preview-card registry + the
	{~RecordCard:~} trigger tag. No network: these exercise the config -> compiled-template -> rendered
	card path, the trigger HTML, and the tag's id/label resolution.
*/

const libBrowserEnv = require('browser-env');

const Chai = require('chai');
const Expect = Chai.expect;

const libPict = require('pict');

const libCardManager = require('../source/providers/RecordSet-CardManager.js');
const libCardTemplate = require('../source/templates/Pict-Template-RecordCard.js');

const _AuthorCard =
{
	Title: 'Name',
	Subtitle: '{~D:Record.Nationality~}',
	Fields: [ { Label: 'Author ID', Value: 'IDAuthor' }, { Label: 'Books', Value: '{~D:Record.BookCount~}' } ],
	Actions: [ { Label: 'View author', Icon: 'User', Route: '#/PSRS/Author/View/{~D:Record.GUIDAuthor~}' } ],
};

const _AuthorRecord = { IDAuthor: 7, GUIDAuthor: 'GUID-7', Name: 'Ursula K. Le Guin', Nationality: 'American', BookCount: 23 };

suite
(
	'PictSectionRecordSet CardManager',
	() =>
	{
		let _Pict;
		let _Manager;

		setup(() =>
		{
			libBrowserEnv({ url: 'http://localhost/' });
			_Pict = new libPict();
			_Pict.LogNoisiness = 0;
			_Pict.addTemplate(libCardTemplate);
			_Manager = _Pict.addProvider('RecordSetCardManager', {}, libCardManager);
		});

		const fRenderTemplate = (pHash, pRecord) => _Pict.parseTemplateByHash(pHash, pRecord);

		test('registerCard makes the recordset card available', () =>
		{
			Expect(_Manager.hasCard('Author')).to.equal(false);
			_Manager.registerCard('Author', _AuthorCard);
			Expect(_Manager.hasCard('Author')).to.equal(true);
		});

		test('the compiled card template renders a record into title, fields, and resolved actions', () =>
		{
			_Manager.registerCard('Author', _AuthorCard);
			const tmpHTML = fRenderTemplate('PSRS-RecordCard-Author', _AuthorRecord);
			Expect(tmpHTML).to.contain('psrs-card-title');
			Expect(tmpHTML).to.contain('Ursula K. Le Guin', 'the Title field resolves');
			Expect(tmpHTML).to.contain('American', 'the Subtitle template resolves');
			Expect(tmpHTML).to.contain('Author ID', 'a field label renders');
			Expect(tmpHTML).to.contain('23', 'a {~...~} field value resolves');
			Expect(tmpHTML).to.contain('#/PSRS/Author/View/GUID-7', 'the action Route template resolves against the record');
		});

		test('a Template-mode card uses the custom markup instead of Fields', () =>
		{
			_Manager.registerCard('Author', { Title: 'Name', Template: '<p class="bio">by {~D:Record.Name~} ({~D:Record.BookCount~} books)</p>' });
			const tmpHTML = fRenderTemplate('PSRS-RecordCard-Author', _AuthorRecord);
			Expect(tmpHTML).to.contain('class="bio"');
			Expect(tmpHTML).to.contain('by Ursula K. Le Guin (23 books)');
			Expect(tmpHTML).to.not.contain('psrs-card-fields');
		});

		test('triggerHTML emits a clickable, openCard-wired trigger when a card exists', () =>
		{
			_Manager.registerCard('Author', _AuthorCard);
			const tmpTrigger = _Manager.triggerHTML('Author', 7, 'Ursula K. Le Guin');
			Expect(tmpTrigger).to.contain('psrs-card-trigger');
			Expect(tmpTrigger).to.contain('Ursula K. Le Guin');
			Expect(tmpTrigger).to.contain("openCard('Author','7'", 'the trigger calls openCard with the recordset + id');
		});

		test('triggerHTML degrades to a plain label when no card is registered', () =>
		{
			Expect(_Manager.triggerHTML('Nope', 7, 'Plain Label')).to.equal('Plain Label');
		});

		test('the {~RecordCard:~} tag resolves the id + label from the record and emits a trigger', () =>
		{
			_Manager.registerCard('Author', _AuthorCard);
			_Pict.TemplateProvider.addTemplate('Test-RecordCard-Trigger', '{~RecordCard:Author^Record.IDAuthor^Record.Name~}');
			const tmpHTML = _Pict.parseTemplateByHash('Test-RecordCard-Trigger', _AuthorRecord);
			Expect(tmpHTML).to.contain('psrs-card-trigger');
			Expect(tmpHTML).to.contain('Ursula K. Le Guin');
			Expect(tmpHTML).to.contain("openCard('Author','7'");
		});

		test('the tag resolves the recordset from an address too (the association auto-trigger), degrading to the plain label when empty', () =>
		{
			_Manager.registerCard('Author', _AuthorCard);
			_Pict.TemplateProvider.addTemplate('Test-RecordCard-Addressed', '{~RecordCard:Record.CardRecordSet^Record.IDAuthor^Record.Name~}');

			// A row that carries the other-side recordset → a real trigger.
			const tmpWithCard = _Pict.parseTemplateByHash('Test-RecordCard-Addressed', Object.assign({ CardRecordSet: 'Author' }, _AuthorRecord));
			Expect(tmpWithCard).to.contain('psrs-card-trigger');
			Expect(tmpWithCard).to.contain("openCard('Author','7'");

			// A row with no card (empty recordset) → just the name, no trigger.
			const tmpNoCard = _Pict.parseTemplateByHash('Test-RecordCard-Addressed', Object.assign({ CardRecordSet: '' }, _AuthorRecord));
			Expect(tmpNoCard).to.not.contain('psrs-card-trigger');
			Expect(tmpNoCard).to.contain('Ursula K. Le Guin');
		});

		test('a default card (entity with none registered) renders a rich body of all real columns', () =>
		{
			const tmpCard = _Manager._defaultCard('Widget', { EntityConfig: { Entity: 'Widget', IDField: 'IDWidget', Display: { Title: 'Name' } } });
			const tmpRecord = { IDWidget: 5, GUIDWidget: 'g5', Name: 'Sprocket', MaterialCode: 'MC-9', Quantity: 12 };
			const tmpHTML = _Manager._buildRichCardHTML(tmpCard, tmpRecord, { Rich: true });
			Expect(tmpHTML).to.contain('Sprocket', 'derived/title field');
			Expect(tmpHTML).to.contain('Material Code', 'MaterialCode humanized');
			Expect(tmpHTML).to.contain('MC-9');
			Expect(tmpHTML).to.contain('Quantity');
			Expect(tmpHTML).to.not.contain('GUIDWidget', 'the GUID is a copy button, not a field row');
		});

		test('_humanizeLabel + _fmtDate format for the rich body / audit stripe', () =>
		{
			Expect(_Manager._humanizeLabel('MaterialCode')).to.equal('Material Code');
			Expect(_Manager._humanizeLabel('mix_id')).to.equal('mix id');
			Expect(_Manager._fmtDate('2026-06-26T21:30:45.000Z')).to.equal('Jun 26, 2026 21:30');
			Expect(_Manager._fmtDate('2026-06-26')).to.equal('Jun 26, 2026');
		});

		test('_richFields hides null-only values + humanizes ISO timestamps', () =>
		{
			const tmpRecord = { IDX: 1, GUIDX: 'g', Name: 'X', Address: 'null null', SyncDate: '2026-06-21T05:47:01.000Z', City: 'Baton Rouge' };
			const tmpByLabel = {};
			_Manager._richFields(tmpRecord, 'Name').forEach((pField) => { tmpByLabel[pField.Label] = pField.Value; });
			Expect(Object.keys(tmpByLabel)).to.not.include('Address', 'a "null null" value is dropped');
			Expect(tmpByLabel['Sync Date']).to.equal('Jun 21, 2026 05:47', 'the ISO timestamp is humanized');
			Expect(tmpByLabel['City']).to.equal('Baton Rouge');
		});

		test('the audit toggle persists + the stripe renders Created/Updated + ID/GUID copy buttons', () =>
		{
			_Manager.setAuditEnabled(false);
			Expect(_Manager.getAuditEnabled()).to.equal(false);
			_Manager.setAuditEnabled(true);
			Expect(_Manager.getAuditEnabled()).to.equal(true);
			const tmpCard = _Manager._defaultCard('Widget', { EntityConfig: { Entity: 'Widget', IDField: 'IDWidget' } });
			const tmpRecord = { IDWidget: 5, GUIDWidget: 'g5', Name: 'Sprocket', CreateDate: '2026-01-02T03:04:00Z', UpdateDate: '2026-06-26T21:30:00Z', CreatingUserName: 'Ada L.' };
			const tmpHTML = _Manager._buildRichCardHTML(tmpCard, tmpRecord, { Rich: true });
			Expect(tmpHTML).to.contain('psrs-card-audit');
			Expect(tmpHTML).to.contain('Created');
			Expect(tmpHTML).to.contain('Ada L.', 'the resolved creating-user name');
			Expect(tmpHTML).to.contain('data-copy="g5"', 'a GUID copy button');
			Expect(tmpHTML).to.contain('data-copy="5"', 'an ID copy button');
			_Manager.setAuditEnabled(false);   // leave the toggle clean for other tests
		});

		test('schema booleans render as a checkbox glyph (filled when on, empty when off), not raw 0/1', () =>
		{
			_Manager.setAuditEnabled(false);
			_Manager._schemaBooleans = { Org: { Approved: true, Active: true } };   // simulate the cached schema
			const tmpCard = _Manager._defaultCard('Org', { EntityConfig: { Entity: 'Org', IDField: 'IDOrg' } });
			const tmpRecord = { IDOrg: 1, GUIDOrg: 'g', Name: 'Acme', Approved: 1, Active: 0, Quantity: 7 };
			const tmpHTML = _Manager._buildRichCardHTML(tmpCard, tmpRecord, { Rich: true });
			Expect(tmpHTML).to.contain('psrs-card-bool-on', 'Approved=1 → filled checkbox');
			Expect(tmpHTML).to.contain('class="psrs-card-bool"', 'Active=0 → empty checkbox');
			Expect(tmpHTML).to.contain('Quantity', 'a non-boolean numeric still renders normally');
			Expect(tmpHTML).to.contain('>7<', 'the numeric value shows verbatim');
		});

		test('a registered card rendered rich keeps its Title + View action and adds the extra columns', () =>
		{
			_Manager.registerCard('Author', _AuthorCard);
			_Manager.setAuditEnabled(false);
			const tmpHTML = _Manager._buildRichCardHTML(_Manager._cards.Author, _AuthorRecord, { Rich: true });
			Expect(tmpHTML).to.contain('Ursula K. Le Guin', 'the registered Title still resolves');
			Expect(tmpHTML).to.contain('#/PSRS/Author/View/GUID-7', 'the registered View action still resolves');
			Expect(tmpHTML).to.contain('Nationality', 'the rich body adds the record\'s other columns');
		});
	}
);
