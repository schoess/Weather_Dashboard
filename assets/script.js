//empty var to store city searches in
var cityArr = [];
//stores city
function storeCity() {
    var cityName = $("#searchBar").val();
    cityArr.push(cityName);
    localStorage.setItem("city", JSON.stringify(cityArr));
    displayCity();
}
//Displays local storage
function displayCity() {
    if (localStorage.getItem("city") !== null) {
        displayCities = JSON.parse(localStorage.getItem("city"));
        $("#recentSearch").empty();
        displayCities.forEach(function(displayCity) {
        $("#recentSearch").prepend("<li class='list-group-item'>" + displayCity + "</li>");
    })}
};
// On page load, displays cities from local storage that have previously been searched
window.onload = displayCity();
//Determines which icon is displayed next to the city name 
function conditionsIcon(response) {
    var weatherIcon = "";
    var clouds = response.current.clouds;
    var conditions = response.current.weather.main

    if (clouds < 30) {
        weatherIcon = $("<img class='icon' src='assets/images/iconfinder_weather_sun_sunny_hot_5719151.png'>");
    } else if (clouds >= 30 && clouds <= 70) {
        weatherIcon = $("<img class='icon' src='assets/images/iconfinder_weather_sun_sunny_cloud_5719152.png'>");
    } else if (clouds > 70) {
        weatherIcon = $("<img class='icon' src='assets/images/iconfinder_weather_cloud_cloudy_5719165.png'>");
    } else if (conditions === "Drizzle" || conditions === "Rain") {
        weatherIcon = $("<img class='icon' src='iconfinder_weather_heavy_rain_cloud_5719160.png'>");
    }   else if (conditions === "Snow") {
        weatherIcon = $("<img class='icon' src='iconfinder_weather_winter_cold_5719150.png'>");
    }   else if (conditions === "Thunderstorm") {
        weatherIcon = $("<img class='icon' src='iconfinder_weather_heavy_rain_thunder_storm_5719159.png'>");
    };
    //appends icon to page after weather is determined
    $("#cityName").append(weatherIcon);
};

//builds url for first API call
function buildQueryURL() {

    var baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
    var key = "&units=imperial&appid=6c743e42a0f9ac97fab6ec81e5e3acc9";
    var querySearch = $("#searchBar")
        .val()
        .trim();
    var all = baseURL + querySearch + key;
    return baseURL + querySearch + key;
};

//on button click, calls current weather API and sets user input city name to local storage
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    //calls function to set city to local storage
    storeCity();
    //calls current weather API
    var queryURL = buildQueryURL();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function currentWeather(response) {
        //appends current weather data in approperiate spaces
        $("#cityName").text(response.name + " " + moment().format('l'));
        $("#currentTemp").text("Temp: " + response.main.temp + " °F");
        $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
        $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
        var coord = response.coord;
        //takes coordinates of city from first call and plugs them into the one-call 
        //API in order to get the 5 day forecast and the UV index
        var ocBaseURL = "https://api.openweathermap.org/data/2.5/onecall?lat=";
        var ocLat = coord.lat;
        var ocLon = "&lon=" + coord.lon;
        var ocKey = "&units=imperial&appid=6c743e42a0f9ac97fab6ec81e5e3acc9";
        var oneCallURL = ocBaseURL + ocLat + ocLon + ocKey;
//Calls the One-Call Weather API
        $.ajax({
            url: oneCallURL,
            method: "GET"
        }).then(function oneCallWeather(response) {
            console.log(response);
            conditionsIcon(response);

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

//Began trying to automate what is currently working
            // $("#forecast").each(function () {
            //     var i = 1
            //     $(this).text(moment().add(i, 'days').format("l"));
            //     var iconurl = ;
            //     $(this).attr("src", iconurl);
            //     $(this).text("Temp: " + response.daily[1].temp.day + " °F");
            //     $(this).text("Humidity: " + response.daily[1].humidity + "%");
            //     i++;
            // });


            //5 day date append
            $("#d1Date").text(moment().add(1, 'days').format("l"));
            $("#d2Date").text(moment().add(2, 'days').format("l"));
            $("#d3Date").text(moment().add(3, 'days').format("l"));
            $("#d4Date").text(moment().add(4, 'days').format("l"));
            $("#d5Date").text(moment().add(5, 'days').format("l"));

            
            // var oneCallResponse = response.daily[i]; APPENDS SYMBOL
            $("#d1Date").append("<img src='" + "http://openweathermap.org/img/w/" + response.daily[0].weather[0].icon + ".png'>");
            $("#d2Date").append("<img src='" + "http://openweathermap.org/img/w/" + response.daily[1].weather[0].icon + ".png'>");
            $("#d3Date").append("<img src='" + "http://openweathermap.org/img/w/" + response.daily[2].weather[0].icon + ".png'>");
            $("#d4Date").append("<img src='" + "http://openweathermap.org/img/w/" + response.daily[3].weather[0].icon + ".png'>");
            $("#d5Date").append("<img src='" + "http://openweathermap.org/img/w/" + response.daily[4].weather[0].icon + ".png'>");
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


