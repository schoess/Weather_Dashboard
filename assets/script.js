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
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function currentWeather(response) {
        //calls current weather API
        $("#cityName").text(response.name);
        $("#currentTemp").text("Temp: " + response.main.temp);
        $("#currentHumidity").text("Humidity: " + response.main.humidity);
        $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed);
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
        var oneCallURL = ocBaseURL + ocLat + ocLon + ocKey;

        $.ajax({
            url: oneCallURL,
            method: "GET"
        }).then(function oneCallWeather(response) {
            console.log(response);
            $("#uvIndex").text("UV Index: " + response.current.uvi);
            //5 day date append
            $("#d1Date").text(moment().add(1, 'days').calendar());
            $("#d2Date").text(moment().add(2, 'days').calendar());
            $("#d3Date").text(moment().add(3, 'days').calendar());
            $("#d4Date").text(moment().add(4, 'days').calendar());
            $("#d5Date").text(moment().add(5, 'days').calendar());
            //all 5 temperature appends
            $("#d1Temp").text("Temp: " + response.daily[0].temp.day);
            $("#d2Temp").text("Temp: " + response.daily[1].temp.day);
            $("#d3Temp").text("Temp: " + response.daily[2].temp.day);
            $("#d4Temp").text("Temp: " + response.daily[3].temp.day);
            $("#d5Temp").text("Temp: " + response.daily[4].temp.day);
            //all 5 humidity appends
            $("#d1Humidity").text("Humidity: " + response.daily[0].humidity);
            $("#d2Humidity").text("Humidity: " + response.daily[1].humidity);
            $("#d3Humidity").text("Humidity: " + response.daily[2].humidity);
            $("#d4Humidity").text("Humidity: " + response.daily[3].humidity);
            $("#d5Humidity").text("Humidity: " + response.daily[4].humidity);

        });
    //catches possible error and throws error code
    }).catch(err => {
        // handle error here
        throw new Error(err)
    })});


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


