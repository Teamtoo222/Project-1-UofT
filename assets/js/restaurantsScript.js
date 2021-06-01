// Added the API key on the html with the api call

// Variables
var searchForm = document.getElementById("searchForm");
// To Update the location subheading on the DOM
var locationName = document.querySelector(".locHeading");


// To update Restaurant Names after city is searched
var storeNameOne = document.querySelector(".store-name-one")
var storeNameTwo = document.querySelector(".store-name-two")
var storeNameThree = document.querySelector(".store-name-three")
var storeNameFour = document.querySelector(".store-name-four")
var storeNameFive = document.querySelector(".store-name-five")

// To update Restaurant Addresses after city is searched
var storeAddressOne = document.querySelector(".store-address-one")
var storeAddressTwo = document.querySelector(".store-address-two")
var storeAddressThree = document.querySelector(".store-address-three")
var storeAddressFour = document.querySelector(".store-address-four")
var storeAddressFive = document.querySelector(".store-address-five")

// To update Restaurant Phone Numbers after city is searched
var storePhoneOne = document.querySelector(".store-phone-one")
var storePhoneTwo = document.querySelector(".store-phone-two")
var storePhoneThree = document.querySelector(".store-phone-three")
var storePhoneFour = document.querySelector(".store-phone-four")
var storePhoneFive = document.querySelector(".store-phone-five")

// To update Restaurant background images of cards after city is searched
var restaurantImageOne = document.querySelector(".restaurant-img-one")
var restaurantImageTwo = document.querySelector(".restaurant-img-two")
var restaurantImageThree = document.querySelector(".restaurant-img-three")
var restaurantImageFour = document.querySelector(".restaurant-img-four")
var restaurantImageFive = document.querySelector(".restaurant-img-five")






cityInput = "Toronto";
var googleApiKey = "AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
var googleGeoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityInput + "&key=" + googleApiKey;


// submit form event listener 
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    cityInput = document.getElementById("#search-city").value;
    googleGeoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityInput + "&key=" + googleApiKey;

    apiGeoCodeFetch(googleGeoCodeUrl);

    locationName.textContent = cityInput;
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
    keywordInput = document.getElementById("keywordInput").value;
    //console.log(passedData , latData, lngData);
    var service = new google.maps.places.PlacesService(document.getElementById('map'));
    // Nearby Search method, https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.nearbySearch
    service.nearbySearch({
        // We can use the user input and covert it to lat long and use it here...
        location: {lat: latData, lng:lngData},
        radius: 5000,
        // We can use the keywords field here 
        keyword: keywordInput,
        // I think we could use the same function for recreations as we will be able to change the type and get this to work 
        type: "restaurant"
    },function (place, status) {
        console.log('Restaurant Details: ', place);
        if(place) {
             for (let i = 0; i < 5; i++) {
                  // Get details method, check this link for more info https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.getDetails
                service.getDetails({
                    placeId: place[i].place_id
                    }, function (placeDetails, status) {
                    console.log('Place Details: ', placeDetails);
                    
                    //Update restaurant name and information on cards
                    storeNameOne.innerHTML = place[0].name;
                    storeAddressOne.innerHTML = place[0].vicinity;

                    storeNameTwo.innerHTML = place[1].name
                    storeAddressTwo.innerHTML = place[1].vicinity;

                    storeNameThree.innerHTML = place[2].name
                    storeAddressThree.innerHTML = place[2].vicinity;
                    
                    storeNameFour.innerHTML = place[3].name
                    storeAddressFour.innerHTML = place[3].vicinity;

                    storeNameFive.innerHTML = place[4].name
                    storeAddressFive.innerHTML = place[4].vicinity;

                    
               
                });
               //Retrieve Photo Urls
               var placePhotoUrlOne = place[0].photos[0].getUrl({maxWidth:640}); 
               var placePhotoUrlTwo = place[1].photos[0].getUrl({maxWidth:640}); 
               var placePhotoUrlThree = place[2].photos[0].getUrl({maxWidth:640}); 
               var placePhotoUrlFour = place[3].photos[0].getUrl({maxWidth:640}); 
               var placePhotoUrlFive = place[4].photos[0].getUrl({maxWidth:640}); 
               console.log(placeDetails)

                //Update restaurant background images using retrieved image URLs
               restaurantImageOne.setAttribute('style', 'background-image: url('+placePhotoUrlOne+')');
               restaurantImageTwo.setAttribute('style', 'background-image: url('+placePhotoUrlTwo+')');
               restaurantImageThree.setAttribute('style', 'background-image: url('+placePhotoUrlThree+')');
               restaurantImageFour.setAttribute('style', 'background-image: url('+placePhotoUrlFour+')');
               restaurantImageFive.setAttribute('style', 'background-image: url('+placePhotoUrlFive+')');
               


            
                


            }

        }
    });


};
