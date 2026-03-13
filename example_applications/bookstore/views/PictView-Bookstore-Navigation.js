const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookstore-Navigation",

	DefaultRenderable: "Bookstore-Navigation-Content",
	DefaultDestinationAddress: "#Bookstore-Navigation-Container",

	AutoRender: false,

	CSS: /*css*/`
		#Bookstore-Navigation-Container .pure-menu-heading
		{
			font-size: 110%;
			color: #fff;
			margin: 0;
			background: #E76F51;
			padding: 0.75em 0.6em;
		}
		.bookstore-nav-session
		{
			padding: 0.6em;
			border-top: 1px solid #333;
			font-size: 0.8rem;
			color: #999;
		}
		.bookstore-nav-session .dot
		{
			display: inline-block;
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: #2A9D8F;
			box-shadow: 0 0 4px rgba(42,157,143,0.5);
			margin-right: 0.35em;
		}
		.bookstore-nav-session-name
		{
			display: block;
			color: #D4A373;
			font-weight: 600;
			margin-top: 0.25em;
		}
		.bookstore-nav-logout
		{
			display: block;
			margin-top: 0.5em;
			background: #E76F51;
			color: #fff;
			border: none;
			padding: 0.35em 0.75em;
			border-radius: 4px;
			font-size: 0.75rem;
			font-weight: 600;
			cursor: pointer;
			width: 100%;
			text-align: center;
		}
		.bookstore-nav-logout:hover
		{
			background: #C45A3E;
		}
		/* Preprocessor toggle section */
		.bookstore-nav-preprocessor
		{
			padding: 0.6em;
			border-top: 1px solid #333;
			font-size: 0.75rem;
			color: #999;
		}
		.bookstore-nav-preprocessor-label
		{
			display: block;
			margin-bottom: 0.35em;
			font-weight: 600;
			color: #D4A373;
			font-size: 0.7rem;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}
		.bookstore-preprocessor-toggle
		{
			position: relative;
			display: inline-block;
			width: 36px;
			height: 20px;
			vertical-align: middle;
		}
		.bookstore-preprocessor-toggle input
		{
			opacity: 0;
			width: 0;
			height: 0;
		}
		.bookstore-preprocessor-slider
		{
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #555;
			transition: background-color 0.2s;
			border-radius: 20px;
		}
		.bookstore-preprocessor-slider:before
		{
			position: absolute;
			content: "";
			height: 14px;
			width: 14px;
			left: 3px;
			bottom: 3px;
			background-color: #fff;
			transition: transform 0.2s;
			border-radius: 50%;
		}
		.bookstore-preprocessor-toggle input:checked + .bookstore-preprocessor-slider
		{
			background-color: #2A9D8F;
		}
		.bookstore-preprocessor-toggle input:checked + .bookstore-preprocessor-slider:before
		{
			transform: translateX(16px);
		}
		.bookstore-preprocessor-status
		{
			display: inline-block;
			margin-left: 0.35em;
			vertical-align: middle;
			font-size: 0.7rem;
			color: #999;
		}
	`,

	Templates:
	[
		{
			Hash: "Bookstore-Navigation-Template",
			Template: /*html*/`
<span class="pure-menu-heading">Bookstore</span>
<ul class="pure-menu-list">
	<li class="pure-menu-item"><a href="#" onclick="{~P~}.PictApplication.navigateTo('/Dashboard')" class="pure-menu-link">Dashboard</a></li>
	<li class="pure-menu-item menu-item-divided"><a href="#" onclick="{~P~}.PictApplication.navigateTo('/Books')" class="pure-menu-link">Books</a></li>
	<li class="pure-menu-item"><a href="#" onclick="{~P~}.PictApplication.navigateTo('/Authors')" class="pure-menu-link">Authors</a></li>
	<li class="pure-menu-item"><a href="#" onclick="{~P~}.PictApplication.navigateTo('/BookStores')" class="pure-menu-link">Stores</a></li>
	<li class="pure-menu-item menu-item-divided"><a href="#" onclick="{~P~}.PictApplication.navigateTo('/About')" class="pure-menu-link">About</a></li>
	<li class="pure-menu-item"><a href="#" onclick="{~P~}.PictApplication.navigateTo('/Legal')" class="pure-menu-link">Legal</a></li>
</ul>
<div class="bookstore-nav-preprocessor">
	<span class="bookstore-nav-preprocessor-label">Template Preprocessor</span>
	<label class="bookstore-preprocessor-toggle">
		<input type="checkbox" id="Bookstore-Preprocessor-Toggle" onclick="{~P~}.PictApplication.togglePreprocessor()">
		<span class="bookstore-preprocessor-slider"></span>
	</label>
	<span class="bookstore-preprocessor-status" id="Bookstore-Preprocessor-Status">Off</span>
</div>
<div class="bookstore-nav-session">
	<span class="dot"></span> Signed in
	<span class="bookstore-nav-session-name" id="Bookstore-Nav-UserName"></span>
	<button class="bookstore-nav-logout" type="button" onclick="{~P~}.PictApplication.doLogout()">Log out</button>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookstore-Navigation-Content",
			TemplateHash: "Bookstore-Navigation-Template",
			DestinationAddress: "#Bookstore-Navigation-Container"
		}
	]
};

class BookstoreNavigationView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		// Populate the user name from session data
		let tmpSession = this.pict.AppData.Session;
		let tmpDisplayName = '';

		if (tmpSession && tmpSession.UserRecord)
		{
			tmpDisplayName = tmpSession.UserRecord.FullName
				|| tmpSession.UserRecord.LoginID
				|| '';
		}

		let tmpUserNameElements = this.services.ContentAssignment.getElement('#Bookstore-Nav-UserName');
		if (tmpUserNameElements && tmpUserNameElements.length > 0)
		{
			tmpUserNameElements[0].textContent = tmpDisplayName;
		}

		// Sync the preprocessor toggle state with the application's current state
		let tmpApp = this.pict.PictApplication;
		let tmpEnabled = tmpApp && tmpApp.isPreprocessorEnabled && tmpApp.isPreprocessorEnabled();

		let tmpToggleElements = this.services.ContentAssignment.getElement('#Bookstore-Preprocessor-Toggle');
		if (tmpToggleElements && tmpToggleElements.length > 0)
		{
			tmpToggleElements[0].checked = !!tmpEnabled;
		}

		let tmpStatusElements = this.services.ContentAssignment.getElement('#Bookstore-Preprocessor-Status');
		if (tmpStatusElements && tmpStatusElements.length > 0)
		{
			tmpStatusElements[0].textContent = tmpEnabled ? 'On' : 'Off';
			tmpStatusElements[0].style.color = tmpEnabled ? '#2A9D8F' : '#999';
		}

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}
}

module.exports = BookstoreNavigationView;

module.exports.default_configuration = _ViewConfiguration;
