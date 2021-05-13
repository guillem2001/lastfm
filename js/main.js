var myAPI_key="abc4563bfb944f73812a105b2559af85";
var myshared_secret="b3a42a52baac133e543e842a2cec25bf";

var url = window.location.href; // or window.location.href for current url
var captured = /token=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
var result = captured ? captured : 'myDefaultValue';
console.log(captured);

function printartist(){

    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Justin+Bieber&api_key='+myAPI_key+'&format=json',
        method: 'GET'
    }).then(function(data) {
        console.log(data);
        $("p").text(data.title)
    });

}