

// Main entry point for the code.
$(document).ready(function () {

    console.log("Main");

    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    makeBackendCalls();

})

function makeBackendCalls() {

    console.log("makeBackendCalls");

    var lat = getLat();
    var lon = getLon();

    // Call restaurant type functions.
    getCuisines(lat, lon);
    getEstablishments(lat, lon);

    var radius_meters = getRadiusMeters();
    getRestaurantData(lat, lon, radius_meters);
}