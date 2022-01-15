

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


/**
 * Function: retrievePreviousSearchedCities()
 * Description: Retrieve all stored cities that were preivously searched
 *      then render out to HTML as clickable buttons. 
 * @return {void}
 */
var retrievePreviousSearchedCities = function() {

    // # Retrieve: All stored cities from Local Storage
    var storedCities = localStorage.getItem('weatherCitySearches') != null && localStorage.getItem('weatherCitySearches') != "" ? JSON.parse( localStorage.getItem('weatherCitySearches') ) : [];

    // # Create: HTML Previous search buttons
    var currentHistory = "";


    // # Loop: Through each of the cities & append button
    for(var currentCity = 0, totalCities = (storedCities.length <= 10 ? storedCities.length : 10 ); currentCity < totalCities; currentCity++) {

        // # Define: Current City Name
        var currentCityName = storedCities[ currentCity ].cityName;
        var currentCityLat = storedCities[ currentCity ].coord.lat;
        var currentCityLon = storedCities[ currentCity ].coord.lon;
        var currentCityCountryCode = storedCities[ currentCity ].countryCode;

        // # Append: Button to string for rendering to HTML
        currentHistory += '<button class="city-history" data-latitude="' + currentCityLat + '" data-longitude="' + currentCityLon + '" data-country-code="' + currentCityCountryCode + '">';
            currentHistory += currentCityName + ", " + currentCityCountryCode;
        currentHistory += '</button>';
    }
    
    // # Retrieve: History Container/Element
    var historyContentEl = document.querySelector('.column-content.history');

    // # Set/Render: Dynamic HTML based off local storage data
    historyContentEl.innerHTML = currentHistory;


    // # Retrieve: All new buttons 
    var insertedButtons = historyContentEl.querySelectorAll('button.city-history');
    
    // # Loop & Bind: Buttons to event listener
    for( var currentButton = 0, totalButtons = insertedButtons.length; currentButton < totalButtons; currentButton++ ) {
        
        insertedButtons[ currentButton ].addEventListener('click', searchPreviousCity);

    }

    // console.log(currentHistory);

};

// # Invoke: retrievePreviousSearchedCities() on-page load.
retrievePreviousSearchedCities();


/**
 * Function: searchPreviousCity()
 * Description: Event listener for buttons dynamically created
 *      based off previous search history.
 * @param {Event} clickEvent - The event passed in by the browser
 * @return {void}
 */
var searchPreviousCity = function( clickEvent ) {
    
    // # Prevent: Default Button Behaviour
    clickEvent.preventDefault();

    // # Define: Current Button
    var currentButton = this;

    // # Retrieve: Latitude/Longitude Data from button
    var latitude = currentButton.getAttribute('data-latitude');
    var longitude = currentButton.getAttribute('data-longitude');


    // # Create: Position object to pass-through
    var position = {
        coords: {
            latitude: latitude,
            longitude: longitude,
        }
    };

    
    // console.log( "Button hit! Coords:" , latitude, longitude, position );

    // # Call: Fetch Weather Data Function
    fetchWeatherData( position );
};

/*
Function: fetchWeatherData
Desription: Calls upon defined weather service API to retreive weather data based on either current latitude longitude OR user input for City names then writes to HTML
*/

var fetchWeatherData = function (position, cityName) {

    // console.log( position );

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
    }

    var cityName;
    var countryCode;

    $.ajax({
        url: openWeatherMapCurrentApi,
        method: "GET",
        data: ajaxData,
        dataType: "JSON",
        async: false,
        success: function( data ) {
            // console.log(data);

            // # Define: Co-ordinates based on weather API call 
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;

            // # Mutate: Change data based on API Response
            ajaxData.lat = latitude;
            ajaxData.lon = longitude

            // # Remove: Query key from ajax data for subsequent call
            delete ajaxData.q;

            // # Set: City Name from Callback for subsequent API call
            cityName = data.name;
            countryCode = data.sys.country;

            // console.log( cityName );

        },
        error: function (xhr, status, error) {

            console.log( 'Error has been hit! 🔴🔴🔴' );
            // # Use-Case: Invalid or incorrect city name/state provided, stop code from processing.
            hasErrors = true;


        }
    });

    if( hasErrors === false ) {
        $.ajax({
            url: weatherMapApiForecast,
            method: "GET",
            data: ajaxData, 
            dataType: "JSON",
            success: function( data ) {
                // console.log( data );
                
                var weatherData = data;
                var dailyData = weatherData.daily;
                var currentWeatherData = Object.assign({}, weatherData.current );

                // console.log( currentWeatherData );

                // # Determine: Current City
                // var currentCity = String( weatherData.timezone ).split('/')[1];

                // # Determine: Current Date
                var currentDate = new Date().toLocaleDateString();

                // # Create: Binded String for data
                // var 

                // # Create: HTML 
                var currentHtml = "";

                    currentHtml += '<div class="current-weather-container">';

                        // # Current City TItle/Date
                        currentHtml += '<div class="current-weather-title current-weather-block">';
                            currentHtml += cityName + ", " + countryCode + " (" + currentDate + ")";
                            currentHtml += '<img class="current-weather-icon" src="http://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png" />';
                        currentHtml += '</div>';

                        // # Define: Current Temp
                        var currentTemp = currentWeatherData.temp;

                        // # Current City Temp (C)
                        currentHtml += '<div  class="current-weather-temperature current-weather-block">';
                            currentHtml += "Temperature: " + currentTemp + "℃";
                        currentHtml += '</div>';

                        // # Define: Current WindSpeed
                        var currentWindSpeed = currentWeatherData.wind_speed;

                        // # Current City Wind Speed
                        currentHtml += '<div  class="current-weather-speed current-weather-block">';
                            currentHtml += "Wind Speed: " + currentWindSpeed + " km/h";
                        currentHtml += '</div>';

                        
                        // # Define: Current WindSpeed
                        var currentHumidity = currentWeatherData.humidity;

                        // # Current City Humidity
                        currentHtml += '<div  class="current-weather-humidity current-weather-block">';
                            currentHtml += "Humidity: " + currentHumidity + "%";
                        currentHtml += '</div>';

                        // # Define: Current City UVI
                        var currentUvi = parseFloat( currentWeatherData.uvi ).toFixed( 2 );


                        // # Determine: UVI Index Rating
                        var uviRating;
                        if( currentUvi <= 2 ) {
                            uviRating = "low";
                        } else if ( currentUvi > 2 && currentUvi <= 5 ) {
                            uviRating = "moderate";
                        } else if ( currentUvi > 5 && currentUvi <= 7 ) {
                            uviRating = "high";
                        } else if ( currentUvi > 7 && currentUvi <= 10 ) {
                            uviRating = "very-high";
                        } else {
                            uviRating = "extreme"
                        }

                        // # Current City Humidity
                        currentHtml += '<div  class="current-weather-uvi current-weather-block ' + uviRating + '">';
                            currentHtml += "UV Index: <span class='uv-rating'>" + currentUvi + "</span>";
                        currentHtml += '</div>';

                    currentHtml += '</div>';


                    currentHtml += '<div class="forecast-weather-container">';

                        currentHtml += '<h3 class="five-day-forecast-title">5-day Forecast:</h3>';

                        currentHtml += '<div class="forecast-weather-tile-container">';

                        // # Loop: Through next five day data and add in tiles
                        for( var nextDays = 1, totalForecastDays = 5; nextDays <= totalForecastDays; nextDays++ ) {
                            
                            // # Define: Next Day Data
                            var nextDayData = data.daily[ nextDays ];

                            // console.log( nextDayData );

                            // # Define: Date from timestamp
                            var nextDayDate = new Date( nextDayData.dt * 1000 );
                            var formattedNextDayDate = nextDayDate.getDate() + '/' + ("0" + (nextDayDate.getMonth()+1)).slice(-2) + '/' + nextDayDate.getFullYear();

                            // # Append: Tile Wrapper
                            currentHtml += '<div class="forecast-weather-tile weather-tile-day">';

                                // # Append: Forecast Date
                                currentHtml += '<div class="forecast-weather-date forecast-weather-tile-block">' + formattedNextDayDate + "</div>";

                                // # Append: Forecast Weather Icon
                                currentHtml += '<div class="forecast-weather-icon forecast-weather-tile-block">';
                                    currentHtml += '<img class="forecast-weather-icon" src="http://openweathermap.org/img/w/' + nextDayData.weather[0].icon + '.png" />';
                                currentHtml += "</div>";

                                // # Append: Min Forecast Temperature
                                currentHtml += '<div class="forecast-weather-temp forecast-weather-tile-block">Min. Temp: ' + nextDayData.temp.min + "℃</div>";

                                // # Append: Max Forecast Temperature
                                currentHtml += '<div class="forecast-weather-temp forecast-weather-tile-block">Max Temp: ' + nextDayData.temp.max + "℃</div>";

                                // # Append: Forecast Wind
                                currentHtml += '<div class="forecast-weather-wind forecast-weather-tile-block">Wind: ' + nextDayData.wind_speed + "km/h</div>";

                                // # Append: Forecast Humidity
                                currentHtml += '<div class="forecast-weather-wind forecast-weather-tile-block">Humidity: ' + nextDayData.humidity + " %</div>";

                            currentHtml += '</div>';
                        }

                        currentHtml += '</div>';

                    currentHtml += '</div>';

                // # Set: Content to dynamic html generated from API
                var columnContentEl = document.querySelector('.column-content.weather-data');
                columnContentEl.innerHTML = currentHtml;

                // console.log( currentHtml );
                // console.log( currentCity );
                // console.log( dailyData );

                // # Define: Current City/User Input City based on calls
                // if( typeof cityName !== null ) {
                //     // # Store: User Input City
                //     var cityApi = cityName;
                // } else {
                //     // # Store: GeoLocated City
                //     var cityApi = currentCity;
                // }

                // # ^^^ Ternary Style of coding for the above
                // var cityApi = typeof cityName !== null ? cityName : currentCity;


                // # Get: Previous Cities stored in LocalStorage
                var previousSearchedCities = localStorage.getItem('weatherCitySearches') != null && localStorage.getItem('weatherCitySearches') != "" ? JSON.parse( localStorage.getItem('weatherCitySearches') ) : [];

                // # Sanity-Check: Ensure that it hasn't exceed 10 cities in storage;
                
                // # Use-case: Has exceeded remove the first

                // console.log('Type of previousSearchedCities', typeof previousSearchedCities, previousSearchedCities);

                // # Create: Data-set for putting into LocalStorage
                var localStorageDataset = {
                    cityName: cityName,
                    coord: {
                        lat: ajaxData.lat,
                        lon: ajaxData.lon,
                    },
                    countryCode: countryCode
                };

                // # Sanity-Check: Ensure city does not pop up in list twice
                var currentCityStored = false;
                for( var storedCity = 0, totalStoredCities = previousSearchedCities.length; storedCity < totalStoredCities; storedCity++ ) {

                    // # Define: Current City to Check 
                    var currentCityToCheck = previousSearchedCities[ storedCity ];
                    
                    // # Matched: Set Current City to be found, prevent from doubling up
                    if( 
                        currentCityToCheck.cityName == cityName &&
                        currentCityToCheck.countryCode == countryCode
                    ) {
                        currentCityStored = true;
                        break;
                    }

                }

                if( currentCityStored === false ) {
                    previousSearchedCities.push( localStorageDataset );

                    if( previousSearchedCities.length >= 10 ) {
                        previousSearchedCities.shift();
                    }
                }

                // # Store: City into LocalStorage
                localStorage.setItem('weatherCitySearches', JSON.stringify( previousSearchedCities ) );

                // # Invoke: retrievePreviousSearchedCities() on-page load.
                retrievePreviousSearchedCities();
                
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
    // console.log(userInput);
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



