/** Clase en la que emmagaztegarem les dades del LastFm */
class Dades {
	/**
	 * Creem les dades.
	 * @param {string} myAPI_key - Emmagatzemem la api_key.
	 * @param {string} myshared_secret - Emmagatzemem la shared_secret.
	 * @param {string} url - Emmagatzemem la url del usuari.
	 * @param {string} api_sig - Emmagatzemem la api_sig.
	 * @param {string} captured - Emmagatzemem el captured.
	 * @param {string} sk - Emmagatzemem la session key.
	 * @param {string} username - Emmagatzemem el nom d'usuari.
	 * @param {string} userurl - Emmagatzemem la url del usuari.
	 * @param {string} userimage - Emmagatzemem la imatge del usuari.
	 */
	constructor() {
		this.myAPI_key = "abc4563bfb944f73812a105b2559af85";
		this.myshared_secret="b3a42a52baac133e543e842a2cec25bf";
		this.url = null;
		this.api_sig = null;
		this.captured = null;
		this.sk = null;
		this.username = null;
		this.userurl = null;
		this.userimage = null;
	}
}

/**
 * Redirigirem a la pàgina de login de latfm, i després la portarem a la nostra mainpage.
 */
function myLoginFunction(){
			/*
			params api_key ( my api key)
			cb the web that goes when user is authenticated relative path ( depends on the server is launched): http://localhost:3000/mainpage.ht*/
			var url= 'http://www.last.fm/api/auth/?api_key=abc4563bfb944f73812a105b2559af85&cb=https://guillem2001.github.io/lastfm/mainpage.html';

			window.location.replace(url);
}


