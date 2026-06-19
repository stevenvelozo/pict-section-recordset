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
	}
);
