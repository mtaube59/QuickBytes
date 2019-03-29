


function getRestaurantData(lat, lon, radius_meters) {

    // Results are sorted in distance ascending order.
    var zomatoQueryURL = "https://developers.zomato.com/api/v2.1/search?" +
        "entity_id=" + ENTITY_ID +
        "&entity_type=" + ENTITY_TYPE +
        "&lat=" + lat +
        "&lon=" + lon +
        "&radius=" + radius_meters +
        "&sort=real_distance&order=asc";

    restaurantData.lat = lat;
    restaurantData.lon = lon;
    restaurantData.radius_meters = radius_meters;

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

            // Object to hold our data.
            restaurantData.place_data_done = false;
            restaurantData.commute_data_done = false;
            restaurantData.num_commute_data_retrieved = 0; // Number of commute data calls retrieved.
            restaurantData.results_start = response.results_start;
            restaurantData.results_shown = response.results_shown;
            restaurantData.results_found = response.results_found;
            restaurantData.results = [];
            restaurantData.results.length = 0;


            console.log(restaurantData);

            var res_start = response.results_start;
            var res_end = res_start + response.results_shown;
            var title = "<h2>Results " + res_start + " - " + res_end + " of " + response.results_found + "</h2>";
            $("#resultsTitle").html(title);
            for (var i = 0; i < response.restaurants.length; i++) {
                //insertRow(response, i);

                var currentRestaurant = response.restaurants[i];
                // Temporary object to hold individual restaurant data.
                var place = {
                    name: currentRestaurant.restaurant.name,
                    rating: currentRestaurant.restaurant.user_rating.aggregate_rating,
                    votes: currentRestaurant.restaurant.user_rating.votes,
                    latitude: currentRestaurant.restaurant.location.latitude,
                    longitude: currentRestaurant.restaurant.location.longitude,
                    drive_time: -1,
                    walk_time: -1
                }

                // Push to the end of the restaurantData.results array.
                restaurantData.results.push(place);

                // Call traffic data for this location.
                getTrafficData(restaurantData.lat,
                    restaurantData.lon,
                    place.latitude,
                    place.longitude);
            }

            // Indicate that restaurant data has been filled.
            restaurantData.place_data_done = true;
            console.log("**");
            console.log(restaurantData);

            // Update data to the table.
            //updateTable();

        }
    });
}

function getTrafficData(from_lat, from_lon, to_lat, to_lon) {

    var queryURL = "http://www.mapquestapi.com/directions/v2/route?" +
        "key=" + MAPQUEST_API_KEY +
        "&from=" + from_lat + "," + from_lon +
        "&to=" + to_lat + "," + to_lon;

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        dataType: 'json',
        async: true,
        success: function (response) {
            console.log("TRAFFIC DATA : ");
            console.log(response);

            console.log(response.route.locations[1].latLng);
            var lat = 1000000 * response.route.locations[1].latLng.lat;
            var lon = 1000000 * response.route.locations[1].latLng.lng;

            console.log("response lat " + lat);
            console.log("response lon " + lon);

            var drive_time = response.route.formattedTime;
            console.log("drive_time = " + drive_time);

            // Search for matching place location entry.
            for (var i = 0; i < restaurantData.results.length; i++) {
                var place = restaurantData.results[i];
                var target_lat = Math.round(place.latitude * 1000000);
                var target_lon = Math.round(place.longitude * 1000000);

                if ((lat == target_lat) && (lon == target_lon)) {
                    console.log("Found at index " + i);
                    restaurantData.results[i].drive_time = drive_time;
                    restaurantData.num_commute_data_retrieved++;  // Increment this so we know when we are done.
                    break; // Out of for loop.
                }
            }

            // Set the done flag if possible.
            if (restaurantData.num_commute_data_retrieved == restaurantData.results.length)
            {
                restaurantData.commute_data_done = true;
            }

            if ( restaurantData.commute_data_done === true ) {
                // Update data to the table.
                updateTable();
            }
        }
    });
}

