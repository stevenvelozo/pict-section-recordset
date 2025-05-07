const libFableServiceProviderBase = require('fable-serviceproviderbase');

const viewRecordSetList = require('../views/list/RecordSet-List.js');
const viewRecordSetEdit = require('../views/edit/RecordSet-Edit.js');
const viewRecordSetRead = require('../views/read/RecordSet-Read.js');
const viewRecordSetDashboard = require('../views/dashboard/RecordSet-Dashboard.js');

class RecordSetMetacontroller extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		// Intersect default options, parent constructor, service information
		super(pFable, pOptions, pServiceHash);

		/** @type {import('pict') & { addView: (hash: string, options: any, prototype: any) => any }} */
		this.pict;
		/** @type {import('pict') & { addAndInstantiateSingletonService: (hash: string, options: any, prototype: any) => any }} */
		this.fable;
		/** @type {any} */
		this.log;
		/** @type {any} */
		this.options;
		/** @type {string} */
		this.UUID;

		this.childViews = {
			list: null,
			edit: null,
			read: null,
			dashboard: null
		};

		this.has_initialized = false;
	}

	initialize()
	{
		if (this.has_initialized)
		{
			this.fable.log.warn(`RecordSetMetacontroller: ${this.UUID} already initialized and initialized was called a second time.`);
			return this;
		}

		// Add the subviews internally and externally
		this.childViews.list = this.fable.addView('RSP-RecordSet-List', this.options, viewRecordSetList);
		this.childViews.edit = this.fable.addView('RSP-RecordSet-Edit', this.options, viewRecordSetEdit);
		this.childViews.read = this.fable.addView('RSP-RecordSet-Read', this.options, viewRecordSetRead);
		this.childViews.dashboard = this.fable.addView('RSP-RecordSet-Dashboard', this.options, viewRecordSetDashboard);

		// Initialize the subviews
		this.childViews.list.initialize();
		this.childViews.edit.initialize();
		this.childViews.read.initialize();
		this.childViews.dashboard.initialize();

		this.has_initialized = true;

		return this;
	}
}

module.exports = RecordSetMetacontroller;

RecordSetMetacontroller.default_configuration = { };
