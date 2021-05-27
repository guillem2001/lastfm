var dades = new Dades();
dades.url = window.location.href;

/** Imprimim els artistes similars a Badd Buny*/
function printSimilars(json) {

    var table = "";
    for (var i = 0; i < 10; i++) {
        table += "<tr><td>" +
            json.similarartists.artist[i].name +
            "</td><td>";
    }
    console.log(json);

    console.log(json.similarartists.artist[i].image[2].size);

    document.getElementById("similars").innerHTML = table;
}

/** Imprimeix els albums de Bad Bunny */
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

/** Obtenim els albums de Badd Bunny a traves de  XMLHttpRequest en format XML*/
function albums() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            tablaAlbums(this);
        }
    };
    xhttp.open("GET", "https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=Bad+Bunny&api_key=" + dades.myAPI_key, true);
    xhttp.send();
}

/** Obtenim els cantants similars al artista a traves de ajax en format json */
function similars() {
    $.ajax({
        url: 'https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=Bad+Bunny&api_key=' + dades.myAPI_key + '&format=json',
        dataType: 'json',
        method: 'GET'
    }).then(function (data) {
        printSimilars(data);
    });
}

/** Al carregar el document executarem les funcions */
$(document).ready(function () {
    albums();
    similars();
});

