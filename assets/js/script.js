

// # Define: API Key
var APIKey ="516f024af358e0fecf2a43dd16d78077";

/**
*   Retrieve: Current Geo-Location/IP
*/
var openWeatherMap = 'http://api.openweathermap.org/data/2.5/weather';
var weatherMapApiForecast = 'https://api.openweathermap.org/data/2.5/onecall';

//  ?lat={lat}&lon={lon}&exclude={part}&appid={API key}

if (window.navigator && window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(function(position) {
        $.ajax({
            url: weatherMapApiForecast,
            method: "GET",
            data: {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                units: 'metric',
                APPID: APIKey
            },
            dataType: "JSON",
            success: function( data ) {
                console.log( data );
                
                var weatherData =  data;
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

            }
        })

        // $.getJSON(openWeatherMap, {
        //     lat: position.coords.latitude,
        //     lon: position.coords.longitude,
        //     units: 'metric',
        //     APPID: APIKey
        // }).done(function(weather) {
        //     console.log(weather)
        // })
    })
}