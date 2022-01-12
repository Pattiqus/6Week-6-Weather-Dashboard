

// # Define: API Key
var APIKey ="516f024af358e0fecf2a43dd16d78077";
/**
*   Retrieve: Current Geo-Location/IP
*/
var openWeatherMap = 'http://api.openweathermap.org/data/2.5/weather';
var weatherMapApiForecast = 'https://api.openweathermap.org/data/2.5/onecall';
var openWeatherMapCurrentApi = 'https://api.openweathermap.org/data/2.5/weather';

//  ?lat={lat}&lon={lon}&exclude={part}&appid={API key}


// # On-Load: Display any saved Cities within search


// # Use-Case: Either default to users' current geo or their most recent city that they searched

/*
Statement: On page load, check if geo location services is available, prompts user for access, then call fetchWeatherData function with position parameter based on geo-location if no user input detected
*/
if (window.navigator && window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(function(position) {
        fetchWeatherData(position);
    });
    
}

/*
Function: fetchWeatherData
Desription: Calls upon defined weather service API to retreive weather data based on either current latitude longitude OR user input for City names then writes to HTML
*/

var fetchWeatherData = function (position, cityName) {

    var hasErrors = false; 
    var ajaxData = {              
        units: 'metric',
        APPID: APIKey
    };

    if ( position != null ) {
        ajaxData.lat = position.coords.latitude;
        ajaxData.lon = position.coords.longitude;
    }

    if ( cityName != null ) {
        ajaxData.q = cityName;
        $.ajax({
            url: openWeatherMapCurrentApi,
            method: "GET",
            data: ajaxData,
            dataType: "JSON",
            async: false,
            success: function( data ) {
                console.log(data);

                // # Define: Co-ordinates based on weather API call 
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;

                // # Mutate: Change data based on API Response
                ajaxData.lat = latitude;
                ajaxData.lon = longitude

                // # Remove: Query key from ajax data for subsequent call
                delete ajaxData.q;


            },
            error: function (xhr, status, error) {

                console.log( 'Error has been hit! 🔴🔴🔴' );
                // # Use-Case: Invalid or incorrect city name/state provided, stop code from processing.
                hasErrors = true;


            }
        });
    }

    if( hasErrors === false ) {
        $.ajax({
            url: weatherMapApiForecast,
            method: "GET",
            data: ajaxData, 
            dataType: "JSON",
            success: function( data ) {
                console.log( data );
                
                var weatherData = data;
                var dailyData = weatherData.daily;
                var currentWeatherData = Object.assign({}, weatherData.current );

                console.log( currentWeatherData );

                // # Determine: Current City
                var currentCity = String( weatherData.timezone ).split('/')[1];

                // # Determine: Current Date
                var currentDate = new Date().toLocaleDateString();

                // # Create: Binded String for data
                // var 

                // # Create: HTML 
                var currentHtml = "";

                    currentHtml += '<div class="current-weather-container">';

                        // # Current City TItle/Date
                        currentHtml += '<div class="current-weather-title">';
                            currentHtml += currentCity + " (" + currentDate + ")";
                        currentHtml += '</div>';

                        // # Define: Current Temp
                        var currentTemp = currentWeatherData.temp;

                        // # Current City Temp (C)
                        currentHtml += '<div  class="current-weather-temperature">';
                            currentHtml += "Temperature: " + currentTemp + "℃";
                        currentHtml += '</div>';

                        // # Define: Current WindSpeed
                        var currentWindSpeed = currentWeatherData.wind_speed;

                        // # Current City Wind Speed
                        currentHtml += '<div  class="current-weather-speed">';
                            currentHtml += "Wind Speed: " + currentWindSpeed + " km/h";
                        currentHtml += '</div>';

                        
                        // # Define: Current WindSpeed
                        var currentHumidity = currentWeatherData.humidity;

                        // # Current City Humidity
                        currentHtml += '<div  class="current-weather-humidity">';
                            currentHtml += "Humidity: " + currentHumidity + "%";
                        currentHtml += '</div>';

                        // # Define: Current City UVI
                        var currentUvi = parseFloat( currentWeatherData.uvi ).toFixed( 2 );

                        // # Current City Humidity
                        currentHtml += '<div  class="current-weather-uvi">';
                            currentHtml += "UV Index: " + currentUvi;
                        currentHtml += '</div>';

                    currentHtml += '</div>';


                    currentHtml += '<div class="forecast-weather-container">';

                        currentHtml += '<div class="forecast-weather-tile weather-tile-day">';
                            currentHtml += 'DAY 1';

                        currentHtml += '</div>';

                    currentHtml += '</div>';

                // # Set: Content to dynamic html generated from API
                var columnContentEl = document.querySelector('.column-content.weather-data');
                columnContentEl.innerHTML = currentHtml;

                console.log( currentHtml );
                console.log( currentCity );
                console.log( dailyData );

                // # Define: Current City/User Input City based on calls
                // if( typeof cityName !== null ) {
                //     // # Store: User Input City
                //     var cityApi = cityName;
                // } else {
                //     // # Store: GeoLocated City
                //     var cityApi = currentCity;
                // }

                // # ^^^ Ternary Style of coding for the above
                var cityApi = typeof cityName !== null ? cityName : currentCity;


                // # Get: Previous Cities stored in LocalStorage
                var previousSearchedCities = localStorage.getItem('weatherCitySearches') != null && localStorage.getItem('weatherCitySearches') != "" ? JSON.parse( localStorage.getItem('weatherCitySearches') ) : [];

                // # Sanity-Check: Ensure that it hasn't exceed 10 cities in storage;
                
                // # Use-case: Has exceeded remove the first

                console.log('Type of previousSearchedCities', typeof previousSearchedCities, previousSearchedCities);

                // # Sanity-Check: Ensure city does not pop up in list twice
                if( previousSearchedCities.indexOf( currentCity ) == -1 ) {
                    previousSearchedCities.push( currentCity );
                }

                // # Store: City into LocalStorage
                localStorage.setItem('weatherCitySearches', JSON.stringify( previousSearchedCities ) );
            }
        });
    }
};


/*
Function: searchCity
Description: Used to search for a city using the text input field and display relevent weather data
*/

var searchCityForm = function ( formSubmitEvent) {
    // Prevent: Default browser behaviour for the form
    formSubmitEvent.preventDefault();
    // Retreive: user Input from form
    var userInput = document.getElementById("cityInput").value;
    // Debug: Check user input value is read
    console.log(userInput);
    // Set: Set parameter - position to value of userInput
    fetchWeatherData( null, userInput );













    // // Retreiving 
    // document.querySelector('#cityInput');
    // // Prevent: Default browser behaviour for the form
    // submitEvent.preventDefault();
}


// Define: Retreive Form element
var formEl = document.getElementById('submitCityForm');
// Bind:
formEl.addEventListener('submit', searchCityForm);


















// // 
// var submitCityBtn = document.getElementById('submitCityForm');
// submitCityBtn.addEventListiner('click', searchCityForm);




// // # Retreive: City previously searched for
// var searchHistory = document.getElementById('cityInput').value;

// // # Debugging: Output city to console log
// console.log( searchHistory );

// // # Define: Object data to save for search history

// var searchHistorylog = {
//     searchHistory
// }



