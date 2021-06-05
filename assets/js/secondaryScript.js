//Function to load and display existing city names

document.addEventListener("DOMContentLoaded", function(event) { 
    // var existingList = function () {
        var preStoredCityList = localStorage.getItem("searchCities");
        var storedCityList = JSON.parse(preStoredCityList)
        //console.log(storedCityList);
    
        if (storedCityList != null) {
            for (var i = 0; i < storedCityList.length; i++) {
                console.log(storedCityList);
    
                var cityButtonLoading = document.createElement("button");
                cityButtonLoading.innerText = (storedCityList[i]);
                cityButtonLoading.className = "select is-normal pr-2"
                //cityButtonLoading.id = storedCityList[i];
    
                console.log(cityButtonLoading);
                //debugger;
            
                //submitForm.append(cityButtonLoading);
                
            
            }
            //previousSearchHistory.addEventListener("click", (reinserting));
        }
    })