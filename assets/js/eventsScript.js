//General variables

var APIkey = "jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYlb";
var searchCity = document.querySelector ("#search-city");
var searchStartDate = document.querySelector ("#search-start-date");
var searchEndDate = document.querySelector ("#search-end-date");
var searchButton = document.querySelector ("#search-button");
var selectedOption = document.getElementById("selectOption").value;

// added the form id 
var searchForm = document.querySelector("#searchForm");
var currentDate = moment().format('YYYY-MM-DDT08:00:00[Z]');
var followingDate = moment().add(7, 'days').format('YYYY-MM-DDT07:59:00[Z]');
var localArray = []
var savedEventsArray = []

//Variables for display cards
var eventName = document.querySelector ("#event-name");
var eventTime = document.querySelector ("#event-time");
var eventURL = document.querySelector ("#event-url");
var eventDetails = document.querySelector ("#event-details");
var detailsContainer = document.querySelector ("#details-container");
var imgContainer = document.querySelector ("#img-container");
var eventContainer = document.querySelector ("#event-container");
var eventCardsContainer = document.querySelector ("#event-cards-container");
var nearbyEventsSection = document.querySelector ("#nearby-events-section");
var showMoreEventsBtn = document.querySelector ("#show-events");

// Variables for i
iStartEvents = 0;
iEndEvents = 4;

var listOfEvents = [];

//var initialSampleAPI = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=CA&city=Toronto&startDateTime=2021-05-28T04:00:00Z&endDateTime=2021-05-29T04:00:00z&apikey=jYz6ksJAF3WA0eHLAKxbYjp1ZIU0zYlb"



//ALL Functions

//Function to get event's data
var getEventData = function(lat, lng, searchCity) {
    savedEventsArray = [];
    eventCardsContainer.innerHTML = ""
    // showMoreEvents.innerHTML =""
    // event.preventDefault ();

    var city = searchCity.value;
    localStorage.setItem("cityUsed", JSON.stringify(city));


        var eventsAPI = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=CA&size=20&sort=date,asc&latlong=" 
                    + lat + "," + lng 
                    + "&startDateTime=" 
                    + currentDate 
                    + "&endDateTime="
                    + followingDate 
                    +"&radius=100"
                    + "&unit=km"
                    + "&apikey="
                    + APIkey

        console.log (eventsAPI);

        fetch (eventsAPI)
            .then(function(response) {
                if (response.ok) {
                    response.json().then(function (data){
                        // console.log (data);// all details
                        //console.log (data._embedded.events);// list of all events
                        //console.log (data._embedded.events[0].name);// name of the first event
                        if (data._embedded != undefined || data._embedded != null || city.value != null) {
                        var listOfEvents = data._embedded.events
                        // console.log (listOfEvents)
                        display5Records (listOfEvents);
                        localStorage.setItem("eventsData", JSON.stringify(listOfEvents));
                        } else {
                            //alert ("unavailable")
                            //div event-container
                            noEventsDsoplay();
                            
                        }

                    })
                }
            })
            .catch(function(error) {
                alert("Unable to connect");
        });

        listOfEvents = [];

        document.getElementById("sub-events").textContent = searchCity;
            //searchCity.value = city
}

var noEventsDsoplay = function() {
    var divEventsContainer = document.createElement ("div");
    divEventsContainer.className = "event-container column card p-0";
    divEventsContainer.id = "event-container";

    //div details-container
    var divDetailsContainer = document.createElement ("div");
    divDetailsContainer.className = "details-container";
    divDetailsContainer.id = "details-container";

    //div event-details
    var divEventDetails = document.createElement ("div");
    divEventDetails.className = "store-details is-flex";
    divEventDetails.id = "event-details";

    //p for Alert for nothing available
    var pnothing = document.createElement ("p");
    pnothing.className = "is-size-3 has-text-centered";
    pnothing.id = "event-name";
    pnothing.innerHTML = "<strong> Nothing is Available </strong>"


    //appending information
    divEventDetails.appendChild (pnothing);
    divDetailsContainer.appendChild (divEventDetails);
    divEventsContainer.appendChild (divDetailsContainer);
    eventCardsContainer.appendChild (divEventsContainer);
};

// Function to display the initial 5 data 
var display5Records = function(listOfEvents) {
    
    if(listOfEvents.length < iEnd) {
        iEnd = listOfEvents.length;
    }

   for (i = iStart; i < iEnd ; i++) {

    // Set i besed on the length
    if(listOfEvents.length < iEnd) {
        iEnd = listOfEvents.length;
        $('#show-events').addClass("hideEl");
        return;
    }

       // var from array from API
       var eventName = listOfEvents[i].name;
       var img = listOfEvents[i].images[7].url;
       //console.log(img);
       var eventLocalTime = listOfEvents[i].dates.start.localTime;
       var eventUrl = listOfEvents[i].url;
       //var eventLocalDate = listOfEvents[i].dates.start.localDate // variable to add the local time found in the array if needed

       //div event-container
       var divEventsContainer = document.createElement ("div");
       divEventsContainer.className = "event-container column card p-0";
       divEventsContainer.id = "event-container";
       divEventsContainer.innerHTML = 
       "<div class='img-container' style = 'background-image: url("+img+")' id = 'img-container'>"+
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
       pEventName.classList = "name height-40";
       pEventName.id = "event-name";
       pEventName.innerHTML = "<strong>" + eventName + "</strong>"

       //p for event time
       var pEventTime = document.createElement ("p");
       pEVentDate = document.createElement("p");
       pEVentDate.innerHTML = `Start Date: ${listOfEvents[i].dates.start.localDate}`
       pEventTime.className = "time";
       pEventTime.id = "event-time";
       pEventTime.innerHTML = `Start Time: ${eventLocalTime}`  

       //p for event url
       var pEventULR = document.createElement ("p");
       pEventULR.className = "url";
       pEventULR.id = "event-url";
       pEventULR.innerHTML = "<a href =" + eventUrl + " >Details </a>"

       //appending information
       divEventDetails.appendChild (pEventName);
       divEventDetails.appendChild (pEVentDate);
       divEventDetails.appendChild (pEventTime);
       divEventDetails.appendChild (pEventULR);
       divDetailsContainer.appendChild (divEventDetails);
       divEventsContainer.appendChild (divDetailsContainer);
       eventCardsContainer.appendChild (divEventsContainer);
             
    }

    // $("#show-events").click(function() {
    //     iStartEvents += 4;
    //     iEndEvents += 4;
        
    //     display5Records(listOfEvents);
        
    //     })

    //Showmore button  

    // var showMoreEventsBtn = document.createElement ("button");
    // showMoreEventsBtn.className = "button is-medium is-danger is-light show-more-button is-flex mt-5";
    // showMoreEventsBtn.id = "show-more-events-btn"
    // showMoreEventsBtn.innerHTML = "Show More"

    // showMoreEvents.appendChild (showMoreEventsBtn)


  
    //loadEventsData();
};


// Show more news
document.querySelector('#show-events').addEventListener('click', () => {
    var loadedData = JSON.parse(localStorage.getItem("eventsData"));
    listOfEvents = loadedData;

    iStart += 4;
    iEnd += 4;
  // run the passNearByData function
  display5Records(listOfEvents);
  
  });
  





var loadEvents = function() {
    var loadedData = JSON.parse(localStorage.getItem("eventsData"));
    var loadedType = JSON.parse(localStorage.getItem("type"));
    var loadedCities = JSON.parse(localStorage.getItem("searchCities"));

    if(!loadedData || loadedType !== "Events" || !loadedCities) {
      return;
    } else {
        listOfEvents = loadedData;
        document.getElementById("sub-events").textContent = loadedCities[loadedCities.length-1];
    }

    if(listOfEvents.length === 0) {
        noEventsDsoplay();
    } else {
        // console.log(listOfEvents);
        display5Records(listOfEvents);
    } 
};


// // Function to display the initial remaining data 
// var displayAllRecords = function(listOfEvents) {
//     if(listOfEvents.length < iEnd) {
//         iEnd = listOfEvents.length;
//         showMoreEventsBtn.classList.add('hideEl');
//     }

       
// }

loadEvents();