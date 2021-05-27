var dades = new Dades();
dades.url = window.location.href;
dades.captured = /token=([^&]+)/.exec(dades.url)[1];

/** Obté la informació del usuari a traves de ajax i obtenim un XML */
function userInfo() {
    console.log(dades.username);
    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=' + dades.username + '&api_key=' + dades.myAPI_key,
        method: 'GET'
    }).then(function (data) {
        printUser(data);
    });
}

function printUser(xml) {
    var xmlDoc = xml;
    var x = xmlDoc.getElementsByTagName("user");
    var name = x[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var img = x[0].getElementsByTagName("image")[0].childNodes[0].nodeValue;
    var url = x[0].getElementsByTagName("url")[0].childNodes[0].nodeValue;
    dades.userurl = url;
    dades.userimage = img;
    dades.username = name;
    $("#nameuser").text(dades.username);
    $("#imguser").attr("src", dades.userimage);
    sessionStorage.setItem("img", dades.userimage);
    sessionStorage.setItem("name", dades.username);
}

function print() {
    if (sessionStorage.getItem("name") && sessionStorage.getItem("img")) {
        let username = sessionStorage.getItem("name");
        let userimage = sessionStorage.getItem("img");
        $("#nameuser").text(username);
        $("#imguser").attr("src", userimage);
    }
    if (sessionStorage.getItem("sk")) {
        dades.sk = sessionStorage.getItem("sk");
    }
}

/** Imprimeix el nom del usuari al menú */
function addTagBadBunny() {
    var last_url = "http://ws.audioscrobbler.com/2.0/?";

    var params = {
        artist: 'Bad Bunny',
        tags: 'Conejo',
        api_key: dades.myAPI_key,
        method: 'album.addTags',
        sk: dades.sk
    };

    params["api_sig"] = calculateApiSig(params);
    params['format'] = 'json';

    $.ajax({
        type: "GET",
        url: last_url,
        data: params,
        dataType: 'json',
        //"success" gets called when the returned code is a "200" (successfull request). "error" gets called whenever another code is returned (e.g. 404, 500).
        success: function (res) {
            $('#missatgeError').css("display", "none");
            $('#missatgeOk').text("Tag afegit");
            $("#missatgeOk").css("display", "block");
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            console.log('Error - ' + errorMessage);
            $('#missatgeOk').css("display", "none");
            $('#missatgeError').text("Error al afegir el tag");
            $("#missatgeError").css("display", "block");
        }
    });

}

/** Imprimim els artistes similars */
function printSimilars(json) {

    var table = "";
    for (var i = 0; i < 10; i++) {
        table += "<tr><td scope='row'>" +
            json.similarartists.artist[i].name +
            "</td><td>";
    }
    //console.log(json);

    //console.log(json.similarartists.artist[i].image[2].size);

    document.getElementById("similars").innerHTML = table;
}

/** Imprimeix els albums */
function tablaAlbums(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table = "";
    var x = xmlDoc.getElementsByTagName("album");
    for (i = 0; i < 10; i++) {
        table += "<tr><td>" +
            x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("playcount")[0].childNodes[0].nodeValue +
            "</td><td><img src=" +
            x[i].getElementsByTagName("image")[2].childNodes[0].nodeValue + "></img></td></tr>";
    }
    document.getElementById("albums").innerHTML = table;
}

/** Obtenim els albums del artista */
function albums() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            tablaAlbums(this);
        }
    };
    xhttp.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=Bad+Bunny&api_key=" + dades.myAPI_key, true);
    xhttp.send();
}

/** Obtenim els cantants similars al artista */
function similars() {
    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=Bad+Bunny&api_key=' + dades.myAPI_key + '&format=json',
        dataType: 'json',
        method: 'GET'
    }).then(function (data) {
        printSimilars(data);
    });
}

/** Obtenim el api sig */
function cargaInicial() {
    //CÁCULO DE API_SIG Para get session
    var data = {
        'token': Utf8.encode(dades.captured),
        'api_key': dades.myAPI_key,
        'method': 'auth.getSession'
    };

    data["api_sig"] = calculateApiSig(data);

    data["format"] = "json";


    var last_url = "http://ws.audioscrobbler.com/2.0/?";

    $.ajax({
        type: "GET",
        url: last_url,
        data: data,
        dataType: 'json',
        //"success" gets called when the returned code is a "200" (successfull request). "error" gets called whenever another code is returned (e.g. 404, 500).
        success: function (res) {
            console.log("Resposta: Name " + res.session.name);// Should return session key.
            console.log("Resposta: Key " + res.session.key);
            dades.sk = res.session.key;
            sessionStorage.setItem("sk", res.session.key);
            dades.username = res.session.name;
            userInfo();
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            console.log('Error - ' + errorMessage);
        }
    });

}

$(document).ready(function () {
    cargaInicial();
    albums();
    similars();
    print();
});

/** Calculem el api_sig */
function calculateApiSig(params) {

    //Crec que només necessitem apikey, token i secret i no necessitem params, els podem treure de sessionStorage
    //Calcula l'apiSig a partir dels valors d'abans...
    var stringActual = "";
    var arrayKeysParams = [];


    Object.keys(params).forEach(function (key) {
        if (key !== "format" && key != "callback") {
            arrayKeysParams.push(key); // Get list of object keys
        }
    });
    arrayKeysParams.sort(); // Alphabetise it

    arrayKeysParams.forEach(function (key) {
        stringActual = stringActual + key + params[key]; // build string
    });

    //console.log("Mi primer chorizo:" , stringActual);

    stringActual = stringActual + dades.myshared_secret;
    //console.log("Mi primer chorizo con shared:" , stringActual);

    //console.log("Mi primer chorizo con shared limpio :" , stringActual);


    var hashed_sec = md5(unescape(encodeURIComponent(stringActual)));
    console.log("La apiSig es: " + hashed_sec);
    dades.api_sig = hashed_sec;
    return hashed_sec; // Returns signed POSTable objec */

}
