function mapInit() {
    map = L.map('map', { center: latlon, zoom: 17 });
    //code from https://github.com/pointhi/leaflet-color-markers
    var greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    L.marker(latlon,{icon: greenIcon}).addTo(map);
    console.log(map);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
    MQ.trafficLayer().addTo(map);
};
function renderMap() {



    var markers = [];
    console.log(markers);

    for (var i = 0; i < restaurantData.results.length; i++) {

        var lat = restaurantData.results[i].latitude;
        var lon = restaurantData.results[i].longitude;
        var name = restaurantData.results[i].name;

        var temp = [lat, lon, name];
        markers.push(temp)
    }
    console.log(markers);


    //code from https://harrywood.co.uk/maps/examples/leaflet/marker-array.view.html
    for (var i = 0; i < markers.length; i++) {

        var lat = markers[i][0];
        var lon = markers[i][1];
        var popupText = markers[i][2];

        var markerLocation = new L.LatLng(lat, lon);
        var marker = new L.Marker(markerLocation);
        map.addLayer(marker);

        marker.bindPopup(popupText);

    }


    $("#map").append(map)
}
mapInit()



