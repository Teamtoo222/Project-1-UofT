//variables
var APIkey = "jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYl";
var searchCity = document.querySelector ("#search-city");
var searchStartDate = document.querySelector ("#search-start-date");
var searchEndDate = document.querySelector ("#search-end-date");
var searchButton = document.querySelector ("#search-button");

//var initialSampleAPI = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=CA&city=Toronto&startDateTime=2021-05-28T04:00:00Z&endDateTime=2021-05-29T04:00:00z&apikey=jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYlb"



//Function to get event's data
var getEventData = function() {
    var city = searchCity.value
    var startDate = searchStartDate.value
    var endDate = searchEndDate.value
    event.preventDefault ();
    //saveCity(city);

    var eventsAPI = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=CA&city=" 
                + city 
                + "&startDateTime=" 
                + startDate 
                + "T04:00:00Z&endDateTime="
                + endDate 
                +"T04:00:00z&apikey="
                + APIkey

    console.log (eventsAPI);

    fetch (eventsAPI)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function (data){
                    // console.log (data);// all details
                    // console.log (data._embedded.events.name);// name of the events 

                    //displayRecords (something);

                })
            }
        })
        .catch(function(error) {
            alert("Unable to connect");
        })

        searchCity.value = ""
        searchStartDate.value = ""
        searchEndDate.value = ""
}