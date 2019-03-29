
$(document).ready(function () {

    var GWU_LAT = 38.8813513; // TODO : How do we get this?
    var GWU_LON = -77.1160333; // TODO : How do we get this?
    var TEST_LAT = 38.8824916811; // To Zoe's kitchen
    var TEST_LON = -77.1124862798;

    var queryURL = "http://www.mapquestapi.com/directions/v2/route?" +
        "key=" + MAPQUEST_API_KEY +
        "&from=" + GWU_LAT + "," + GWU_LON +
        "&to=" + TEST_LAT + "," + TEST_LON;

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        dataType: 'json',
        async: true,
        /*
        beforeSend: function (xhr) {
            xhr.setRequestHeader('user-key',
                API_KEY);
        },  // This inserts the api key into the HTTP header
        */
        success: function (response) {
            console.log(response);
        }
    });

})