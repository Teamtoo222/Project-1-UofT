//variables
var APIkey = "jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYl";
var searchCity = document.querySelector ("#search-city");
var searchButton = document.querySelector ("#search-button");

//var initialSampleAPI = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=CA&city=Toronto&startDateTime=2021-05-28T04:00:00Z&endDateTime=2021-05-29T04:00:00z&apikey=jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYlb"

var eventsAPI = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=CA&city=" 
                + city 
                + "&startDateTime=" 
                + startDate 
                + "T04:00:00Z&endDateTime="
                + endDate 
                +"T04:00:00z&apikey="
                + APIkey

//Function to get event's data
var getEventData = function() {
    var city = $("#search-city").val();
    event.preventDefault ();
    //saveCity(city);

    var openWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&units=metric&exclude=daily&appid="+ APIkey
    console.log (openWeatherAPI);
    fetch (openWeatherAPI)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function (details){
                    // console.log (details);// all details
                    // console.log (details.name);// name of the city 
                    // console.log (details.main.temp); //current temperature
                    // console.log (details.main.humidity);//current Humidity
                    // console.log (details.wind.speed); //current Wind Speed
                    // console.log (details.sys.country); //city's country
                    var weatherIcon = ("<img src='https://openweathermap.org/img/w/" + details.weather[0].icon + ".png' alt='" + details.weather[0].main + "' />")
                    //console.log (weatherIcon);

                    displayRecords (details.name, details.main.temp, details.main.humidity, details.wind.speed, weatherIcon);
                    getUVIndexData (details.coord.lat, details.coord.lon);
                    getFutureCityData (details.name, details.sys.country);
                })
            }
        })
        .catch(function(error) {
            alert("Unable to connect");
        })
        $("#searchCityForm").val("")
}