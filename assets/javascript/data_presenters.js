
/***
 * Get values from HTML file.
 * Right now they are hard coded.
 */

// Get the user location latitude.
function getLat() {
    return GWU_LAT;
}

// Get the user location longitude.
function getLon() {
    return GWU_LON;
}

// Get the requested search radius in meters.
function getRadiusMeters() {
    return RADIUS_METERS;
}

/************************************************
 * These functions modify the HTML file.
 */

 // Update the table.
 function updateTable() {
     for ( var i=0; i<restaurantData.results.length; i++ ) {
         var place = restaurantData.results[i];
         insertRow(place);
     }
 }

// Insert an entry to a row in the table.
function insertRow(place) {

    var name = place.name;
    var rating = place.rating;
    var votes = place.votes;
    var latitude = place.latitude;
    var longitude = place.longitude;
    var drive_time = place.drive_time;

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(rating),
        $("<td>").text(votes),
        $("<td>").text(latitude),
        $("<td>").text(longitude),
        $("<td>").text(drive_time)
    );

    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);

}
