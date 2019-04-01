/***
 * Get values from HTML file.
 * Right now they are hard coded.
 */

// Get the user location latitude.
function getLat() {
    return latlon[0];
}

// Get the user location longitude.
function getLon() {
    return latlon[1];
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

    console.log("UPDATE TEST TABLE : ");
    console.log(restaurantData.results.length);

    $("#my-table-body").html("");
    for (var i = 0; i < restaurantData.results.length; i++) {
        var place = restaurantData.results[i];
        insertRow(place);
    }
}

// Insert an entry to a row in the table.
function insertRow(place) {

    var name = place.name;
    var rating = place.rating;
    var votes = place.votes;
    var drive_time = place.drive_time;
    var walk_time = place.walk_time;

    console.log("name : " + name);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(rating),
        $("<td>").text(votes),
        $("<td>").text(drive_time),
        $("<td>").text(walk_time)
    );

    // Append the new row to the table
    $("#my-table-body").append(newRow);

}


// Update the table.
function updateTestTable() {

    console.log("UPDATE TEST TABLE : ");
    console.log(restaurantData.results.length);

    $("#my-table-body").html("");
    for (var i = 0; i < restaurantData.results.length; i++) {
        var place = restaurantData.results[i];
        insertRow(place);
    }
}

// Insert an entry to a row in the table.
function insertTestRow(place) {

    var name = place.name;
    var rating = place.rating;
    var votes = place.votes;
    var latitude = place.latitude;
    var longitude = place.longitude;
    var drive_time = place.drive_time;
    var walk_time = place.walk_time;

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(rating),
        $("<td>").text(votes),
        $("<td>").text(latitude),
        $("<td>").text(longitude),
        $("<td>").text(drive_time),
        $("<td>").text(walk_time)
    );

    // Append the new row to the table
    $("#my-table-body").append(newRow);

}