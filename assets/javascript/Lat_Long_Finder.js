

$("#sButton").on("click", function(event) {

event.preventDefault();

var address = $("#address").val();

var city = $("#city").val();

var state = $("#state").val();

var zip = $("#zip").val();

queryURL = "http://www.mapquestapi.com/geocoding/v1/address?key=34ltZ5o9YYYglKuCjJJAiFRMgsCYCWc1&location=" + address + "," + city + "," + state + "," + zip;

console.log(queryURL);

$("#address").val("");
$("#city").val("");
$("#state").val("State");
$("#zip").val("");

function getLatLong() {
   $.ajax({
       url: queryURL,
       dataType: 'json',
       async: true,
       success: function (response) {
        //    console.log(response);
        //    console.log (response.results[0].locations[0].latLng)
        //    console.log (queryURL)
           var latLng = (response.results[0].locations[0].latLng)
           console.log(latLng)
           latlon = [latLng.lat,latLng.lng]
           map.remove()
           mapInit()

           makeBackendCalls();

       }
   });
}
getLatLong();

})
