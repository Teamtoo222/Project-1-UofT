//variables

var APIkey = "jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYlb";
var searchCity = document.querySelector ("#search-city");
var searchStartDate = document.querySelector ("#search-start-date");
var searchEndDate = document.querySelector ("#search-end-date");
var searchButton = document.querySelector ("#search-button");
var eventsOnPage = document.querySelector ("#events-on-page");
var currentDate = moment().format('YYYY-MM-DDT04:00:00[Z]');
var followingDate = moment().add(1, 'days').format('YYYY-MM-DDT04:00:00[Z]');
//var initialSampleAPI = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=CA&city=Toronto&startDateTime=2021-05-28T04:00:00Z&endDateTime=2021-05-29T04:00:00z&apikey=jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYlb"

//ALL Functions

//Function to get event's data
var getEventData = function() {
    eventsOnPage.innerHTML = ""
    event.preventDefault ();
    var city = searchCity.value
    //var startDate = searchStartDate.value + "T04:00:00Z"// in case we need a value via input
    //var endDate = searchEndDate.value + "T04:00:00Z"// in case we need a value via input
    //saveData(city,startDate,endDate);//possible local storage function if needed

    var eventsAPI = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=CA&city=" 
                + city 
                + "&startDateTime=" 
                + currentDate 
                + "&endDateTime="
                + followingDate 
                + "&apikey="
                + APIkey

    console.log (eventsAPI);

    fetch (eventsAPI)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function (data){
                    console.log (data);// all details
                    //debugger;
                    //console.log (data._embedded.events);// list of all events
                    //console.log (data._embedded.events[0].name);// name of the first event
                    if (data._embedded != undefined) {
                    var listOfEvents = data._embedded.events
                    console.log (listOfEvents)
                    displayRecords (listOfEvents);
                    } else {
                        alert ("unavailable")
                    }

                })
            }
        })
        .catch(function(error) {
            alert("Unable to connect");
        })

        searchCity.value = ""
        //searchStartDate.value = ""
        //searchEndDate.value = ""
}

// Function to display the data 
 var displayRecords = function(listOfEvents) {
   for (i = 0; i < listOfEvents.length ; i++) {
       //console.log (listOfEvents[i].name);
       //console.log (listOfEvents[i].dates.start.localDate);
       //console.log (listOfEvents[i].dates.start.localTime);

       var eventName = listOfEvents[i].name
       var eventLocalDate = listOfEvents[i].dates.start.localDate
       var eventLocalTime = listOfEvents[i].dates.start.localTime

       //var divElements = document.createElement ("div")  
       var ul = document.createElement ("ul")
       var li = document.createElement ("li")


       li.innerHTML = eventName + ", " + eventLocalDate + ", " + eventLocalTime
       //console.log (li)
       ul.appendChild (li);
       //console.log (ul)
       eventsOnPage.appendChild (ul);
       //console.log (eventsOnPage)
       //debugger;
       
    }
 }

//Event listener
searchButton.addEventListener("click",getEventData);