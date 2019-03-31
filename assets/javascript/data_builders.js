
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

            // Create the routing matrix with the current location as the first entry.
            var lat_lon_matrix = [];
            var lat_lon_pair = "" + GWU_LAT + "," + GWU_LON;
            lat_lon_matrix.push(lat_lon_pair);
            console.log("lat_lon_matrix : " + lat_lon_matrix);

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

                // Append each location to the routing matrix.
                lat_lon_pair = "" + place.latitude + "," + place.longitude;
                lat_lon_matrix.push(lat_lon_pair);

            }

            // We should have all the data to render the map here.
            renderMap();

            console.log("lat_lon_matrix : " + lat_lon_matrix);
            if (DO_MAPQUEST == false) {
                getTestTrafficData();

                getTestWalkData();

            }
            else {
                getTrafficData2(lat_lon_matrix);
                getWalkData2(lat_lon_matrix);
            }

            // Indicate that restaurant data has been filled.
            restaurantData.place_data_done = true;
            console.log("**");
            console.log(restaurantData);

        }
    });
}

function getTrafficData2(location_matrix) {

    var route_matrix_obj = {
        "locations": location_matrix,
        "options": {
            "allToAll": false,
            "timeType": 1,
            "useTraffic": true,
            "doReverseGeocode": false,
            "narrativeType": "text"
        }
    };

    var route_matrix = JSON.stringify(route_matrix_obj);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://www.mapquestapi.com/directions/v2/routematrix?key=" + MAPQUEST_API_KEY,
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "processData": false,
        "data": route_matrix
    }

    console.log("getTrafficData2");

    $.ajax(settings).done(function (response) {
        console.log("getTrafficData2");
        console.log(response);


        // Write drive times to results.
        for (var i = 0; i < restaurantData.results.length; i++) {
            var place = restaurantData.results[i];
            var drive_time_s = response.time[i + 1]; // i + 1 because the 0th entry holds the point of origin.
            var drive_time_text = hhmmss(drive_time_s);
            console.log(drive_time_text);

            place.drive_time = drive_time_text;
        }

        // Set the done flag if possible.
        restaurantData.num_commute_data_retrieved++;
        if (restaurantData.num_commute_data_retrieved == NUM_TRANSPORTATION_METHODS) {
            restaurantData.commute_data_done = true;
            // Update data to the table.
            updateTable();
        }

    });
}

function getWalkData2(location_matrix) {

    var route_matrix_obj = {
        "locations": location_matrix,
        "options": {
            "allToAll": false,
            "routeType": "pedestrian",
            "doReverseGeocode": false
        }
    };

    var route_matrix = JSON.stringify(route_matrix_obj);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://www.mapquestapi.com/directions/v2/routematrix?key=" + MAPQUEST_API_KEY,
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "processData": false,
        "data": route_matrix
    }

    console.log("getTrafficData2");

    $.ajax(settings).done(function (response) {
        console.log("getTrafficData2");
        console.log(response);


        // Write drive times to results.
        for (var i = 0; i < restaurantData.results.length; i++) {
            var place = restaurantData.results[i];
            var walk_time_s = response.time[i + 1]; // i + 1 because the 0th entry holds the point of origin.
            var walk_time_text = hhmmss(walk_time_s);
            console.log(walk_time_text);

            place.walk_time = walk_time_text;
        }

        // Set the done flag if possible.
        restaurantData.num_commute_data_retrieved++;
        if (restaurantData.num_commute_data_retrieved == NUM_TRANSPORTATION_METHODS) {
            restaurantData.commute_data_done = true;
            // Update data to the table.
            updateTable();
        }

    });
}

// Custom coding for converting seconds to hh:mm:ss format.
// Moment.js does not handle this well.  It adds on bogus hours for some reason.
function pad(num) {
    return ("0" + num).slice(-2);
}
function hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
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

// Populates the table with bogus drive time data.  Used for testing only.
function getTestTrafficData() {

    // Search for matching place location entry.
    for (var i = 0; i < restaurantData.results.length; i++) {
        var place = restaurantData.results[i];

        // Generate a random drive time.
        var drive_time_s = Math.random() * (MAX_TEST_DRIVE_TIME - MIN_TEST_DRIVE_TIME) + MIN_TEST_DRIVE_TIME;
        var drive_time = "01:" + moment(drive_time_s, "X").format("mm:ss");
        console.log(drive_time);
        restaurantData.results[i].drive_time = drive_time;

        restaurantData.num_commute_data_retrieved++;

    }

    // Set the done flag if possible.
    if (restaurantData.num_commute_data_retrieved == (NUM_TRANSPORTATION_METHODS * restaurantData.results.length)) {
        restaurantData.commute_data_done = true;
        // Update data to the table.
        updateTable();
    }

}

// Populates the table with bogus drive time data.  Used for testing only.
function getTestWalkData() {

    // Search for matching place location entry.
    for (var i = 0; i < restaurantData.results.length; i++) {
        var place = restaurantData.results[i];

        // Generate a random walk time.
        var walk_time_s = Math.random() * (MAX_TEST_WALK_TIME - MIN_TEST_WALK_TIME) + MIN_TEST_WALK_TIME;
        var walk_time = "01:" + moment(walk_time_s, "X").format("mm:ss");
        console.log(walk_time);
        restaurantData.results[i].walk_time = walk_time;

        restaurantData.num_commute_data_retrieved++;

    }

    // Set the done flag if possible.
    if (restaurantData.num_commute_data_retrieved == (NUM_TRANSPORTATION_METHODS * restaurantData.results.length)) {
        restaurantData.commute_data_done = true;
        // Update data to the table.
        updateTable();
    }

}

