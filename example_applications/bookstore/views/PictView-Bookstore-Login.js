const libPictSectionLogin = require('pict-section-login');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookstore-Login",

	DefaultRenderable: "Login-Container",
	DefaultDestinationAddress: "#Bookstore-Login-Form-Container",
	TargetElementAddress: "#Bookstore-Login-Container",

	AutoRender: false,

	// The application controls when to check the session,
	// so we disable the auto-check built into the section.
	CheckSessionOnLoad: false,
	ShowOAuthProviders: false,

	// orator-authentication endpoints (defaults match retold-harness)
	LoginEndpoint: "/1.0/Authenticate",
	LoginMethod: "POST",
	LogoutEndpoint: "/1.0/Deauthenticate",
	CheckSessionEndpoint: "/1.0/CheckSession",

	SessionDataAddress: "AppData.Session"
};

class BookstoreLoginView extends libPictSectionLogin
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onLoginSuccess(pSessionData)
	{
		this.log.info('Login succeeded, switching to protected app.');
		if (this.pict.PictApplication && typeof (this.pict.PictApplication.showProtectedApp) === 'function')
		{
			this.pict.PictApplication.showProtectedApp();
		}
	}

	onSessionChecked(pSessionData)
	{
		if (pSessionData && pSessionData.LoggedIn)
		{
			this.log.info('Existing session found, switching to protected app.');
			if (this.pict.PictApplication && typeof (this.pict.PictApplication.showProtectedApp) === 'function')
			{
				this.pict.PictApplication.showProtectedApp();
			}
		}
	}
}

module.exports = BookstoreLoginView;

module.exports.default_configuration = _ViewConfiguration;
