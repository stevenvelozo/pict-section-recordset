const libPictTemplate = require('pict-template');

/**
 * Specialized instruction for rendering the filter view and plumbing in required context.
 *
 * Based on the Pict base {~V:...~} template instruction.
 */
class PictTemplateFilterInstanceViewInstruction extends libPictTemplate
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

		this.addPattern('{~FIV:', '~}');
		this.addPattern('{~FilterInstanceView:', '~}');


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
	 *
	 * @return {string} The rendered template
	 */
	render(pTemplateHash, pRecord, pContextArray)
	{
		let [ tmpViewHashAddress, tmpViewContext ] = pTemplateHash.split(':');
		tmpViewHashAddress = tmpViewHashAddress.trim();

		const tmpViewHash = this.pict.resolveStateFromAddress(tmpViewHashAddress, pRecord, pContextArray);
		if (!tmpViewHash || !(tmpViewHash in this.pict.views))
		{
			this.log.warn(`Pict: Filter Instance View Template Render: View not found for [${tmpViewHash}] resolved from [${tmpViewHashAddress}]`);
			return '';
		}

		const tmpRecordSet = pRecord.RecordSet || '';
		if (!tmpRecordSet)
		{
			this.pict.log.error(`Pict: Filter Instance View Template Render: No record set specified in template hash [${pTemplateHash}] for view [${tmpViewHash}]`);
			return '';
		}
		const tmpRecordSetConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations?.[tmpRecordSet];
		if (!tmpRecordSetConfiguration)
		{
			this.pict.log.error(`Pict: Filter Instance View Template Render: No record set configuration found for [${tmpRecordSet}] in template hash [${pTemplateHash}] for view [${tmpViewHash}]`);
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

		tmpView.render('__Virtual', `__TemplateOutputCache.${tmpRenderGUID}`, pRecord);

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
	 * @return {void}
	 */
	renderAsync(pTemplateHash, pRecord, fCallback, pContextArray)
	{
		let [ tmpViewHashAddress, tmpViewContext ] = pTemplateHash.split(':');
		tmpViewHashAddress = tmpViewHashAddress.trim();
		const tmpRecordSet = pRecord.RecordSet || '';
		const tmpViewHash = this.pict.resolveStateFromAddress(tmpViewHashAddress, pRecord, pContextArray);
		if (!tmpViewHash || !(tmpViewHash in this.pict.views))
		{
			this.log.warn(`Pict: Filter Instance View Template Render: View not found for [${tmpViewHash}] resolved from [${tmpViewHashAddress}]`);
			return fCallback(null, '');
		}
		if (!tmpRecordSet)
		{
			this.pict.log.error(`Pict: Filter Instance View Template Render: No record set specified in template hash [${pTemplateHash}] for view [${tmpViewHash}]`);
			return fCallback(null, '');
		}
		const tmpRecordSetConfiguration = this.pict.PictSectionRecordSet.recordSetProviderConfigurations?.[tmpRecordSet];
		if (!tmpRecordSetConfiguration)
		{
			this.pict.log.error(`Pict: Filter Instance View Template Render: No record set configuration found for [${tmpRecordSet}] in template hash [${pTemplateHash}] for view [${tmpViewHash}]`);
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

		return tmpView.renderAsync('__Virtual', `__TemplateOutputCache.${tmpRenderGUID}`, pRecord,
			(pError, pResult) =>
			{
				if (pError)
				{
					this.log.warn(`Pict: Filter Instance View Template Render: Error rendering view [${tmpViewHash}]`, pError);
					return fCallback(pError, '');
				}

				let tmpResult = this.pict.__TemplateOutputCache[tmpRenderGUID];
				// TODO: Uncomment this when we like how it's working
				//delete this.pict.__TemplateOutputCache[tmpRenderGUID];

				return fCallback(null, tmpResult);
			});
	}
}

module.exports = PictTemplateFilterInstanceViewInstruction;
