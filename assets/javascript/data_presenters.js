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
    console.log("updateTable : ");
    console.log(restaurantData);

    $("#my-table-body").html("");
    for (var i = 0; i < restaurantData.getResultsLength(); i++) {
        if (restaurantData.getPlaceIsDataValid(i)) {
            insertRow(i);
        }
    }
}

// Insert an entry to a row in the table.
function insertRow(idx) {

    var name = restaurantData.getPlaceName(idx);
    var rating = restaurantData.getPlaceRating(idx);
    var votes = restaurantData.getPlaceVotes(idx);
    var drive_time = restaurantData.getPlaceDriveTime(idx);
    var walk_time = restaurantData.getPlaceWalkTime(idx);

    console.log("name : " + name);
    // Create the new row
    var newRow = $("<tr>");
    // Highlight fastest walk in green.
    if (restaurantData.getPlaceIsQuickestWalk(idx) == true) {
        newRow = $("<tr style=\"color: #40bf40\">");
    }

    // Highlight fastest drive in red.
    if (restaurantData.getPlaceIsQuickestDrive(idx) == true) {
        newRow = $("<tr style=\"color: #ff0000\">");
    }

    newRow.append(
        $("<td>").text(name),
        $("<td>").text(rating),
        $("<td>").text(votes),
        $("<td>").text(drive_time),
        $("<td>").text(walk_time)
    );

    // Append the new row to the table
    $("#my-table-body").append(newRow);

}
