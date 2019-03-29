
$(document).ready(function () {

    var GWU_LAT = 38.8813513; // TODO : How do we get this?
    var GWU_LON = -77.1160333; // TODO : How do we get this?
    var RADIUS_METERS = 8045; // 5 miles.
    var ENTITY_ID = 115948;  // TODO : How do we get this?
    var ENTITY_TYPE = "subzone"; // TODO : How do we get this?

    var ZOMATO_DONE = false; // Zomato query is done.
    var MAPQUEST_DONE = false; // Mapquest query is done.
    var TABLE_DATA = [];

    //var queryURL = "https://developers.zomato.com/api/v2.1/geocode?lat=38.8813513&lon=-77.1160333";
    var zomatoQueryURL = "https://developers.zomato.com/api/v2.1/search?" +
        "entity_id=" + ENTITY_ID +
        "&entity_type=" + ENTITY_TYPE +
        "&lat=" + GWU_LAT +
        "&lon=" + GWU_LON +
        "&radius=" + RADIUS_METERS +
        "&sort=real_distance&order=asc";

    var mapquestQueryURL = "http://www.mapquestapi.com/directions/v2/route?" +
        "key=" + MAPQUEST_API_KEY +
        "&from=" + GWU_LAT + "," + GWU_LON;
        //"&to=" + TEST_LAT + "," + TEST_LON;


    $.ajax({
        url: zomatoQueryURL,
        dataType: 'json',
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('user-key',
                ZOMATO_API_KEY);
        },  // This inserts the api key into the HTTP header
        success: function (response) {
            console.log(response)

            var res_start = response.results_start;
            var res_end = res_start + response.results_shown;
            var title = "<h2>Results " + res_start + " - " + res_end + " of " + response.results_found + "</h2>";
            $("#resultsTitle").html(title);
            for (var i = 0; i < response.restaurants.length; i++) {
                insertRow(response, i);
            }

            // Print out the JSON of a single entry.
            if (response.restaurants.length > 0) {
                stringifyEntry(response, 0);
            }

        }
    });

    // Insert a row to the table.
    function insertRow(myResp, idx) {

        var myRestaurant = myResp.restaurants[idx].restaurant;
        var name = myRestaurant.name;
        var rating = myRestaurant.user_rating.aggregate_rating;
        var votes = myRestaurant.user_rating.votes;
        var latitude = myRestaurant.location.latitude;
        var longitude = myRestaurant.location.longitude;

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(name),
            $("<td>").text(rating),
            $("<td>").text(votes),
            $("<td>").text(latitude),
            $("<td>").text(longitude)
        );

        // Append the new row to the table
        $("#employee-table > tbody").append(newRow);

    }

    // Stringify the first entry.
    function stringifyEntry(myResp, idx) {
        var myRestaurant = myResp.restaurants[idx].restaurant;
        var jsonString = JSON.stringify(myRestaurant);
        $("#jsonResponse").text(jsonString);
    }

})