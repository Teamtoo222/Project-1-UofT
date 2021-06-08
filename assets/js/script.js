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

var iStart = 0;
var iEnd = 4;
var iStartNews = 0;
var iEndNews = 4;
var typeOf = 'restaurant';
var targetId = '#nearby-resturants';
var mainCont = document.getElementById("mainContainer");
var heroContainer = document.getElementById("heroContainer");
var covidContainer = document.getElementById("covidContainer");
var eventsContainer = document.getElementById("nearby-events-section");
var restaurantsContainer = document.getElementById("restaurantsContainer");
var recreationContainer = document.getElementById("recreationContainer");
var newscontainer = document.querySelector("#news-cards-container");
var addressArrayforNews = [];
var page = 1;
var newNewsArry = [];
var geoPoint = "";

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
      apiGeoCodeFetch(googleGeoCodeUrl, selectedOption, cityInput);
      eventsDisplay();

      
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

  newscontainer.innerHTML = "";
  newNewsArry = [];
  addressArrayforNews = [];
  savedEventsArray = [];

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
          getEventData(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, searchCity);
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
      RankBy: "DISTANCE"
    },
    // pagination can be used for future development
    function (place, status, pagination) {
    
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
    document.getElementById("resLocation").textContent = loadedCities[loadedCities.length-1];

  } else if (loadedType === "Recreations") {
    targetId = "#nearby-recreation";
    recreationsDsiplay();
    document.getElementById("recLocation").textContent = loadedCities[loadedCities.length-1];
    
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
      if(place.length < iEnd) {
        iEnd = place.length;
        document.querySelector('#show-res').classList.add("hideEl");
        document.querySelector('#show-rec').classList.add("hideEl");
        return;
      }
      // Get details method, check this link for more info https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.getDetails
      if (place[i]) {
        // console.log(place[i]);
        service.getDetails(
          {
            placeId: place[i],
          },
          function (getResults, status) {
            if (getResults) {
              // console.log('rec details **** :', getResults);
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
    photoUrl = "./assets/images/default-img.jpg";
  }

  // check if the array has a rating
  if(place.hasOwnProperty("rating")) {
    var placeRating = place.rating;
    var ratingClass = "";
  } else {
    placeRating = "N/A";
    ratingClass = "visibility-hidden";
  }

  // check if the array has a phone number
  if(place.hasOwnProperty("formatted_phone_number")) {
    var placePhone = place.formatted_phone_number;
    var phoneClass = "";
  } else {
    placePhone = "Not Available";
    phoneClass = "visibility-hidden";
  }

  // getDistance(desLatResult, desLngResult);

  // console.log(place.geometry.location.lng());

  // template to create the card
  const template = `
    <a class="linkImage" href=${place.url} target="_blank">
    <div class="img-container" style="background-image:url(${photoUrl});">
    <div class="store-status is-flex is-align-items-flex-end is-flex-direction-column">
    <div class="w-100 is-flex is-justify-content-space-between">
    <p class="ratingNumb ${ratingClass}"><i class="ratingNumbIcon fas fa-star-half-alt"></i>&nbsp${placeRating}</p>
    <p class="mb-2 open-status ${phoneClass}">${openStatus}</p>
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
      <a class="wrap-content" href="https://www.google.com/maps/dir/?api=1&destination=${place.formatted_address}" target="_blank class="store-address"><p> <i class="fas fa-car-side"></i>&nbsp ${val} | ${time} </p></a>
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

// eventlistner for showres
document.querySelector('#show-res').addEventListener('click', () => {
  iStart += 4;
  iEnd += 4;
// run the passNearByData function
  passNearByData(placeArray, targetId);
});

// eventlistner for showrec
document.querySelector('#show-rec').addEventListener('click', () => {
  iStart += 4;
  iEnd += 4;
// run the passNearByData function
  passNearByData(placeArray, targetId);
});

// Load the Res data if there any
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
  
  for(var i = 0; i < data.results[0].address_components.length - 1; i++) {
    addressArrayforNews.push(data.results[0].address_components[i].long_name);
  }

  var dupCheck = new Set(addressArrayforNews);

  addressArrayforNews = [...dupCheck];

  covidData(covidUrl);
  covidNewsFetch(addressArrayforNews, page);
  covidNewsLoc.textContent = province;
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
  newNewsArry = [];
  loadedData = JSON.parse(localStorage.getItem("covidData"));
  loadedNews = JSON.parse(localStorage.getItem("news"));

  if(!loadedData || !loadedNews) {
    return;
  } else {
    covidArray = loadedData;
    newNewsArry = loadedNews;

  // console.log("this is the returned array", covidArray);
  displayCovidStats(covidArray);
  covidNewsCards(newNewsArry);
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
var covidNewsLoc = document.querySelector("#covidNewsLoc");

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
  covidLocEl.textContent = covidArray.summary[0].province;
  covidNewsLoc.textContent = covidArray.summary[0].province;
  totalTests.textContent = formatNumber(covidArray.summary[0].cumulative_testing);
  totalActive.textContent = formatNumber(covidArray.summary[0].active_cases);
  totalVaccine.textContent = formatNumber(covidArray.summary[0].cumulative_avaccine);
  todayTests.textContent = formatNumber(covidArray.summary[0].testing);
  todayChange.textContent = formatNumber(covidArray.summary[0].active_cases_change);
  todayVaccine.textContent = formatNumber(covidArray.summary[0].avaccine);

};



// Covid 19 News
var covidNewsFetch = function(chosenProvince, page) {
  // Covid News
  fetch("https://covid-19-news.p.rapidapi.com/v1/covid?q=covid&lang=en&sort_by=date&country=CA&page=" + page + "&page_size=100&media=True", {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "4cf7ac4704msh1b9e803a13a0c62p1cfe7djsnef3594636b71",
      "x-rapidapi-host": "covid-19-news.p.rapidapi.com"
    }
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    groupRelatedNews(data, chosenProvince);

  })
  .catch(err => {
    console.error(err);
  });
};

// function to narrow down the news list
function checkInput(input, words) {
  return words.some(word => input.toLowerCase().includes(word.toLowerCase()));
 };


// Function to group the new list into a new array
var groupRelatedNews = function(newsData, chosenProvince) {
  for(var i = 0; i < newsData.articles.length; i++) {
    var newsSummary = newsData.articles[i].summary;
    var status = checkInput(newsSummary, chosenProvince); 
    if (status) {
      newNewsArry.push(newsData.articles[i]);
    }
  }
  // if the array does not have 8 news fetch again in the next page
  if(newNewsArry.length < 8) {
    page += 1;
    covidNewsFetch(addressArrayforNews, page);
  } else {
    covidNewsCards(newNewsArry);
  }
  // Save the array in the locatl storage
  localStorage.setItem("news", JSON.stringify(newNewsArry));
};

// function to create th enews cards
var covidNewsCards = function(articles) { 
  for(var i = iStartNews; i < iEndNews ;i ++) {
    if(articles.length < iEndNews) {
      iEndNews = articles.length;
      document.querySelector('#show-news').classList.add("hideEl");
      return;
    }

    var imageUrl = "";
    if(!articles[i].media) {
      imageUrl = "./assets/images/news.jpg";
    } else {
      imageUrl = articles[i].media;
    }

    var articleDate = moment(articles[i].published_date).format("MM/DD/YYYY");
    const newsCardTemp = `
      <a class="linkImage" href=${articles[i].link} target="_blank">
      <div class="img-container" style="background-image:url(${imageUrl});">
      <div class="w-100 is-flex is-justify-content-space-between">
      <p class="open-status">${articleDate}</p>
      </div>
      </div>
      </a>
      <div class="details-container">
      <div class="store-details is-flex">
      <a href="${articles[i].link}" target="_blank"><p class="store-name wrap-content-100 height-40"><strong>${articles[i].title}</strong></p></a>
      <p class="store-desc wrap-content-100 my-2">${articles[i].summary}</p>
        <a href="https://${articles[i].clean_url}" target="_blank"><i class="fas fa-globe"></i>&nbsp ${articles[i].clean_url}</a>
        </div>
        </div>
        `;

      // Create and append the card
      const container = document.createElement('div');
      container.classList = "event-container column card p-0";
      container.innerHTML = newsCardTemp;
      document.querySelector("#news-cards-container").append(container); 
    }
};

// Show more news
document.querySelector('#show-news').addEventListener('click', () => {
  var loadedNews = JSON.parse(localStorage.getItem("news"));

  iStartNews += 4;
  iEndNews += 4;
// run the passNearByData function
covidNewsCards(loadedNews);

});

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


