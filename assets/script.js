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
        $("#cityName").text(response.name + " " + moment().format('l'));
        $("#currentTemp").text("Temp: " + response.main.temp + " °F");
        $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
        $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
        var coord = response.coord;
        //takes coordinates of city from first call and plugs them into the one-call 
        //API in order to get the 5 day forecast and the UV index
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

            var weatherIcon = "";
            var conditions = response.current.weather.main;

            

            if (conditions === "Clear") {
                weatherIcon = $("<img class='icon' src='assets/images/iconfinder_weather_sun_sunny_hot_5719151.png>'");
            } else if (conditions === "Clouds" && response.current.clouds <= 50) {
                weatherIcon = $("<img class='icon' src='assets/images/iconfinder_weather_sun_sunny_cloud_5719152.png>'");
            } else if (conditions === "Clouds" && response.current.clouds > 50) {
                weatherIcon = $("<img class='icon' src='assets/images/iconfinder_weather_cloud_cloudy_5719165.png'>");
            }

            $("#cityName").append(weatherIcon);
            //changes color around UV Index based on how high or low it is
            var uvi = response.current.uvi
            if (uvi <= 3) {
                $("#uvIndex").addClass("blueBox").removeClass("yellowBox").removeClass("redBox");
            } else if (uvi > 3 && uvi < 7) {
                $("#uvIndex").addClass("yellowBox").removeClass("redBox").removeClass("blueBox");
            } else if (uvi >= 7) {
                $("#uvIndex").addClass("redBox").removeClass("yellowBox").removeClass("blueBox");
            }
            //appends uvi to page
            $("#uvIndex").text(response.current.uvi);

        
            //5 day date append
            $("#d1Date").text(moment().add(1, 'days').format("l"));
            $("#d2Date").text(moment().add(2, 'days').format("l"));
            $("#d3Date").text(moment().add(3, 'days').format("l"));
            $("#d4Date").text(moment().add(4, 'days').format("l"));
            $("#d5Date").text(moment().add(5, 'days').format("l"));
            //all 5 temperature appends
            $("#d1Temp").text("Temp: " + response.daily[1].temp.day + " °F");
            $("#d2Temp").text("Temp: " + response.daily[2].temp.day + " °F");
            $("#d3Temp").text("Temp: " + response.daily[3].temp.day + " °F");
            $("#d4Temp").text("Temp: " + response.daily[4].temp.day + " °F");
            $("#d5Temp").text("Temp: " + response.daily[5].temp.day + " °F");
            //all 5 humidity appends
            $("#d1Humidity").text("Humidity: " + response.daily[1].humidity + "%");
            $("#d2Humidity").text("Humidity: " + response.daily[2].humidity + "%");
            $("#d3Humidity").text("Humidity: " + response.daily[3].humidity + "%");
            $("#d4Humidity").text("Humidity: " + response.daily[4].humidity + "%");
            $("#d5Humidity").text("Humidity: " + response.daily[5].humidity + "%");

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


