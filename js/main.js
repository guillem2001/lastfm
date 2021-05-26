var dades = new Constants();
dades.url = window.location.href;
dades.captured = /token=([^&]+)/.exec(dades.url)[1];


/** Obté la informació del usuari a traves de ajax i obtenim un XML */
function userInfo(){
    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=guillem20012&api_key=' + dades.myAPI_key,
        method: 'GET'
    }).then(function(data) {
        printUser(data);
    });
}

/** Imprimeix el nom del usuari al menú */
function printUser(xml){
    var xmlDoc = xml;
    var x = xmlDoc.getElementsByTagName("user");
    var name = x[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
    $("#nameuser").text(name);
}

function addTagBadBunny(){
    api_sign();
    let api_sig = dades.api_sig;
    let api_key = dades.myAPI_key;
    let sk = dades.captured;
    let artist = "Bad+Bunny";
    let tag = "Conejo";

}

/** Imprimim els artistes similars */
function printSimilars(json){

    var table = "";
    for (var i=0; i< 10; i++)
    {
        table += "<tr><td>" +
            json.similarartists.artist[i].name +
            "</td><td>";
    }
    console.log(json);

    console.log(json.similarartists.artist[i].image[2].size);

    document.getElementById("similars").innerHTML = table;
}

/** Imprimeix els albums */
function tablaAlbums(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table = "";
    var x = xmlDoc.getElementsByTagName("album");
    for (i = 0; i <10; i++) {
        table += "<tr><td>" +
            x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("playcount")[0].childNodes[0].nodeValue +
            "</td><td><img src="+
            x[i].getElementsByTagName("image")[2].childNodes[0].nodeValue + "></img></td></tr>";
    }
    document.getElementById("albums").innerHTML = table;
}

/** Obtenim els albums del artista */
function albums(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            tablaAlbums(this);
        }
    };
    xhttp.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=Bad+Bunny&api_key=" + dades.myAPI_key, true);
    xhttp.send();
}

/** Obtenim els cantants similars al artista */
function similars(){
    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=Bad+Bunny&api_key=' + dades.myAPI_key+ '&format=json',
        dataType: 'json',
        method: 'GET'
    }).then(function(data) {
        printSimilars(data);
    });
}

/** Obtenim el api sig */
function api_sign(){
    //CÁCULO DE API_SIG Para get session
    var data = {
        'token': Utf8.encode(dades.captured),
        'api_key': dades.myAPI_key,
        'method': 'auth.getSession'
    };

    data["api_sig"] = calculateApiSig( data);

    data["format"] = "json";


    var last_url="http://ws.audioscrobbler.com/2.0/?";

    $.ajax({
        type: "GET",
        url: last_url,
        data: data,
        dataType: 'json',
        //"success" gets called when the returned code is a "200" (successfull request). "error" gets called whenever another code is returned (e.g. 404, 500).
        success: function (res) {

            console.log("Resposta: Name " + res.session.name);// Should return session key.
            console.log("Resposta: Key " + res.session.key);
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            console.log('Error - ' + errorMessage);
        }
    });

}

$( document ).ready(function() {
    api_sign();
    albums();
    userInfo();
    similars();
});

/** Calculem el api_sig */
function calculateApiSig( params) {

    //Crec que només necessitem apikey, token i secret i no necessitem params, els podem treure de sessionStorage
    //Calcula l'apiSig a partir dels valors d'abans...
    var stringActual = "";
    var arrayKeysParams = [];


    Object.keys(params).forEach(function (key) {
        arrayKeysParams.push(key); // Get list of object keys
    });
    arrayKeysParams.sort(); // Alphabetise it

    arrayKeysParams.forEach(function (key) {
        stringActual = stringActual + key + params[key]; // build string
    });

    console.log("Mi primer chorizo:" , stringActual);

    stringActual = stringActual + dades.myshared_secret;
    console.log("Mi primer chorizo con shared:" , stringActual);

    console.log("Mi primer chorizo con shared limpio :" , stringActual);


    var hashed_sec = md5(unescape(encodeURIComponent(stringActual)));
    console.log("La apiSig es: " + hashed_sec);
    dades.api_sig = hashed_sec;
    return hashed_sec; // Returns signed POSTable objec */

}
