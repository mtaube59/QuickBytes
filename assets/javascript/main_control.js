

// Main entry point for the code.
$(document).ready(function () {

    console.log("Main");

    var lat = getLat();
    var lon = getLon();

    // Call restaurant type functions.
    getCuisines(lat, lon);
    getEstablishments(lat, lon);

    var radius_meters = getRadiusMeters();
    getRestaurantData(lat, lon, radius_meters);

})