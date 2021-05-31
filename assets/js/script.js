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

let resCount = 5;
let recCount = 5;

// Fetch the google data
var apiGeoCodeFetch = function (url) {
  fetch(url).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        logPlaceDetails(data, 'restaurant', '#nearby-resturants', resCount);
        logPlaceDetails(data, 'recreation', '#nearby-recreation', recCount);
        console.log('DATAAAAA', data);
        document.querySelector('#show-rec').addEventListener('click', () => {
          recCount += 5;
          document.querySelector('#nearby-recreation').innerHTML = '';
          logPlaceDetails(data, 'recreation', '#nearby-recreation', recCount);
        });

        document.querySelector('#show-res').addEventListener('click', () => {
          resCount += 5;
          document.querySelector('#nearby-resturants').innerHTML = '';
          logPlaceDetails(data, 'restaurant', '#nearby-resturants', resCount);
        });
      });
    }
  });
};

// Function to pull the nearby the restaurants
function logPlaceDetails(passedData, type, target, number) {
  var latData = passedData.results[0].geometry.location.lat;
  var lngData = passedData.results[0].geometry.location.lng;
  keywordInput = document.getElementById('keywordInput').value;
  //console.log(passedData , latData, lngData);
  var service = new google.maps.places.PlacesService(
    document.getElementById('map')
  );
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
      //   console.log('Place details:', place);
      if (place) {
        for (let i = 0; i < number; i++) {
          // Get details method, check this link for more info https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.getDetails
          if (place[i]) {
            service.getDetails(
              {
                placeId: place[i].place_id,
              },
              function (place, status) {
                console.log('rec details **** :', place);
                if (place) {
                  const template = `
                  <a href=${place.url}>
                  <div class="event-container column card p-0">
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
                    </div>
                    </a>
                    `;

                  const container = document.createElement('div');
                  container.innerHTML = template;
                  document.querySelector(target).append(container);
                }
              }
            );
          }
          //Retrive Photo Urls
          var placePhotoUrl = place[i].photos[0].getUrl({ maxWidth: 640 });
          console.log(placePhotoUrl);
        }
      }
    }
  );
}
