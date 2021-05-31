// Added the API key on the html with the api call

// Variables
var searchForm = document.getElementById('searchForm');

cityInput = 'Toronto';
var googleApiKey = 'AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs';
var googleGeoCodeUrl =
  'https://maps.googleapis.com/maps/api/geocode/json?address=' +
  cityInput +
  '&key=' +
  googleApiKey;

var service = new google.maps.places.PlacesService(document.getElementById('map'));
// submit form event listner
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  cityInput = document.getElementById('search-city').value;
  googleGeoCodeUrl =
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    cityInput +
    '&key=' +
    googleApiKey;

  apiGeoCodeFetch(googleGeoCodeUrl);
});

var placeArray = [];

let resCount = 5;
let recCount = 5;
let iStart = 0;
let iEnd = 5;
let type = 'restaurant';
let targetId = '#nearby-resturants';

// type = 'tourist_attraction';
// targetId = '#nearby-recreation';

// Fetch the google data
var apiGeoCodeFetch = function (url) {
  fetch(url).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        logResPlaceDetails(data);
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
  keywordInput = document.getElementById('keywordInput').value;
  //console.log(passedData , latData, lngData);
  // Nearby Search method, https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.nearbySearch
  service.nearbySearch(
    {
      // We can use the user input and covert it to lat long and use it here...
      location: { lat: latData, lng: lngData },
      radius: 5000,
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
            console.log("this is the error status", status);
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
  const template = `
    <a href=${place.url} target="_blank">
    <div class="img-container" style="background-image:url(${place.photos[0].getUrl()});">
    <div class="store-status is-flex is-justify-content-flex-end">
    <p class="open-status">OPEN</p>
    </div>
    </div>
    <div class="details-container">
    <div class="store-details is-flex">
    <p class="store-name"><strong>${place.name}</strong> </p>
      <p class="store-address">${place.formatted_address}</p>
      <p class="store-status">${place.business_status}</p>
      <p class="store-phone">${place.formatted_phone_number}</p>
      <a href=${place.website}>Details</a>
      </div>
      </div>
      </a>
      `;

    const container = document.createElement('div');
    container.classList = "event-container column card p-0";
    container.innerHTML = template;
    document.querySelector(targetId).append(container);
};


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

