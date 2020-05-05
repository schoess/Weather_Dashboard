function buildQueryURL() {

    var baseURL = "http://api.openweathermap.org/data/2.5/weather?q=";
    var key = "&appid=6c743e42a0f9ac97fab6ec81e5e3acc9";
    var querySearch = $("#searchBar")
        .val()
        .trim();

    return baseURL + querySearch + key;
    
};
$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var queryURL = buildQueryURL();

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(console.log());
});
