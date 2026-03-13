const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookstore-Dashboard",

	DefaultRenderable: "Bookstore-Dashboard-Content",
	DefaultDestinationAddress: "#Bookstore-Content-Container",

	AutoRender: false,

	CSS: /*css*/`
		.bookstore-dashboard-session-info
		{
			background: #264653;
			color: #FAEDCD;
			border-radius: 6px;
			padding: 0.8rem 1rem;
			font-size: 0.85rem;
			margin-bottom: 1.5rem;
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
		.bookstore-dashboard-session-info .badge
		{
			background: #E76F51;
			color: #fff;
			font-size: 0.7rem;
			font-weight: 700;
			padding: 0.15rem 0.5rem;
			border-radius: 9999px;
		}
		.bookstore-dashboard-cards
		{
			display: flex;
			gap: 1.25rem;
			flex-wrap: wrap;
		}
		.bookstore-dashboard-card
		{
			flex: 1;
			min-width: 200px;
			background: #fff;
			border: 1px solid #D4A373;
			border-top: 4px solid #E76F51;
			border-radius: 6px;
			padding: 1.25rem;
			cursor: pointer;
			transition: box-shadow 0.15s, transform 0.15s;
			box-shadow: 0 2px 8px rgba(38,70,83,0.08);
		}
		.bookstore-dashboard-card:hover
		{
			box-shadow: 0 4px 16px rgba(38,70,83,0.15);
			transform: translateY(-2px);
		}
		.bookstore-dashboard-card h3
		{
			margin: 0 0 0.5rem;
			color: #E76F51;
			font-size: 1.05rem;
		}
		.bookstore-dashboard-card p
		{
			margin: 0;
			font-size: 0.9rem;
			color: #666;
		}
	`,

	Templates:
	[
		{
			Hash: "Bookstore-Dashboard-Template",
			Template: /*html*/`
<div class="header">
	<h1>Bookstore Dashboard</h1>
	<h2>Manage your books, authors, and store inventory.</h2>
</div>
<div class="content">
	<div class="bookstore-dashboard-session-info" id="Bookstore-Dashboard-SessionInfo"></div>
	<h2 class="content-subhead">Quick Navigation</h2>
	<div class="bookstore-dashboard-cards">
		<div class="bookstore-dashboard-card" onclick="{~P~}.PictApplication.navigateTo('/Books')">
			<h3>Books</h3>
			<p>Browse, filter, and manage the full book catalog.</p>
		</div>
		<div class="bookstore-dashboard-card" onclick="{~P~}.PictApplication.navigateTo('/Authors')">
			<h3>Authors</h3>
			<p>View and manage author records.</p>
		</div>
		<div class="bookstore-dashboard-card" onclick="{~P~}.PictApplication.navigateTo('/BookStores')">
			<h3>Stores</h3>
			<p>Manage bookstore locations and inventory.</p>
		</div>
	</div>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookstore-Dashboard-Content",
			TemplateHash: "Bookstore-Dashboard-Template",
			DestinationAddress: "#Bookstore-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class BookstoreDashboardView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		// Populate session info banner
		let tmpSession = this.pict.AppData.Session;
		let tmpInfoElements = this.services.ContentAssignment.getElement('#Bookstore-Dashboard-SessionInfo');
		if (tmpInfoElements && tmpInfoElements.length > 0 && tmpSession && tmpSession.UserRecord)
		{
			let tmpUser = tmpSession.UserRecord;
			let tmpHTML = 'Logged in as <strong>' + (tmpUser.FullName || tmpUser.LoginID || '') + '</strong>';
			if (tmpUser.IDUser)
			{
				tmpHTML += ' <span class="badge">ID ' + tmpUser.IDUser + '</span>';
			}
			if (tmpUser.Email)
			{
				tmpHTML += '&nbsp;&nbsp;' + tmpUser.Email;
			}
			tmpInfoElements[0].innerHTML = tmpHTML;
		}

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}
}

module.exports = BookstoreDashboardView;

module.exports.default_configuration = _ViewConfiguration;
