// Added the API key on the html with the api call
// var googleApiKey = "AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";


// Function to pull the nearby the restaurants
function logPlaceDetails() {
    var service = new google.maps.places.PlacesService(document.getElementById('map'));
    // Nearby Search method, https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.nearbySearch
    service.nearbySearch({
        // We can use the user input and covert it to lat long and use it here...
        location: {lat: 43.6532, lng: -79.3832},
        radius: 500,
        // We can use the keywords field here // could be resaturants or parks 
        keyword: "restaurants" 
    },function (place, status) {
        console.log('Place details:', place);
        if(place) {
            console.log(place.ok)
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

logPlaceDetails();
