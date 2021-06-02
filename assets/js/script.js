// Added the API key on the html with the api call

// Variables
var searchForm = document.getElementById('searchForm');

var cityInput = 'Toronto';
var keywordInput = "";
var googleApiKey = 'AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs';
var googleGeoCodeUrl =
  'https://maps.googleapis.com/maps/api/geocode/json?address=' +
  cityInput +
  '&key=' +
  googleApiKey;

var placeArray = [];
var errorModal =  document.getElementById("error-Modal");

let iStart = 0;
let iEnd = 5;
let type = 'restaurant';
var targetId = '#nearby-resturants';
var mainCont = document.getElementById("mainContainer");
var heroContainer = document.getElementById("heroContainer");

// type = 'tourist_attraction';
// targetId = '#nearby-recreation';


var service = new google.maps.places.PlacesService(document.getElementById('map'));
// submit form event listner
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  cityInput = document.getElementById('search-city').value;
  keywordInput = document.getElementById('keywordInput').value;

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

    iStart = 0;
    iEnd = 5;
    
    var selectedOption = document.getElementById("selectOption").value;
    var covidContainer = document.getElementById("covidContainer");
    var eventsContainer = document.getElementById("nearby-events-section");
    var restaurantsContainer = document.getElementById("restaurantsContainer");
    var recreationContainer = document.getElementById("recreationContainer");

    //document.getElementById("mainContainer").innerHTML = "";

    
    heroContainer.classList.remove("hero-def-height");
    mainCont.classList.add("p-2", "main-container");
    
    if(selectedOption === "Events") {
      apiGeoCodeFetch(googleGeoCodeUrl, selectedOption);
      covidContainer.classList.remove("hideEl");
      covidContainer.classList.add("showEl");
      recreationContainer.classList.add("hideEl");
      recreationContainer.classList.remove("columns");
      eventsContainer.classList.remove("hideEl");
      eventsContainer.classList.add("columns");
      eventsContainer.classList.add("showEl");
    } else if (selectedOption === "Restaurants") { 
      eventsContainer.classList.add("hideEl");
      eventsContainer.classList.remove("columns");
      covidContainer.classList.remove("hideEl");
      covidContainer.classList.add("showEl");
      recreationContainer.classList.add("hideEl");
      recreationContainer.classList.remove("columns");
      restaurantsContainer.classList.remove("hideEl");
      restaurantsContainer.classList.add("columns");
      document.getElementById("nearby-resturants").innerHTML = "";
      document.getElementById("resLocation").textContent = cityInput;
      apiGeoCodeFetch(googleGeoCodeUrl, selectedOption);
    } else if (selectedOption === "Recreations") {
      type = 'tourist_attraction';
      targetId = '#nearby-recreation';
      eventsContainer.classList.add("hideEl");
      eventsContainer.classList.remove("columns");
      restaurantsContainer.classList.add("hideEl");
      restaurantsContainer.classList.remove("columns");
      covidContainer.classList.remove("hideEl");
      covidContainer.classList.add("showEl");
      recreationContainer.classList.remove("hideEl");
      recreationContainer.classList.add("columns");
      document.getElementById("nearby-recreation").innerHTML = "";
      document.getElementById("recLocation").textContent = cityInput;
      apiGeoCodeFetch(googleGeoCodeUrl, selectedOption);
    }

    // searchForm.reset();
    document.querySelector("#keywordInput").value = "";

  }

});



// Fetch the google data
var apiGeoCodeFetch = function (url, option) {
  fetch(url).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if(option === "Events") {
          covidLoc(data);
        } else {
          covidLoc(data);
          logResPlaceDetails(data);
        }
        
        // logPlaceDetails(data, 'parks');
        console.log('DATAAAAA', data);
      });
    }
  });
};

// Function to pull the nearby the restaurants
function logResPlaceDetails(passedData) {
  var latData = passedData.results[0].geometry.location.lat;
  var lngData = passedData.results[0].geometry.location.lng;
  //console.log(passedData , latData, lngData);
  // Nearby Search method, https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.nearbySearch
  service.nearbySearch(
    {
      // We can use the user input and covert it to lat long and use it here...
      location: { lat: latData, lng: lngData },
      radius: 10000,
      // We can use the keywords field here
      keyword: keywordInput,
      // I think we could use the same function for recreations as we will be able to change the type and get this to work
      type: type,
    },
    function (place, status) {
      console.log('Place details:', place);
      placeArray = place;
      passNearByData(placeArray);
    }
  );
};

var passNearByData = function (place) {
  if (place) {
    for (let i = iStart; i < iEnd; i++) {
      // Get details method, check this link for more info https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.getDetails
      if (place[i]) {
        console.log(place[i]);
        service.getDetails(
          {
            placeId: place[i].place_id,
          },
          function (place, status) {
            // console.log("this is the error status", status);
            if (place) {
              console.log('rec details **** :', place);
              createCards(place);
            }
          }
        );
      }
      //Retrive Photo Urls
      // var placePhotoUrl = place[i].photos[0].getUrl({ maxWidth: 640 });
      // console.log(placePhotoUrl);
    }
  }
}

var createCards = function(place) {
  // console.log(place.opening_hours.isOpen());
  // Check if store has opening hours
  if(place.hasOwnProperty("opening_hours")) {
    if (place.opening_hours.isOpen() === true) {
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
    var busClassList = "busStatus bg-green"
    // document.querySelector(".busStatus").style.background = "green";
  } else if (place.business_status === "CLOSED_TEMPORARILY") {
    businesStatus = "Temporarily closed";
    busClassList = "busStatus bg-red"
  } else {
    businesStatus = "Permanently closed"
    busClassList = "busStatus bg-red"
  }

  const template = `
    <a class="linkImage" href=${place.url} target="_blank">
    <div class="img-container" style="background-image:url(${place.photos[0].getUrl()});">
    <div class="store-status is-flex is-align-items-flex-end is-flex-direction-column">
    <div class="w-100 is-flex is-justify-content-space-between">
    <p class="ratingNumb"><i class="ratingNumbIcon fas fa-star-half-alt"></i>&nbsp${place.rating}</p>
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
      <a href="tel:${place.formatted_phone_number}" class="store-phone"><i class="fas fa-phone-alt"></i>&nbsp${place.formatted_phone_number}</a>
      <a href="${place.website}" target="_blank"><i class="fas fa-globe"></i>&nbsp Website</a>
      </div>
      </div>
      `;

    const container = document.createElement('div');
    container.classList = "event-container column card p-0";
    container.innerHTML = template;
    document.querySelector(targetId).append(container);

};



var busStatChecker = function() {
// Change the background color of busStats
  var busStatEl = document.querySelectorAll(".busStatus");

  for (var i = 0; i < busStatEl.length; i++) {
    console.log("test");
    if(busStatEl[i] === "Operational") {
      var statEl =  document.querySelector(".busStatus");
      statEl.classList.remove("bg-red");
      statEl.classList.add("bg-green");
    }
  }
}



document.querySelector('#show-res').addEventListener('click', () => {
  iStart += 5;
  iEnd += 5;
  //document.querySelector('#nearby-resturants').innerHTML = '';
  //logPlaceDetails(data, 'recreation', '#nearby-recreation', recCount);
    passNearByData(placeArray);
});


document.querySelector('#show-rec').addEventListener('click', () => {
  iStart += 5;
  iEnd += 5;
  //document.querySelector('#nearby-resturants').innerHTML = '';
  //logPlaceDetails(data, 'recreation', '#nearby-recreation', recCount);
    passNearByData(placeArray);
});

var currentDay = moment().subtract(1, 'day').format('DD-MM-YYYY');
// var province = "ON";
console.log(currentDay);



var covidLoc = function(data) {
  var addressData = data.results[0].address_components;
  var province = "";
  if(addressData.length === 8) {
    province = addressData[addressData.length - 3].short_name;
  } else {
    province = addressData[addressData.length - 2].short_name;
  }
  var covidUrl = "https://api.opencovid.ca/summary?loc=" + province + "&date=" + currentDay;
  console.log(province);
  console.log(covidUrl);
  covidData(covidUrl);
} 


var covidArray = [];

// Fetch the google data
var covidData = function (covidUrl) {
  fetch(covidUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // logPlaceDetails(data, 'parks');
        console.log('DATAAAAA', data);
        saveCovidData(data);
        displayCovidStats(data);
      });
    }
  });
};

var saveCovidData = function(data) {
  localStorage.setItem("covidData", JSON.stringify(data));
}

var loadCovidData = function() {
  loadedData = JSON.parse(localStorage.getItem("covidData"));

  if(!loadedData) {
    return;
  } else {
    covidArray = loadedData;

    console.log("this is the returned array", covidArray);

    displayCovidStats(covidArray);
  }
  
}

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


function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


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

loadCovidData();

if (placeArray.length !== 0 || covidArray.length !== 0) {
  console.log(placeArray);
  mainCont.style.display = "block";
  heroContainer.classList.remove("hero-def-height");
  mainCont.classList.add("p-2", "main-container");

} else {
  mainCont.style.display = "none";
}
