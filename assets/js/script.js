// Added the API key on the html with the api call

// Variables
var searchForm = document.getElementById("searchForm");

cityInput = "Toronto";
var googleApiKey = "AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
var googleGeoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityInput + "&key=" + googleApiKey;


// submit form event listner 
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    cityInput = document.getElementById("cityInput").value;

    googleGeoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityInput + "&key=" + googleApiKey;

    apiGeoCodeFetch(googleGeoCodeUrl);
});

// Fetch the google data
var apiGeoCodeFetch = function(url) {
    fetch(url)
    .then(function(response) {
        if(response.ok) {
            response.json()
            .then(function(data) {
                logPlaceDetails(data);
                //console.log(data);
            });
        }
    });
};


// Function to pull the nearby the restaurants
function logPlaceDetails(passedData) {
    var latData = passedData.results[0].geometry.location.lat;
    var lngData = passedData.results[0].geometry.location.lng;
    keywordImput = document.getElementById("keywordInput").value;
    //console.log(passedData , latData, lngData);
    var service = new google.maps.places.PlacesService(document.getElementById('map'));
    // Nearby Search method, https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.nearbySearch
    service.nearbySearch({
        // We can use the user input and covert it to lat long and use it here...
        location: {lat: latData, lng:lngData},
        radius: 500,
        // We can use the keywords field here // could be resaturants or parks 
        keyword: keywordImput 
    },function (place, status) {
        console.log('Place details:', place);
        if(place) {
             for (let i = 0; i < 5; i++) {
                  // Get details method, check this link for more info https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.getDetails
                service.getDetails({
                    placeId: place[i].place_id
                    }, function (place, status) {
                    console.log('Place details:', place);
                });
               //Retrive Photo Urls
               var placePhotoUrl = place[i].photos[0].getUrl({maxWidth:640}); 
               console.log(placePhotoUrl);
            }
        }
    });

};

