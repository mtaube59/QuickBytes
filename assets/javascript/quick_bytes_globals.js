
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
// Object to hold our data.
var restaurantData = {
    lat: -1, // Lat/Lon of origin
    lon: -1,
    radius_meters: -1, // Search radius
    place_data_done: false,  // Do we have all the restaurant place data?
    commute_data_done: false, // Do we have all the commute data?
    num_commute_data_retrieved: -1, // Number of commute data calls retrieved.
    results_start: -1, // Starting record
    results_shown: -1, // Number of records shown
    results_found: -1, // Total number of records found
    results: []
};