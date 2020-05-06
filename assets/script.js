function buildQueryURL() {

    var baseURL = "http://api.openweathermap.org/data/2.5/weather?q=";
    var key = "&units=imperial&appid=6c743e42a0f9ac97fab6ec81e5e3acc9";
    var querySearch = $("#searchBar")
        .val()
        .trim();
    var all = baseURL + querySearch + key;
    return baseURL + querySearch + key;
};

$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var queryURL = buildQueryURL();
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        //calls current weather API
        $("#cityName").text(response.name);
        $("#currentTemp").text("Temp: " + response.main.temp);
        $("#currentHumidity").text("Humidity: " + response.main.humidity);
        $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed);
        $("#uvIndex").text("UV Index: " + response.main.temp);
        var coord = response.coord;
        //takes coordinates of city from first call and plugs them into the one-call 
        //API in order to get the 5 day forecast and the UV index
        console.log(coord.lat);
        console.log(coord.lon);

        var ocBaseURL = "http://api.openweathermap.org/data/2.5/onecall?lat=";
        var ocLat = coord.lat;
        var ocLon = "&lon=" + coord.lon;
        var ocKey = "&units=imperial&appid=6c743e42a0f9ac97fab6ec81e5e3acc9";
        console.log(ocBaseURL + ocLat + ocLon + ocKey);
        return ocBaseURL + ocLat + ocLon + ocKey;
    //catches possible error and throws error code
    }).catch(err => {
        // handle error here
        throw new Error(err)
    });

//example methods to call an API with vanilla JS and Axios
    // fetch(queryURL)
    //     .then(res => res.json())
    //     .then(resJson => {
    //         console.log(resJson)
    //     })

    // axios.get(queryURL)
    //     .then(res => {
    //         console.log(res.data)
    //     })
});

