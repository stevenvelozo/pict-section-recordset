/*
	Unit tests for PictSectionRecordSet Basic
	
*/

// This is temporary, but enables unit tests
const libBrowserEnv = require('browser-env')
libBrowserEnv();

const libPictView = require('pict-view');

const Chai = require('chai');
const Expect = Chai.expect;

const libPict = require('pict');

const libPictSectionRecordSet = require('../source/Pict-Section-RecordSet.js');

class DoNothingApplication extends libPictSectionRecordSet.PictRecordSetApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('DoNothingView', {}, DoNothingView);
	}

	/**
	 * @param {function} fDone - Callback that finishes the test
	 */
	set testDone(fDone)
	{
		this._testDone = fDone;
	}

	onAfterInitialize()
	{
		this.solve();
		this._testDone();
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
	'PictSectionRecordSet Basic',
	() =>
	{
		setup(() => { });

		suite
			(
				'Basic Basic Tests',
				() =>
				{
					test(
							'Basic Initialization',
							(fDone) =>
							{
								let _Pict = new libPict();
								_Pict.LogNoisiness = 1;
								let _PictEnvironment = new libPict.EnvironmentObject(_Pict);

								let _Application = new DoNothingApplication(_Pict, {});

								Expect(_Application).to.be.an('object', 'Application should be an object.');
								Expect(_Application).to.be.an.instanceof(libPictSectionRecordSet.PictRecordSetApplication, 'Application should be an instance of PictRecordSetApplication.');


								// let _PictSectionRecordSet = _Pict.addView(tmpViewHash, tmpViewConfiguration, libPictSectionRecordSet);

								// Expect(_PictSectionRecordSet).to.be.an('object');

								// // Test package anthropology
								// Expect(_PictSectionRecordSet._PackageFableServiceProvider).to.be.an('object', 'Fable should have a _PackageFableServiceProvider object.');
								// Expect(_PictSectionRecordSet._PackageFableServiceProvider.name).equal('fable-serviceproviderbase', 'Fable _PackageFableServiceProvider.package.name should be set.');
								// Expect(_PictSectionRecordSet._PackagePictView).to.be.an('object', 'Should have a _PackagePictView object.');
								// Expect(_PictSectionRecordSet._PackagePictView.name).to.equal('pict-view', '_PackagePictView.package.name should be set.');
								// Expect(_PictSectionRecordSet._Package).to.be.an('object', 'Should have a _Package object.');
								// Expect(_PictSectionRecordSet._Package.name).to.equal('pict-section-recordset', '_Package.package.name should be set.');

								return fDone();
							}
						);
					});
	}
);
