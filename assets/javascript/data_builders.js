
// Get all the types of cuisine in the city with given lat/lon.
function getCuisines(lat, lon) {

    var zomatoQueryURL = "https://developers.zomato.com/api/v2.1/cuisines?" +
        "&lat=" + lat +
        "&lon=" + lon;

    $.ajax({
        url: zomatoQueryURL,
        dataType: 'json',
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('user-key',
                ZOMATO_API_KEY);
        },  // This inserts the api key into the HTTP header
        success: function (response) {
            console.log(response);
        }
    });
}

// Get all the types of establishments in the city with given lat/lon.
function getEstablishments(lat, lon) {

    // Results are sorted in distance ascending order.
    var zomatoQueryURL = "https://developers.zomato.com/api/v2.1/establishments?" +
        "&lat=" + lat +
        "&lon=" + lon;

    $.ajax({
        url: zomatoQueryURL,
        dataType: 'json',
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('user-key',
                ZOMATO_API_KEY);
        },  // This inserts the api key into the HTTP header
        success: function (response) {
            console.log(response);
        }
    });
}

function getRestaurantData(lat, lon, radius_meters) {

    // Results are sorted in distance ascending order.
    var zomatoQueryURL = "https://developers.zomato.com/api/v2.1/search?" +
        "&lat=" + lat +
        "&lon=" + lon +
        "&radius=" + radius_meters +
        "&sort=real_distance&order=asc" +
        "&start=" + ZOMATO_START +
        "&count=" + ZOMATO_COUNT;

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

            /*
            var lat_lon_matrix = [];
            var lat_lon_entry = [];
            lat_lon_entry.push(GWU_LAT);
            lat_lon_entry.push(GWU_LON);
            lat_lon_matrix.push(lat_lon_entry);
            console.log("lat_lon_matrix : " + lat_lon_matrix);
            */
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

                // TODO : Take this test out.
                /*
                if (i == 0) {
                    lat_lon_entry = [place.latitude, place.longitude];
                    lat_lon_matrix.push(lat_lon_entry);
                }
                */


                // Call traffic data for this location.
                getTrafficData(restaurantData.lat,
                    restaurantData.lon,
                    place.latitude,
                    place.longitude);

                // Call walking data for this location.
                getWalkData(restaurantData.lat,
                    restaurantData.lon,
                    place.latitude,
                    place.longitude);
            }

            // We should have all the data to render the map here.
            renderMap();

            // console.log("calling getTrafficData2");
            // getTrafficData2(lat_lon_matrix);

            // Indicate that restaurant data has been filled.
            restaurantData.place_data_done = true;
            console.log("**");
            console.log(restaurantData);

        }
    });
}

function getTrafficData2(lat_lon_matrix) {
    var queryURL = "http://www.mapquestapi.com/directions/v2/routematrix?" +
        "key=" + MAPQUEST_API_KEY;

    console.log(queryURL);

    var test_data = {
        "locations": [
            "Denver, CO",
            "Westminster, CO",
            "Boulder, CO"
        ],
        "options": {
            "allToAll": false
        }
    };

    console.log("test_data : ");
    console.log(JSON.stringify(test_data));

    $.ajax({
        type: "POST",
        url: queryURL,
        data: test_data,
        dataType: 'json',
        async: true,
        success: function (response) {
            console.log("TRAFFIC DATA2 : ");
            console.log(response);


        }
    });
}

function getTrafficData(from_lat, from_lon, to_lat, to_lon) {

    var queryURL = "http://www.mapquestapi.com/directions/v2/route?" +
        "key=" + MAPQUEST_API_KEY +
        "&from=" + from_lat + "," + from_lon +
        "&to=" + to_lat + "," + to_lon +
        "&timeType=1" +
        "&useTraffic=true" +
        "&doReverseGeocode=false";

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        dataType: 'json',
        async: true,
        success: function (response) {
            console.log("TRAFFIC DATA : ");
            console.log(response);

            var lat = 1000000 * response.route.locations[1].latLng.lat;
            var lon = 1000000 * response.route.locations[1].latLng.lng;
            var drive_time = response.route.formattedTime;

            // Search for matching place location entry.
            for (var i = 0; i < restaurantData.results.length; i++) {
                var place = restaurantData.results[i];
                var target_lat = Math.round(place.latitude * 1000000);
                var target_lon = Math.round(place.longitude * 1000000);

                if ((lat == target_lat) && (lon == target_lon)) {

                    if (restaurantData.results[i].drive_time == -1) {
                        console.log("TRAFFIC DATA : Found at index " + i);
                        restaurantData.results[i].drive_time = drive_time;
                        restaurantData.num_commute_data_retrieved++;  // Increment this so we know when we are done.
                        break; // Out of for loop.
                    }
                    else {
                        console.log("TRAFFIC DATA : Duplicate lat/lon at index " + i);
                    }
                }
            }

            // NOTE : Either drive or walk results could return first, so put the check in both places.

            // Set the done flag if possible.
            if (restaurantData.num_commute_data_retrieved == (2 * restaurantData.results.length)) {
                restaurantData.commute_data_done = true;
                // Update data to the table.
                updateTable();
            }

        }
    });
}

function getWalkData(from_lat, from_lon, to_lat, to_lon) {

    var queryURL = "http://www.mapquestapi.com/directions/v2/route?" +
        "key=" + MAPQUEST_API_KEY +
        "&from=" + from_lat + "," + from_lon +
        "&to=" + to_lat + "," + to_lon +
        "&routeType=pedestrian" +
        "&doReverseGeocode=false";

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        dataType: 'json',
        async: true,
        success: function (response) {
            console.log("WALK DATA : ");
            console.log(response);

            var lat = 1000000 * response.route.locations[1].latLng.lat;
            var lon = 1000000 * response.route.locations[1].latLng.lng;
            var walk_time = response.route.formattedTime;

            // Search for matching place location entry.
            for (var i = 0; i < restaurantData.results.length; i++) {
                var place = restaurantData.results[i];
                var target_lat = Math.round(place.latitude * 1000000);
                var target_lon = Math.round(place.longitude * 1000000);

                if ((lat == target_lat) && (lon == target_lon)) {

                    // If the walk_time has already been filled, go to next.
                    if (restaurantData.results[i].walk_time == -1) {
                        console.log("WALK DATA : Found at index " + i);
                        restaurantData.results[i].walk_time = walk_time;
                        restaurantData.num_commute_data_retrieved++;  // Increment this so we know when we are done.
                        break; // Out of for loop.
                    }
                    else {
                        console.log("WALK DATA : Duplicate lat/lon at index " + i);
                    }

                }
            }

            // NOTE : Either drive or walk results could return first, so put the check in both places.

            // Set the done flag if possible.
            if (restaurantData.num_commute_data_retrieved == (NUM_TRANSPORTATION_METHODS * restaurantData.results.length)) {
                restaurantData.commute_data_done = true;
                // Update data to the table.
                updateTable();
            }

        }
    });
}

