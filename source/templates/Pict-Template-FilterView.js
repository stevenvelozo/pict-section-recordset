const libPictTemplate = require('pict-template');

/**
 * Specialized instruction for rendering the filter view and plumbing in required context.
 *
 * Based on the Pict base {~V:...~} template instruction.
 */
class PictTemplateFilterViewInstruction extends libPictTemplate
{
	/**
	 * @param {Object} pFable - The Fable Framework instance
	 * @param {Object} pOptions - The options for the service
	 * @param {String} pServiceHash - The hash of the service
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		/** @type {any} */
		this.log;

		this.addPattern('{~FV:', '~}');
		this.addPattern('{~FilterView:', '~}');


		if (!('__TemplateOutputCache' in this.pict))
		{
			this.pict.__TemplateOutputCache = {};
		}
	}

	/**
	 * Render a template expression, returning a string with the resulting content.
	 *
	 * @param {string} pTemplateHash - The hash contents of the template (what's between the template start and stop tags)
	 * @param {any} pRecord - The json object to be used as the Record for the template render
	 * @param {Array<any>} pContextArray - An array of context objects accessible from the template; safe to leave empty
	 * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
	 * @param {any} [pState] - A catchall state object for plumbing data through template processing.
	 *
	 * @return {string} The rendered template
	 */
	render(pTemplateHash, pRecord, pContextArray, pScope, pState)
	{
		let [ tmpViewHash, tmpViewContext ] = pTemplateHash.split(':');
		tmpViewHash = tmpViewHash.trim();
		const tmpRecordSet = pRecord.RecordSet || '';
		if (!tmpRecordSet)
		{
			this.pict.log.error(`Pict: Filter View Template Render: No record set specified in template hash [${pTemplateHash}] for view [${tmpViewHash}]`);
			return '';
		}
		const tmpRecordSetConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations?.[tmpRecordSet];
		if (!tmpRecordSetConfiguration)
		{
			this.pict.log.error(`Pict: Filter View Template Render: No record set configuration found for [${tmpRecordSet}] in template hash [${pTemplateHash}] for view [${tmpViewHash}]`);
			return '';
		}
		if (tmpViewContext)
		{
			tmpViewContext = tmpViewContext.trim();
		}
		else
		{
			tmpViewContext = 'Default';
		}
		if (!(tmpViewHash in this.pict.views))
		{
			this.log.warn(`Pict: Filter View Template Render: View not found for [${tmpViewHash}]`);
			return '';
		}

		pRecord = pRecord || {};
		if (!pRecord.RecordSet)
		{
			pRecord.RecordSet = tmpRecordSet;
		}
		if (!pRecord.RecordSetConfiguration)
		{
			pRecord.RecordSetConfiguration = tmpRecordSetConfiguration;
		}
		if (!pRecord.ViewContext)
		{
			pRecord.ViewContext = pRecord.DashboardHash ? `${tmpViewContext}-${pRecord.DashboardHash}` : tmpViewContext;
		}

		let tmpRenderGUID = this.pict.getUUID();

		/** @type {import('pict-view')} */
		const tmpView = this.pict.views[tmpViewHash];

		tmpView.render('__Virtual', `__TemplateOutputCache.${tmpRenderGUID}`, pRecord, pState && pState.RootRenderable);

		let tmpResult = this.pict.__TemplateOutputCache[tmpRenderGUID];
		// TODO: Uncomment this when we like how it's working
		//delete this.pict.__TemplateOutputCache[tmpRenderGUID];

		return tmpResult;
	}

	/**
	 * @param {string} pTemplateHash - The hash contents of the template (what's between the template start and stop tags)
	 * @param {any} pRecord - The json object to be used as the Record for the template
	 * @param {(pError?: Error, pResult?: string) => void} fCallback - The callback function to call with the result
	 * @param {Array<any>} pContextArray - An array of context objects accessible from the template; safe to leave empty
	 * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
	 * @param {any} [pState] - A catchall state object for plumbing data through template processing.
	 * @return {void}
	 */
	renderAsync(pTemplateHash, pRecord, fCallback, pContextArray, pScope, pState)
	{
		let [ tmpViewHash, tmpViewContext ] = pTemplateHash.split(':');
		tmpViewHash = tmpViewHash.trim();
		const tmpRecordSet = pRecord.RecordSet || '';
		if (!tmpRecordSet)
		{
			this.pict.log.error(`Pict: Filter View Template Render: No record set specified in template hash [${pTemplateHash}] for view [${tmpViewHash}]`);
			return fCallback(null, '');
		}
		const tmpRecordSetConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations?.[tmpRecordSet];
		if (!tmpRecordSetConfiguration)
		{
			this.pict.log.error(`Pict: Filter View Template Render: No record set configuration found for [${tmpRecordSet}] in template hash [${pTemplateHash}] for view [${tmpViewHash}]`);
			return fCallback(null, '');
		}
		if (tmpViewContext)
		{
			tmpViewContext = tmpViewContext.trim();
		}
		else
		{
			tmpViewContext = 'Default';
		}
		if (!(tmpViewHash in this.pict.views))
		{
			this.log.warn(`Pict: Filter View Template Render: View not found for [${tmpViewHash}]`);
			return fCallback(null, '');
		}

		pRecord = pRecord || {};
		if (!pRecord.RecordSet)
		{
			pRecord.RecordSet = tmpRecordSet;
		}
		if (!pRecord.RecordSetConfiguration)
		{
			pRecord.RecordSetConfiguration = tmpRecordSetConfiguration;
		}
		if (!pRecord.ViewContext)
		{
			pRecord.ViewContext = pRecord.DashboardHash ? `${tmpViewContext}-${pRecord.DashboardHash}` : tmpViewContext;
		}
		let tmpRenderGUID = this.pict.getUUID();

		/** @type {import('pict-view')} */
		const tmpView = this.pict.views[tmpViewHash];

		return tmpView.renderAsync('__Virtual', `__TemplateOutputCache.${tmpRenderGUID}`, pRecord, pState && pState.RootRenderable,
			(pError, pResult) =>
			{
				if (pError)
				{
					this.log.warn(`Pict: Filter View Template Render: Error rendering view [${tmpViewHash}]`, pError);
					return fCallback(pError, '');
				}

				let tmpResult = this.pict.__TemplateOutputCache[tmpRenderGUID];
				// TODO: Uncomment this when we like how it's working
				//delete this.pict.__TemplateOutputCache[tmpRenderGUID];

				return fCallback(null, tmpResult);
			});
	}
}

module.exports = PictTemplateFilterViewInstruction;
