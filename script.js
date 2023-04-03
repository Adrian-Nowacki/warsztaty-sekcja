var map = L.map('map').setView([52.4, 16.9], 12);




// mapy bazowe

var openstreetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var leaflet = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

var satelita = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});





var temperatura = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
layers: 'temperatura_poznan',
format: 'image/png',
transparent: true,
opacity:1,
}).addTo(map)

var ndvi = L.tileLayer.wms("http://wms2.geopoz.poznan.pl/geoserver/satelitarne/wms??service?", {
layers: 'sentinel_2018_07_15_ndvi',
format: 'image/png',
transparent: true,
opacity:1,
}).addTo(map)


//warstwy wektorowe

var parki = new L.geoJSON(parki_2, {onEachFeature:function forEachFeature (feature,layer){
    if (feature.properties.name != null){
        layer.bindPopup('<h3>'+feature.properties.name +'</h3>' + '<b> Powierzchnia: </b>' + feature.properties.area + ' ha' +
        '<img style = "border:1px solid #222222; margin-top:10px;" src ="dane/cytadela.jpg" width = "300px" height = "150px"/>'
        )
        layer.on('click', function (e) {
            this.openPopup();
            map.setView(e.latlng, 15);
        });
        layer.on('clickout', function (e) {
            this.closePopup();
        });
            }},
            style:function style(feature) {
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


// ikona kawiarni
var ikona = L.icon({
    iconUrl: 'dane/cafe_1.png',
    iconSize:     [38, 38], 
    shadowSize:   [50, 64], 
    //iconAnchor:   [22, 94], 
    shadowAnchor: [4, 62], 
    popupAnchor:  [0, -20] 
});



var kawiarnie = new L.geoJSON(kawiarnie, {onEachFeature:function forEachFeature (feature,layer){
    if (feature.properties.name != null){
        layer.bindPopup('<h3>'+feature.properties.name +'</h3>')
        layer.on('click', function (e) {
            this.openPopup();
        });
        layer.on('clickout', function (e) {
            this.closePopup();
        });
            }},
            pointToLayer: function(feature,latlng){
                return L.marker(latlng,{icon: ikona});
            }
    
}).addTo(map)







var baseMaps = {
    "OpenStreetMap": openstreetmap,
    "Satelita": satelita,
    "Leaflet": leaflet
}

var overlayMaps = {
    "Temperatura": temperatura,
    "NDVI": ndvi,
    "Parki": parki,
    "Kawiarnie": kawiarnie
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);


parki.on('click', function(){
    document.getElementById("container").style.display = "block";
})


map.on('click', function(){
    document.getElementById("container").style.display = "none";
})
