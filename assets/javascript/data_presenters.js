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

    $("#my-table-body tr").on("click", function (event) {

        console.log("row clicked");
        console.log($(this));
        var id = parseInt($(this).attr("id"));
        console.log("id = " + id);


        // Set the info on the modal based on which result was clicked.
        $("#modal-card-title").text(restaurantData.getPlaceName(id));
        if (restaurantData.getPlaceCuisines(id) != "") {
            $("#cuisine-text").text("Cuisine : " + restaurantData.getPlaceCuisines(id));
        }
        if (restaurantData.getPlaceRatingText(id) != "") {
            $("#rating-text").text("Rating : " + restaurantData.getPlaceRatingText(id));
        }
        $("#price-text").text("Price : " + restaurantData.getPlacePriceRange(id));
        // Menu link
        var menu = restaurantData.getPlaceMenuURL(id);
        if (menu != null && menu != "") {
            $("#menu-text").text("MENU");
            $("#menu-text").attr("href",menu);
            
        }


        // Get driving directions.
        var driving_dirs = restaurantData.getPlaceDrivingDirections(id);
        var html_str = "";
        for (var i = 0; i < driving_dirs.length; i++) {
            html_str += "<p>" + driving_dirs[i] + "</p>";
        }
        $("#directions-text2").html(html_str);

        // Get walking directions.
        var walking_dirs = restaurantData.getPlaceWalkingDirections(id);
        var html_str = "";
        for (var i = 0; i < walking_dirs.length; i++) {
            html_str += "<p>" + walking_dirs[i] + "</p>";
        }
        $("#directions-text3").html(html_str);

        var myModal = document.getElementById('myModal');
        myModal.style.display = "block";

    });
}

// Insert an entry to a row in the table.
function insertRow(idx) {

    var name = restaurantData.getPlaceName(idx);
    var rating = restaurantData.getPlaceRating(idx);
    var votes = restaurantData.getPlaceVotes(idx);
    var drive_time = restaurantData.getPlaceDriveTime(idx);
    var walk_time = restaurantData.getPlaceWalkTime(idx);

    console.log("name : " + name);

    var rowName = "" + idx;
    // Create the new row
    var newRow = $("<tr>");
    newRow.attr("id", rowName);
    // Highlight fastest walk in green.
    if (restaurantData.getPlaceIsQuickestWalk(idx) == true) {
        newRow.attr("style", "color: #40bf40");
    }

    // Highlight fastest drive in red.
    if (restaurantData.getPlaceIsQuickestDrive(idx) == true) {
        newRow.attr("style", "color: #ff0000");
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
