//variables
var APIkey = "jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYlb";
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
    //saveData(city,startDate,endDate);

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
                    //console.log (data);// all details
                    //console.log (data._embedded.events);// list of all events
                    //console.log (data._embedded.events[0].name);// name of the first event
                    var listOfEvents = data._embedded.events
                    console.log (listOfEvents)
                    displayRecords (listOfEvents);

                })
            }
        })
        .catch(function(error) {
            alert("Unable to connect");
        })

        //searchCity.value = ""
        //searchStartDate.value = ""
        //searchEndDate.value = ""
}

// Function to display the data 
 var displayRecords = function(listOfEvents) {
   for (i = 0; i < listOfEvents.length ; i++) {
       console.log (listOfEvents[i].name);
       console.log (listOfEvents[i].dates.start.localDate);
       console.log (listOfEvents[i].dates.start.localTime);
    }
 }
        // use a for loop to go around the array after .events and before .name

//Event listener
searchButton.addEventListener("click",getEventData);