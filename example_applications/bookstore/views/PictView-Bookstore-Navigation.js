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

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}
}

module.exports = BookstoreNavigationView;

module.exports.default_configuration = _ViewConfiguration;
