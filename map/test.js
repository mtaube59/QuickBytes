
var map = L.map('map', { center: [38.918648, -77.153632], zoom: 14 });
console.log(map);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
var myDataPoint = L.marker([38.918648, -77.153632]).addTo(map);

$("#map").append(map)


