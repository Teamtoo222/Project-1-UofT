// Variables
var searchForm = document.getElementById('searchForm');
var submitForm = document.getElementById ("#submit-form")

var cityInput = "";
var keywordInput = "";
var googleApiKey = 'AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs';
var googleGeoCodeUrl =
  'https://maps.googleapis.com/maps/api/geocode/json?address=' +
  cityInput +
  '&key=' +
  googleApiKey;

var originLoc = "";
var originLat = "";
var originLng = "";
var desLatResult = "";
var desLngResult = "";
var distanceValue = "";
var distanceTime = "";

var placeIdArray = [];
var placeArray = []
var searchedCities = [];
var errorModal =  document.getElementById("error-Modal");

let iStart = 0;
let iEnd = 4;
let typeOf = 'restaurant';
var targetId = '#nearby-resturants';
var mainCont = document.getElementById("mainContainer");
var heroContainer = document.getElementById("heroContainer");
var covidContainer = document.getElementById("covidContainer");
var eventsContainer = document.getElementById("nearby-events-section");
var restaurantsContainer = document.getElementById("restaurantsContainer");
var recreationContainer = document.getElementById("recreationContainer");

// type = 'tourist_attraction';
// targetId = '#nearby-recreation';

// Variable to get the PLaceServiceMap
var service = new google.maps.places.PlacesService(document.getElementById('map'));
// const geocoder = new google.maps.Geocoder();
var distanceService = new google.maps.DistanceMatrixService();
var searchInput = document.getElementById('search-city');
var options = {
  componentRestrictions: { country: "CA" },
  types: ["geocode"]
};

// Variable to have the automcomplete for geocodes
const autoComplete = new google.maps.places.Autocomplete(searchInput, options);
autoComplete.getPlace();


// submit form event listner
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();

  var selectedOption = document.getElementById("selectOption").value;
  cityInput = document.getElementById('search-city').value;
  keywordInput = document.getElementById('keywordInput').value;

  // Check if the city is empty and show the error msg
  if(!cityInput) {
    errorModal.classList.remove("hideMsg");
    errorModal.classList.add("showMsg")
  } else {
    mainCont.style.display = "block";
    document.getElementById("error-Modal").classList.add("hideMsg");
    errorModal.classList.remove("showMsg");
    googleGeoCodeUrl =
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    cityInput +
    '&key=' +
    googleApiKey;

    // value when running the 1st time
    iStart = 0;
    iEnd = 4;

    //document.getElementById("mainContainer").innerHTML = "";
    heroContainer.classList.remove("hero-def-height");
    mainCont.classList.add("p-2", "main-container");
    
    if(selectedOption === "Events") {
      apiGeoCodeFetch(googleGeoCodeUrl, selectedOption);
      eventsDisplay();
      getEventData();

      
    } else if (selectedOption === "Restaurants") { 
      restaurantsDisplay();
      document.getElementById("nearby-resturants").innerHTML = "";
      document.getElementById("resLocation").textContent = cityInput;
      apiGeoCodeFetch(googleGeoCodeUrl, selectedOption, cityInput);
    } else if (selectedOption === "Recreations") {
      type = 'tourist_attraction';
      targetId = '#nearby-recreation';
      recreationsDsiplay();
      document.getElementById("nearby-recreation").innerHTML = "";
      document.getElementById("recLocation").textContent = cityInput;
      apiGeoCodeFetch(googleGeoCodeUrl, selectedOption, cityInput);
    }

    localStorage.setItem("type", JSON.stringify(selectedOption));

    searchForm.reset();
    // document.querySelector("#keywordInput").value = "";

  }

  //store the cities 
  searchedCities.push(cityInput);
  localStorage.setItem("searchCities", JSON.stringify(searchedCities));

});

// Function to display/hide the Events
var eventsDisplay = function() {
  covidContainer.classList.remove("hideEl");
  covidContainer.classList.add("showEl");
  recreationContainer.classList.add("hideEl");
  recreationContainer.classList.remove("columns");
  eventsContainer.classList.remove("hideEl");
  eventsContainer.classList.add("columns");
  eventsContainer.classList.add("showEl");
  restaurantsContainer.classList.add("hideEl");
  restaurantsContainer.classList.remove("columns");
};

// Function to display/hide the restaurants
var restaurantsDisplay = function() {
  eventsContainer.classList.add("hideEl");
  eventsContainer.classList.remove("columns");
  covidContainer.classList.remove("hideEl");
  covidContainer.classList.add("showEl");
  recreationContainer.classList.add("hideEl");
  recreationContainer.classList.remove("columns");
  restaurantsContainer.classList.remove("hideEl");
  restaurantsContainer.classList.add("columns");
};

// Funtion to display/hide the recreations
var recreationsDsiplay = function() {
  eventsContainer.classList.add("hideEl");
  eventsContainer.classList.remove("columns");
  restaurantsContainer.classList.add("hideEl");
  restaurantsContainer.classList.remove("columns");
  covidContainer.classList.remove("hideEl");
  covidContainer.classList.add("showEl");
  recreationContainer.classList.remove("hideEl");
  recreationContainer.classList.add("columns");
};


// Fetch the geocoordinates google data
var apiGeoCodeFetch = function (url, option, searchCity) {
  fetch(url).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if(option === "Events") {
          covidLoc(data);
        } else {
          covidLoc(data);
          logResPlaceDetails(data, option, searchCity);
          // console.log(searchCity);
        }
      });
    }
  });
};

// Function to pull the nearby the restaurants
function logResPlaceDetails(passedData, typeOf, searchCity) {
  originLat = passedData.results[0].geometry.location.lat;
  originLng = passedData.results[0].geometry.location.lng;

  originLoc = { lat: originLat, lng: originLng };

  localStorage.setItem("originLoc" ,JSON.stringify(originLoc));
  //console.log(passedData , latData, lngData);
  // Nearby Search method, https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.nearbySearch
  service.nearbySearch(
    {
      // City/Location in lat and lng
      location: { lat: originLat, lng: originLng },
      // radius for the search list
      radius: 15000,
      // Specific keywords
      keyword: keywordInput,
      // Type or option for the result Restaurants or Recreations
      type: typeOf,
    },
    function (place, status) {
      
      var placeIdArray = [];
      var resSearchedCities = [];

      resSearchedCities.push(searchCity);

      for(var i = 0; i < place.length; i++) {
        placeIdArray.push(place[i].place_id);
      }
      // placeId = 
      // placeArray = place;

      // save the data to local storage
      localStorage.setItem("resData", JSON.stringify(placeIdArray));
      // localStorage.setItem("restSearchCities", JSON.stringify(resSearchedCities));
      
      
      // load the Resdata
      loadResData();
    }
  );
};

// var getDistance = function(desLat, desLng) {
//   console.log(desLatResult);
//   console.log(desLngResult);
//   console.log(originLat);
//   console.log(originLng);

//   fetch(
//     "https://maps.googleapis.com/maps/api/distancematrix/json?origins=heading=" + originLat + "," + originLng +"&destinations=side_of_road:" + desLat + "," + desLng + "&key=" + googleApiKey)
//     .then(function (response) {
//       if (response.ok) {
//         response.json()
//         .then(function (data) {
//           console.log(data);
//       })
//     };
//   });
// };

// Function to load the load the Restaurant and Recreations
var loadResData = function() {
  var loadedResData = JSON.parse(localStorage.getItem("resData"));
  // var loadedEventsData = JSON.parse(localStorage.getItem("eventsData"));
  var loadedType = JSON.parse(localStorage.getItem("type"));
  var loadedCities = JSON.parse(localStorage.getItem("searchCities"));
  var loadedOriginLoc = JSON.parse(localStorage.getItem("originLoc"));

  originLoc = loadedOriginLoc;

  if (loadedType === "Events") {
    eventsDisplay();
    return;
  } else if(loadedType === "Restaurants") {
    targetId = "#nearby-resturants";
    restaurantsDisplay();
    document.getElementById("resLocation").textContent = loadedCities[0];

  } else if (loadedType === "Recreations") {
    targetId = "#nearby-recreation";
    recreationsDsiplay();
    document.getElementById("recLocation").textContent = loadedCities[0];
    
  }

  // if the loaded data is empty hide all the elements
  if(!loadedResData) {
    eventsContainer.classList.add("hideEl");
    restaurantsContainer.classList.add("hideEl");
    recreationContainer.classList.add("hideEl");
    return;

  } else {
    placeArray = loadedResData;
    passNearByData(placeArray ,targetId, loadedOriginLoc);
  }
};

// Function to pass the nearByData
var passNearByData = function (place ,typeId, oriLoc) {
  if (place) {
    for (let i = iStart; i < iEnd; i++) {
      // Get details method, check this link for more info https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.getDetails
      if (place[i]) {
        // console.log(place[i]);
        service.getDetails(
          {
            placeId: place[i],
          },
          function (getResults, status) {
            if (getResults) {
              console.log('rec details **** :', getResults);
              desLatResult = getResults.geometry.location.lat();
              desLngResult = getResults.geometry.location.lng();
            
              checkDistance(getResults,typeId, desLatResult, desLngResult);
            }
          }
        );
        
      }
    }
  }
}

var createCards = function(place ,targetId, val, time) {
  if(place.hasOwnProperty("opening_hours")) {
    const isOpen = place.opening_hours.isOpen();
    if (isOpen === true) {
      var openStatus = "Open Now";
    } else {
      openStatus = "Closed Now";
    }  
  } else {
    openStatus = "Please Call ";
  }

  // Check to see if the business is operational
  if(place.business_status === "OPERATIONAL") {
    var businesStatus = "Operational";
    var busClassList = "busStatus bg-green";
    // document.querySelector(".busStatus").style.background = "green";
  } else if (place.business_status === "CLOSED_TEMPORARILY") {
    businesStatus = "Temporarily closed";
    busClassList = "busStatus bg-red";
  } else {
    businesStatus = "Permanently closed";
    busClassList = "busStatus bg-red";
  }

  //check if the array has an image 
  if(place.hasOwnProperty("photos")) {
    var photoUrl = place.photos[0].getUrl();
  } else {
    photoUrl = "https://picsum.photos/640/320/?blur=8";
  }

  // check if the array has a rating
  if(place.hasOwnProperty("rating")) {
    var placeRating = place.rating;
  } else {
    placeRating = "N/A";
  }

  // check if the array has a phone number
  if(place.hasOwnProperty("formatted_phone_number")) {
    var placePhone = place.formatted_phone_number;
  } else {
    placePhone = "Not Available";
  }

  // getDistance(desLatResult, desLngResult);

  // console.log(place.geometry.location.lng());

  // template to create the card
  const template = `
    <a class="linkImage" href=${place.url} target="_blank">
    <div class="img-container" style="background-image:url(${photoUrl});">
    <div class="store-status is-flex is-align-items-flex-end is-flex-direction-column">
    <div class="w-100 is-flex is-justify-content-space-between">
    <p class="ratingNumb"><i class="ratingNumbIcon fas fa-star-half-alt"></i>&nbsp${placeRating}</p>
    <p class="mb-2 open-status">${openStatus}</p>
    </div>
    <p class="${busClassList}">${businesStatus}</p>
    </div>
    </div>
    </a>
    <div class="details-container">
    <div class="store-details is-flex">
    <p class="store-name wrap-content"><i class="fas fa-bars"></i>&nbsp<strong>${place.name}</strong></p>
      <a class="wrap-content" href="https://maps.google.com/maps?q=${place.formatted_address}" target="_blank class="store-address"><i class="fas fa-map-marker-alt">&nbsp</i>${place.formatted_address}</a>
      <a href="tel:${place.formatted_phone_number}" class="store-phone"><i class="fas fa-phone-alt"></i>&nbsp${placePhone}</a>
      <a href="${place.website}" target="_blank"><i class="fas fa-globe"></i>&nbsp Website</a> 
      <p> <i class="fas fa-car-side"></i> &nbsp ${val} | ${time} </p>
      </div>
      </div>
      `;
    
  // Create and append the card
    const container = document.createElement('div');
    container.classList = "event-container column card p-0";
    container.innerHTML = template;
    document.querySelector(targetId).append(container);

};


var checkDistance = function(results,typeId, deslat, desLng) {
  var desLoc = { lat: deslat, lng: desLng }


   const distance = new google.maps.DistanceMatrixService();
        distance.getDistanceMatrix(
        {
          origins: [originLoc],
          destinations: [desLoc],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        (response, status) => {
          if (status !== "OK") {
            alert("Error was: " + status);
          } else {
            var disVal = response.rows[0].elements[0].distance.text;
            var disTime = response.rows[0].elements[0].duration.text;

            createCards(results ,typeId, disVal, disTime);
          }
        });
};


// // Fcuntion to check the business status
// var busStatChecker = function() {
// // Change the background color of busStats
//   var busStatEl = document.querySelectorAll(".busStatus");

//   for (var i = 0; i < busStatEl.length; i++) {
//     if(busStatEl[i] === "Operational") {
//       var statEl =  document.querySelector(".busStatus");
//       statEl.classList.remove("bg-red");
//       statEl.classList.add("bg-green");
//     }
//   }
// };



document.querySelector('#show-res').addEventListener('click', () => {
  iStart += 4;
  iEnd += 4;
// run the passNearByData function
  passNearByData(placeArray, targetId);
});


document.querySelector('#show-rec').addEventListener('click', () => {
  iStart += 4;
  iEnd += 4;
// run the passNearByData function
  passNearByData(placeArray, targetId);
});

loadResData();

/**
 * ////////////// COVID SECTION ///////////////
 */

// Covid Function
var currentDay = moment().subtract(1, 'day').format('DD-MM-YYYY');
// var province = "ON";

var covidLoc = function(data) {
  var addressData = data.results[0].address_components;
  var province = "";
  if(addressData.length === 8) {
    province = addressData[addressData.length - 3].short_name;
  } else {
    province = addressData[addressData.length - 2].short_name;
  }
  var covidUrl = "https://api.opencovid.ca/summary?loc=" + province + "&date=" + currentDay;

  covidData(covidUrl);
} 

// Array for Covid
var covidArray = [];

// Fetch the covid data
var covidData = function (covidUrl) {
  fetch(covidUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // pass the covid data
        saveCovidData(data);
        displayCovidStats(data);
      });
    }
  });
};
// Function to SaveCovidData
var saveCovidData = function(data) {
  localStorage.setItem("covidData", JSON.stringify(data));
};

// Function to LoadCovidFunction
var loadCovidData = function() {
  loadedData = JSON.parse(localStorage.getItem("covidData"));

  if(!loadedData) {
    return;
  } else {
    covidArray = loadedData;

  // console.log("this is the returned array", covidArray);
  displayCovidStats(covidArray);
  }
  
};

// Define the covid related DOM elements
var totalCases = document.querySelector("#totalCases");
var totalDeaths = document.querySelector("#totalDeaths");
var totalRecovered = document.querySelector("#totalRecovered");
var totalTests = document.querySelector("#totalTests");
var totalActive = document.querySelector("#totalActive");
var totalVaccine = document.querySelector("#totalVaccine");
var todayCases = document.querySelector("#todayCases");
var todayDeaths = document.querySelector("#todayDeaths");
var todayRecovered = document.querySelector("#todayRecovered");
var todayTests = document.querySelector("#todayTests");
var todayChange = document.querySelector("#todayChange");
var todayVaccine = document.querySelector("#todayVaccine");
var proviceEl = document.querySelectorAll(".province");
var covidLocEl = document.querySelector("#covidLocation");

// Function to format numbers (Obtained from - https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript)
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
};

// Function to display the covid stats
var displayCovidStats = function (covidArray) {
  totalCases.textContent = formatNumber(covidArray.summary[0].cumulative_cases);
  totalDeaths.textContent = formatNumber(covidArray.summary[0].cumulative_deaths);
  totalRecovered.textContent = formatNumber(covidArray.summary[0].cumulative_recovered); 
  todayCases.textContent = formatNumber(covidArray.summary[0].cases);
  todayDeaths.textContent = formatNumber(covidArray.summary[0].deaths);
  todayRecovered.textContent = formatNumber(covidArray.summary[0].recovered);
  covidLocEl.textContent = formatNumber(covidArray.summary[0].province);
  totalTests.textContent = formatNumber(covidArray.summary[0].cumulative_testing);
  totalActive.textContent = formatNumber(covidArray.summary[0].active_cases);
  totalVaccine.textContent = formatNumber(covidArray.summary[0].cumulative_avaccine);
  todayTests.textContent = formatNumber(covidArray.summary[0].testing);
  todayChange.textContent = formatNumber(covidArray.summary[0].active_cases_change);
  todayVaccine.textContent = formatNumber(covidArray.summary[0].avaccine);

};



// Load covidData when the page loads
loadCovidData();


// If the arrays are empty hide the main container.
if (placeArray.length !== 0 || covidArray.length !== 0) {
  //console.log(placeArray);
  mainCont.style.display = "block";
  heroContainer.classList.remove("hero-def-height");
  mainCont.classList.add("p-2", "main-container");
} else {
  mainCont.style.display = "none";
}




