
var map = L.map('map', { center: [38.8813513, -77.1160333], zoom: 18 });
console.log(map);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
var myDataPoint = L.marker([38.8815875597, -77.1162584424]).addTo(map);
L.marker([38.8819420000, -77.1162520000]).addTo(map);
MQ.trafficLayer().addTo(map);

$("#map").append(map)

// window.onload = function() {
//     var map = L.map('map', {
//       layers: MQ.mapLayer(),
//       center: [38.918648, -77.153632],
//       zoom: 12
//     });

//   MQ.trafficLayer().addTo(map);
// };




//   myQuery = src="http://open.mapquestapi.com/geocoding/v1/address?key=z46ESgSzqFeygrKF9pBxx0CWLxm937eB&location=Washington,DC"

//   $.ajax({
//       url: myQuery,
//       Method: "GET"
//   }).then(function(response){
//       console.log(response);
//   })




