//General variables

var APIkey = "jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYlb";
var searchCity = document.querySelector ("#search-city");
var searchStartDate = document.querySelector ("#search-start-date");
var searchEndDate = document.querySelector ("#search-end-date");
var searchButton = document.querySelector ("#search-button");
var eventsOnPage = document.querySelector ("#events-on-page");
var currentDate = moment().format('YYYY-MM-DDT04:00:00[Z]');
var followingDate = moment().add(1, 'days').format('YYYY-MM-DDT04:00:00[Z]');

//Variables for display cards
var eventName = document.querySelector ("#event-name");
var eventTime = document.querySelector ("#event-time");
var eventURL = document.querySelector ("#event-url");
var eventDetails = document.querySelector ("#event-details");
var detailsContainer = document.querySelector ("#details-container");
var imgContainer = document.querySelector ("#img-container");
var eventContainer = document.querySelector ("#event-container");
var eventCardsContainer = document.querySelector ("#event-cards-container");

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

       // var from array from API
       var eventName = listOfEvents[i].name;
       var eventLocalTime = listOfEvents[i].dates.start.localTime;
       var eventUrl = listOfEvents[i].url;
       //var eventLocalDate = listOfEvents[i].dates.start.localDate // variable to add the local time found in the array if needed

       //div event-container
       var divEventsContainer = document.createElement ("div");
       divEventsContainer.className = "event-container column card p-0";
       divEventsContainer.id = "event-container";
       divEventsContainer.innerHTML = 
       "<div class='img-container'id = 'img-container'>" + 
       "<div class='store-status is-flex is-justify-content-flex-end'>" +
       "</div>" +
       "</div>";

       //div details-container
       var divDetailsContainer = document.createElement ("div");
       divDetailsContainer.className = "details-container";
       divDetailsContainer.id = "details-container";

       //div event-details
       var divEventDetails = document.createElement ("div");
       divEventDetails.className = "store-details is-flex";
       divEventDetails.id = "event-details";

       //p for event name
       var pEventName = document.createElement ("p");
       pEventName.className = "name";
       pEventName.id = "event-name";
       pEventName.innerHTML = "<strong>" + eventName + "</strong>"

       //p for event time
       var pEventTime = document.createElement ("p");
       pEventTime.className = "time";
       pEventTime.id = "event-time";
       pEventTime.innerHTML = eventLocalTime 

       //p for event url
       var pEventULR = document.createElement ("p");
       pEventULR.className = "url";
       pEventULR.id = "event-url";
       pEventULR.innerHTML = "<a href =" + eventUrl + " >Details </a>"


       //appending information
       divEventDetails.appendChild (pEventName);
       divEventDetails.appendChild (pEventTime);
       divEventDetails.appendChild (pEventULR);
       divDetailsContainer.appendChild (divEventDetails);
       divEventsContainer.appendChild (divDetailsContainer);
       eventCardsContainer.appendChild (divEventsContainer);

       
       // old div to display things 
        // var ul = document.createElement ("ul");
        //var li = document.createElement ("li");
        //li.innerHTML = eventName + ", " + ", " + eventLocalTime;
        //ul.appendChild (li);
       //eventsOnPage.appendChild (ul);
       //debugger;
       
    }
 }

//Event listener
searchButton.addEventListener("click",getEventData);