
var GWU_LAT = 38.8813513; // TODO : How do we get this?
var GWU_LON = -77.1160333; // TODO : How do we get this?
var RADIUS_METERS = 8045; // 5 miles.  TODO : How do we define this?
var ZOMATO_START = 0;
var ZOMATO_COUNT = 10;  // TODO : Take this out?

var ZOMATO_DONE = false; // Zomato query is done.
var MAPQUEST_DONE = false; // Mapquest query is done.
var TABLE_DATA = []; // Array of data objects.
var NUM_TRANSPORTATION_METHODS = 2; // The number of ways to get food : Driving + walking
var map;

// Flags for testing purposes.
var DO_MAPQUEST = false; // Run mapquest queries.  Turn this off for GUI testing.
var MIN_TEST_DRIVE_TIME = 3 * 60;
var MAX_TEST_DRIVE_TIME = 30 * 60;
var MIN_TEST_WALK_TIME = 2 * 60;
var MAX_TEST_WALK_TIME = 10 * 60;

// Object to hold our data.
var restaurantData = {
    lat: -1, // Lat/Lon of origin
    lon: -1,
    radius_meters: -1, // Search radius
    place_data_done: false,  // Do we have all the restaurant place data?
    results_start: -1, // Starting record
    results_shown: -1, // Number of records shown
    results_found: -1, // Total number of records found
    results: [],

    // Getters.
    getOriginLat: function () {
        return this.lat;
    },

    getOriginLon: function () {
        return this.lon;
    },

    getSearchRadius: function () {
        return this.radius_meters;
    },

    getResultsLength: function () {
        return this.results.length;
    },

    getPlaceName: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].name;
        }
        else {
            return null;
        }
    },

    getPlaceRating: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].rating;
        }
        else {
            return null;
        }
    },

    getPlaceVotes: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].votes;
        }
        else {
            return null;
        }
    },

    getPlaceLatitude: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].latitude;
        }
        else {
            return null;
        }
    },

    getPlaceLongitude: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].longitude;
        }
        else {
            return null;
        }
    },

    getPlaceDriveTime: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].drive_time;
        }
        else {
            return null;
        }
    },

    getPlaceWalkTime: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].walk_time;
        }
        else {
            return null;
        }
    },

    getPlaceDriveTimeS: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].drive_time_s;
        }
        else {
            return null;
        }
    },

    getPlaceWalkTimeS: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].walk_time_s;
        }
        else {
            return null;
        }
    },

    getPlaceDrivingDirections: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].driving_directions;
        }
        else {
            return null;
        }
    },

    getPlaceWalkingDirections: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].walking_directions;
        }
        else {
            return null;
        }
    },

    getPlaceIsQuickestDrive: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].is_quickest_drive;
        }
        else {
            return null;
        }
    },

    getPlaceIsQuickestWalk: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].is_quickest_walk;
        }
        else {
            return null;
        }
    },

    getPlaceCuisines: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].cuisines;
        }
        else {
            return null;
        }
    },

    getPlaceMenuURL: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].menu_url;
        }
        else {
            return null;
        }
    },

    getPlaceRatingText: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].rating_text;
        }
        else {
            return null;
        }
    },

    getPlacePriceRange: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].price_range;
        }
        else {
            return null;
        }
    },

    getPlaceTrafficDataRequest: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].traffic_data_request;
        }
        else {
            return null;
        }
    },

    getPlaceWalkDataRequest: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].walk_data_request;
        }
        else {
            return null;
        }
    },

    getPlaceTrafficDataRequestReturned: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].traffic_data_request_returned;
        }
        else {
            return null;
        }
    },

    getPlaceWalkDataRequestReturned: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].walk_data_request_returned;
        }
        else {
            return null;
        }
    },

    getPlaceIsDataValid: function (idx) {
        if (idx < this.results.length) {
            return this.results[idx].is_data_valid;
        }
        else {
            return null;
        }
    },

    // Setters.
    setOriginLat: function (x) {
        this.lat = x;
    },

    setOriginLon: function (x) {
        this.lon = x;
    },

    setSearchRadius: function (x) {
        this.radius_meters = x;
    },

    setPlaceName: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].name = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceRating: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].rating = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceVotes: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].votes = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceLatitude: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].latitude = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceLongitude: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].longitude = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceDriveTime: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].drive_time = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceWalkTime: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].walk_time = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceDriveTimeS: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].drive_time_s = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceWalkTimeS: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].walk_time_s = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceDrivingDirections: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].driving_directions = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceWalkingDirections: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].walking_directions = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceIsQuickestDrive: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].is_quickest_drive = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceIsQuickestWalk: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].is_quickest_walk = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceCuisines: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].cuisines = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceMenuURL: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].menu_url = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceRatingText: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].rating_text = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlacePriceRange: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].price_range = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceTrafficDataRequest: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].traffic_data_request = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceWalkDataRequest: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].walk_data_request = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceTrafficDataRequestReturned: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].traffic_data_request_returned = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceWalkDataRequestReturned: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].walk_data_request_returned = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    setPlaceIsDataValid: function (idx, x) {
        if (idx < this.results.length) {
            this.results[idx].is_data_valid = x;
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    },

    // Mark the quickest driving and walking destinations.
    markQuickest: function () {

        // Find the quickest commutes.
        var quickest_drive_idx = -1;
        var quickest_drive_time = -1;
        var quickest_walk_idx = -1;
        var quickest_walk_time = -1;
        for (var i = 0; i < this.getResultsLength(); i++) {
            if (this.getPlaceIsDataValid(i)) {
                if (quickest_drive_idx==-1) {
                    quickest_drive_idx = i;
                    quickest_walk_idx = i;
                    quickest_drive_time = this.getPlaceDriveTimeS(i);
                    quickest_walk_time = this.getPlaceWalkTimeS(i);
                }
                else {
                    if (this.getPlaceDriveTimeS(i) < quickest_drive_time) {
                        quickest_drive_idx = i;
                        quickest_drive_time = this.getPlaceDriveTimeS(i);
                    }

                    if (this.getPlaceWalkTimeS(i) < quickest_walk_time) {
                        quickest_walk_idx = i;
                        quickest_walk_time = this.getPlaceWalkTimeS(i);
                    }
                }
            }
        }

        // Mark the entries.
        if (quickest_drive_idx != -1) {
            this.setPlaceIsQuickestDrive(quickest_drive_idx, true);
        }
        if (quickest_walk_idx != -1) {
            this.setPlaceIsQuickestWalk(quickest_walk_idx, true);
        }
    },

    // Find the results index that has the matching traffic data request object.
    findTrafficDataRequest: function (request) {
        var match_idx = null;
        for (var i = 0; i < this.getResultsLength(); i++) {
            if (request === this.getPlaceTrafficDataRequest(i)) {
                match_idx = i;
            }
        }

        return match_idx;
    },

    // Find the results index that has the matching walk data request object.
    findWalkDataRequest: function (request) {
        var match_idx = null;
        for (var i = 0; i < this.getResultsLength(); i++) {
            if (request === this.getPlaceWalkDataRequest(i)) {
                match_idx = i;
            }
        }

        return match_idx;
    },

    // Did all traffic data requests return?
    allTrafficDataRequestsDone: function () {
        var all_done = true;
        for (var i = 0; i < this.getResultsLength(); i++) {
            if (this.getPlaceTrafficDataRequestReturned(i) == false) {
                all_done = false;
                break;
            }
        }

        return all_done;
    },

    // Did all walk data requests return?
    allWalkDataRequestsDone: function () {
        var all_done = true;
        for (var i = 0; i < this.getResultsLength(); i++) {
            if (this.getPlaceWalkDataRequestReturned(i) == false) {
                all_done = false;
                break;
            }
        }

        return all_done;
    },

    // Check validity of data and mark it.
    checkPlaceIsDataValid: function (idx) {
        if (idx < this.results.length) {
            if ((this.results[idx].drive_time != -1) &&
                (this.results[idx].walk_time != -1) &&
                (this.results[idx].drive_time_s != -1) &&
                (this.results[idx].walk_time_s != -1)) {
                this.results[idx].is_data_valid = true;
            }
            else {
                this.results[idx].is_data_valid = false;
            }
        }
        else {
            console.log("Index " + idx + " does not exist.");
        }
    }

};

