
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

            console.log("**** ZOMATO RESULTS ****");
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

            for (var i = 0; i < response.restaurants.length; i++) {

                var currentRestaurant = response.restaurants[i];
                // Temporary object to hold individual restaurant data.
                var place = {
                    name: currentRestaurant.restaurant.name,
                    rating: currentRestaurant.restaurant.user_rating.aggregate_rating,
                    votes: currentRestaurant.restaurant.user_rating.votes,
                    latitude: currentRestaurant.restaurant.location.latitude,
                    longitude: currentRestaurant.restaurant.location.longitude,
                    drive_time: -1,
                    walk_time: -1,
                    drive_time_s: -1,
                    walk_time_s: -1,
                    driving_directions: [],
                    walking_directions: [],
                    is_quickest_drive: false,
                    is_quickest_walk: false,
                    cuisines: currentRestaurant.restaurant.cuisines,
                    menu_url: currentRestaurant.restaurant.menu_url,
                    rating_text: currentRestaurant.restaurant.user_rating.rating_text,
                    price_range: currentRestaurant.restaurant.price_range

                }

                // Push to the end of the restaurantData.results array.
                restaurantData.results.push(place);


            }

            // We should have all the data to render the map here.
            renderMap();

            // If MapQuest queries are turned on.
            // Need to do this to avoid maxing out the number of queries per month
            // during testing phase.
            if (DO_MAPQUEST == true) {

                for (var i = 0; i < restaurantData.getResultsLength(); i++) {
                    // Call traffic data for this location.
                    getTrafficData(restaurantData.getOriginLat(),
                        restaurantData.getOriginLon(),
                        restaurantData.getPlaceLatitude(i),
                        restaurantData.getPlaceLongitude(i));

                    // Call walking data for this location.
                    getWalkData(restaurantData.getOriginLat(),
                        restaurantData.getOriginLon(),
                        restaurantData.getPlaceLatitude(i),
                        restaurantData.getPlaceLongitude(i));
                }

            }
            else { // Generate bogus test data.
                getTestTrafficData();

                getTestWalkData();
            }

            // Indicate that restaurant data has been filled.
            restaurantData.place_data_done = true;
            console.log("**");
            console.log(restaurantData);

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
            var legs = response.route.legs;

            // Search for matching place location entry.
            for (var i = 0; i < restaurantData.getResultsLength(); i++) {
                var target_lat = Math.round(restaurantData.getPlaceLatitude(i) * 1000000);
                var target_lon = Math.round(restaurantData.getPlaceLongitude(i) * 1000000);

                if ((lat == target_lat) && (lon == target_lon)) {

                    if (restaurantData.getPlaceDriveTime(i) == -1) {
                        console.log("TRAFFIC DATA : Found at index " + i);
                        restaurantData.setPlaceDriveTime(i, drive_time);

                        // Store drive time in seconds.
                        var drive_time_s = moment(drive_time, "HH:mm:ss").diff(moment().startOf('day'), 'seconds');
                        restaurantData.setPlaceDriveTimeS(i, drive_time_s);

                        // Store the driving directions.
                        var directions_text_arr = [];
                        for (var j = 0; j < legs.length; j++) {
                            var maneuvers = legs[j].maneuvers;
                            
                            for (var k = 0; k < (maneuvers.length - 1); k++) {
                                var direction_text = maneuvers[k].narrative + " Distance : " + maneuvers[k].distance + " miles.";
                                directions_text_arr.push(direction_text);
                                //restaurantData.results[i].driving_directions.push(direction_text);
                            }
                            var direction_text = maneuvers[(maneuvers.length - 1)].narrative;
                            directions_text_arr.push(direction_text);
                            //restaurantData.results[i].driving_directions.push(direction_text);
                        }

                        restaurantData.setPlaceDrivingDirections(i, directions_text_arr);

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

                // Find the quickest commutes.
                restaurantData.markQuickest();

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
            var legs = response.route.legs;

            // Search for matching place location entry.
            for (var i = 0; i < restaurantData.getResultsLength(); i++) {
                var target_lat = Math.round(restaurantData.getPlaceLatitude(i) * 1000000);
                var target_lon = Math.round(restaurantData.getPlaceLongitude(i) * 1000000);

                if ((lat == target_lat) && (lon == target_lon)) {

                    // If the walk_time has already been filled, go to next.
                    if (restaurantData.getPlaceWalkTime(i) == -1) {
                        console.log("WALK DATA : Found at index " + i);
                        restaurantData.setPlaceWalkTime(i, walk_time);

                        // Store the time in seconds.
                        var walk_time_s = moment(walk_time, "HH:mm:ss").diff(moment().startOf('day'), 'seconds');
                        restaurantData.setPlaceWalkTimeS(i, walk_time_s);

                        // Store the driving directions.
                        var directions_text_arr = [];
                        for (var j = 0; j < legs.length; j++) {
                            var maneuvers = legs[j].maneuvers;
                            for (var k = 0; k < (maneuvers.length - 1); k++) {
                                var direction_text = maneuvers[k].narrative + " Distance : " + maneuvers[k].distance + " miles.";
                                directions_text_arr.push(direction_text);
                                //restaurantData.results[i].walking_directions.push(direction_text);
                            }
                            var direction_text = maneuvers[(maneuvers.length - 1)].narrative;
                            directions_text_arr.push(direction_text);
                            //restaurantData.results[i].walking_directions.push(direction_text);
                        }

                        restaurantData.setPlaceWalkingDirections(i, directions_text_arr);

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

                // Find the quickest commutes.
                restaurantData.markQuickest();

                // Update data to the table.
                updateTable();
            }

        }
    });
}

// Populates the table with bogus drive time data.  Used for testing only.
function getTestTrafficData() {

    // Search for matching place location entry.
    for (var i = 0; i < restaurantData.getResultsLength(); i++) {

        // Generate a random drive time.
        var drive_time_s = Math.random() * (MAX_TEST_DRIVE_TIME - MIN_TEST_DRIVE_TIME) + MIN_TEST_DRIVE_TIME;
        var drive_time = "01:" + moment(drive_time_s, "X").format("mm:ss");
        console.log(drive_time);
        restaurantData.setPlaceDriveTimeS(i, drive_time_s);
        restaurantData.setPlaceDriveTime(i, drive_time);

        // Set some bogus directions.
        var directions_text_arr = ["Bogus drive directions 1", "Bogus drive directions 2", "You are at " + restaurantData.getPlaceName(i)];
        restaurantData.setPlaceDrivingDirections(i, directions_text_arr);

        restaurantData.num_commute_data_retrieved++;

    }

    // Set the done flag if possible.
    if (restaurantData.num_commute_data_retrieved == (NUM_TRANSPORTATION_METHODS * restaurantData.results.length)) {
        restaurantData.commute_data_done = true;

        // Find the quickest commutes.
        restaurantData.markQuickest();

        // Update data to the table.
        updateTable();
    }

}

// Populates the table with bogus drive time data.  Used for testing only.
function getTestWalkData() {

    // Search for matching place location entry.
    for (var i = 0; i < restaurantData.getResultsLength(); i++) {

        // Generate a random walk time.
        var walk_time_s = Math.random() * (MAX_TEST_WALK_TIME - MIN_TEST_WALK_TIME) + MIN_TEST_WALK_TIME;
        var walk_time = "01:" + moment(walk_time_s, "X").format("mm:ss");
        console.log(walk_time);
        restaurantData.setPlaceWalkTimeS(i, walk_time_s);
        restaurantData.setPlaceWalkTime(i, walk_time);

        // Set some bogus directions.
        var directions_text_arr = ["Bogus walk directions 1", "Bogus walk directions 2", "You are at " + restaurantData.getPlaceName(i)];
        restaurantData.setPlaceWalkingDirections(i, directions_text_arr);

        restaurantData.num_commute_data_retrieved++;

    }

    // Set the done flag if possible.
    if (restaurantData.num_commute_data_retrieved == (NUM_TRANSPORTATION_METHODS * restaurantData.results.length)) {
        restaurantData.commute_data_done = true;

        // Find the quickest commutes.
        restaurantData.markQuickest();

        // Update data to the table.
        updateTable();
    }

}



