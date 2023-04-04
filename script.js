
// stworzenie mapy

var map = L.map( 'map', {
    center: [52.4, 16.9],   // współrzędne Poznania
    minZoom: 7,     //minimalny, maksymalny oraz defaultowy zoom
    maxZoom: 25,
    zoom: 12,
    zIndex: 1,  // kolejnosc wyswietlania warstwy - z index-1 znajduje się wyżej nad warstwą z z-index 0 itd.
    zoomSnap:0.001,     //delikatnosc przyblizania mapy
  });





// dodanie podkładów mapowych

var openstreetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


    // podkłady mapowe z leaflet basemaps providers
var leaflet = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

var satelita = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});







// dodanie warstw rastrowych jako wms
// warstwa temperatury została zakomentowana wszędzie, aby strona się poprawnie wyświetliła
/*
var temperatura = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {  // link do zasobów warstw wms, ta akurat jest z lokalnego geoservera, więc nie wyświetli się
    layers: 'temperatura_poznan',   //nazwa warstwy
    format: 'image/png',    //format warstwy
    transparent: true,  //przezroczystosc wartosc irastra równych 0
    opacity:1,  //nieprzezroczystosc całej warestwy
}).addTo(map)
*/

var ndvi = L.tileLayer.wms("http://wms2.geopoz.poznan.pl/geoserver/satelitarne/wms??service?", {        //warstwa z ndvi wyświetli się, ponieważ jest udostępniona publicznie na SIP Poznań
    layers: 'sentinel_2018_07_15_ndvi',
    format: 'image/png',
    transparent: true,
    opacity:1,
}).addTo(map)







// dodanie warstw wektorowych

var parki = new L.geoJSON(parki_2, {onEachFeature:function forEachFeature (feature,layer){
    if (feature.properties.name != null){       // tutaj mozna użyć innego warunku, ten jednak jest najpewniejszy, ponieważ najpewniej każdy park ma nazwę (jeśli park posiada nazwę, wtedy to i to)
        layer.bindPopup('<h3>'+feature.properties.name +'</h3>' + '<b> Powierzchnia: </b>' + feature.properties.area + ' ha' +      //wywołanie popupu ze zdefiniowanym tekstem - nazwy parku oraz jego powierzchni
        '<img style = "border:1px solid #222222; margin-top:10px;" src ="dane/cytadela.jpg" width = "300px" height = "150px"/>'
        )
        layer.on('click', function (e) {    //zdefiniowanie otworzenia popupu i ustawienia widoku po kliknięcie w daną warstwę
            this.openPopup();
            map.setView(e.latlng, 15);
        });
        layer.on('clickout', function (e) { //zdefiniowanie zamknięcia popupu po nakliknięciu poza warstwą
            this.closePopup();
        });
            }},
            style:function style(feature) { //ustawienie stylu warstwy
                return {
                    fillColor: '#3c6e4f',
                    weight: 1,
                    opacity: 1,
                    color: '#333',
                    dashArray: '1',
                    fillOpacity: 0.95
                    //pane: "parki"
                };  }
}).addTo(map)



// zdefiniowanie ikony kawiarni pobranej ze strony flaticon - najpiew należy ją zdefiniować, potem podłączyć poniżej w warstwie kawiarni
var ikona = L.icon({
    iconUrl: 'dane/cafe_1.png',
    iconSize:     [38, 38], 
    shadowSize:   [50, 64], 
    //iconAnchor:   [22, 94], 
    shadowAnchor: [4, 62], 
    popupAnchor:  [0, -20] 
});

var kawiarnie = new L.geoJSON(kawiarnie, {onEachFeature:function forEachFeature (feature,layer){    //tak samo jak w przypadku parków, brakuje jedynie stylu, ponieważ to warstwa puktowa
    if (feature.properties.name != null){
        layer.bindPopup('<h3>'+feature.properties.name +'</h3>')
        layer.on('click', function (e) {
            this.openPopup();
        });
        layer.on('clickout', function (e) {
            this.closePopup();
        });
            }},
            pointToLayer: function(feature,latlng){     //podłączenie ikony kawiarni
                return L.marker(latlng,{icon: ikona});
            }
    
}).addTo(map)







// panel z kontrolami warstw i podkładów mapowych

//podkłady mapowe
var baseMaps = {
    "OpenStreetMap": openstreetmap,     //"nazwa wyświetlana": zmienna z warstwą/mapą
    "Satelita": satelita,
    "Leaflet": leaflet
}

// warstwy
var overlayMaps = {
    //"Temperatura": temperatura, 
    "NDVI": ndvi,
    "Parki": parki,
    "Kawiarnie": kawiarnie
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);







// proste wyświetlanie divu "container" po nakliknięciu na warstwę parków

parki.on('click', function(){
    document.getElementById("container").style.display = "block";
})

//chowanie divu po nakliknięciu poza warstwą, na mapę
map.on('click', function(){
    document.getElementById("container").style.display = "none";
})
