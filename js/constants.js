

class Constants {
	constructor() {
		this.myAPI_key = "abc4563bfb944f73812a105b2559af85";
		this.myshared_secret="b3a42a52baac133e543e842a2cec25bf";
		this.myapplication_name="as";
		this.url = null;
		this.api_sig = null;
		this.captured = null;
	}
}

/** Quan fem login ens redirigeix a la pàgina principal */
function myLoginFunction(){
			/*
			params api_key ( my api key)
			cb the web that goes when user is authenticated relative path ( depends on the server is launched): http://localhost:3000/mainpage.ht*/
			var url= 'http://www.last.fm/api/auth/?api_key=abc4563bfb944f73812a105b2559af85&cb=http://localhost:63342/uf4/mainpage.html';

			window.location.replace(url);
}


