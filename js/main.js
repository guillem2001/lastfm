const myAPI_key="abc4563bfb944f73812a105b2559af85";
const myshared_secret="b3a42a52baac133e543e842a2cec25bf";

const url = window.location.href;
const captured = /token=([^&]+)/.exec(url)[1];
const result = captured ? captured : 'myDefaultValue';
let api_sig = null;

function printartist(){

    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Justin+Bieber&api_key='+myAPI_key+'&format=json',
        method: 'GET'
    }).then(function(data) {
        console.log(data);
    });
}

function userInfo(){
    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=guillem20012&api_key=' + myAPI_key,
        method: 'GET'
    }).then(function(data) {
        printUser(data);
    });
}

function printUser(xml){
    var xmlDoc = xml.responseXML;
    var x = xmlDoc.getElementsByTagName("user");
    var name = x[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
    $("#nameuser").text(name);
}

function tablaAlbums(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table="<tr><th>Nom</th><th>Playcount</th><th>Foto</th></tr>";
    var x = xmlDoc.getElementsByTagName("album");
    for (i = 0; i <10; i++) {
        table += "<tr><td>" +
            x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("playcount")[0].childNodes[0].nodeValue +
            "</td><td><img src="+
            x[i].getElementsByTagName("image")[2].childNodes[0].nodeValue + "></img></td></tr>";
        console.log(x[i]);
    }
    document.getElementById("albums").innerHTML = table;
}

function albums(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            tablaAlbums(this);
        }
    };
    xhttp.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=Bad+Bunny&api_key=abc4563bfb944f73812a105b2559af85", true);
    xhttp.send();
}

$( document ).ready(function() {
    //CÁCULO DE API_SIG Para get session
    var data = {
        'token': Utf8.encode(captured),
        'api_key': myAPI_key,
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
            $("#nameuser").text(res.session.name);
            //$("#imguser").attr("src", src1);
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            console.log('Error - ' + errorMessage);
        }
    });
    albums();
    userInfo();
});

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

    stringActual = stringActual + myshared_secret;
    console.log("Mi primer chorizo con shared:" , stringActual);

    console.log("Mi primer chorizo con shared limpio :" , stringActual);


    var hashed_sec = md5(unescape(encodeURIComponent(stringActual)));
    console.log("La apiSig es: " + hashed_sec);
    api_sig = hashed_sec;
    return hashed_sec; // Returns signed POSTable objec */

}
