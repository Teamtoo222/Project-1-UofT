var getUserRepos = function (user) {
  // format the github api url
  var apiUrl =
    'https://maps.googleapis.com/maps/api/place/search/json?location=33.347075,-111.96318&radius=200&types=gym&sensor=false&key=https://maps.googleapis.com/maps/api/place/search/json?location=33.347075,-111.96318&radius=200&types=gym&sensor=false&key=AIzaSyBg8HI6sH1Rxyhn1Mno_hhgDawuF1KAfq0';
  //   console.log(apiUrl);
  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          //   display(data, user);
        });
      } else {
        alert('Error: GitHub User Not Found');
      }
    })
    .catch(function (error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert('Erong city name');
    });
};

getUserRepos();
