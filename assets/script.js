function buildQueryURL() {

    var baseURL = "http://api.openweathermap.org/data/2.5/weather?q=";
    var key = "&appid=6c743e42a0f9ac97fab6ec81e5e3acc9";
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
        console.log(response);
    }).catch(err => {
        // handle error here
        throw new Error(err)
    });

//example methods to do the same thing
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
