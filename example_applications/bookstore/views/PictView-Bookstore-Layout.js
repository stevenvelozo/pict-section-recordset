const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookstore-Layout",

	DefaultRenderable: "Bookstore-Layout-Shell",
	DefaultDestinationAddress: "#Bookstore-App-Container",

	AutoRender: false,

	Templates:
	[
		{
			Hash: "Bookstore-Layout-Shell-Template",
			Template: /*html*/`
<div id="layout">
	<a href="#menu" id="menuLink" class="menu-link"><span></span></a>
	<div id="menu">
		<div id="Bookstore-Navigation-Container" class="pure-menu"></div>
	</div>
	<div id="Bookstore-Content-Container"></div>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookstore-Layout-Shell",
			TemplateHash: "Bookstore-Layout-Shell-Template",
			DestinationAddress: "#Bookstore-App-Container",
			RenderMethod: "replace"
		}
	]
};

class BookstoreLayoutView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		// Render the navigation sidebar
		this.pict.views['Bookstore-Navigation'].render();

		// Inject all CSS
		this.pict.CSSMap.injectCSS();

		// Wire up the hamburger menu toggle for responsive
		this._initMenuToggle();

		// Try to navigate to current URL hash route, or fall back to dashboard
		if (this.pict.providers.PictRouter && !this.pict.providers.PictRouter.navigateCurrent())
		{
			this.pict.PictApplication.showView('Bookstore-Dashboard');
			this.pict.providers.PictRouter.resolve();
		}

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}

	_initMenuToggle()
	{
		let tmpMenuLink = document.getElementById('menuLink');
		let tmpLayout = document.getElementById('layout');

		if (tmpMenuLink && tmpLayout)
		{
			tmpMenuLink.onclick = function (pEvent)
			{
				pEvent.preventDefault();
				tmpLayout.classList.toggle('active');
			};
		}
	}
}

module.exports = BookstoreLayoutView;

module.exports.default_configuration = _ViewConfiguration;
