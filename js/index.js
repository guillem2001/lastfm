var dades = new Constants();
dades.url = window.location.href;

/** Obté la informació del usuari a traves de ajax i obtenim un XML */
function userInfo(){
    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=guillem20012&api_key=' + dades.myAPI_key,
        method: 'GET'
    }).then(function(data) {
        printUser(data);
    });
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

$( document ).ready(function() {
    albums();
    similars();
});

