document.addEventListener('DOMContentLoaded', function () {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBI6DvFkDhuZQsgxpNfYJpcWCau20dpi8A&callback=initializeApp`;
    script.async = true;
    document.head.appendChild(script);

});

let map;
let latitude = 0;
let longitude = 0;

function initializeApp() {
    initMap();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            showPosition,
            showError,
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}



function initMap(lat, lng) {
    map = new google.maps.Map(document.getElementById('map-container'), {
        center: { lat: lat, lng: lng },
        zoom: 16
    });

    // Add marker for current location
    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: 'Current Location'
    });
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);

    // Initialize map with current location
    initMap(latitude, longitude);

    // Update  weather-related functions
    updateMap(latitude, longitude);

    const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            if (data.display_name) {
                const fullAddress = data.display_name;
                const firstPart = fullAddress.split(' - ')[0];
                console.log("Current location:", firstPart);


                searchData(firstPart);
                dayForecast(firstPart);
                getLast5DaysForecast(firstPart);
                getnext2days(firstPart);
            } else {
                console.error("Error fetching location name: No result");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });


}

function updateMap(lat, lng) {
    if (map) {
        const location = new google.maps.LatLng(lat, lng);
        map.setCenter(location);

        // Remove previous marker if exists
        if (window.currentMarker) {
            window.currentMarker.setMap(null);
        }

        // Add new marker
        window.currentMarker = new google.maps.Marker({
            position: location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: "Your Location"
        });
    }
}
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            // Fallback to a default location if geolocation fails
            initMap(0, 0); // Default to 0,0 or a specific default location
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            initMap(0, 0);
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            initMap(0, 0);
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            initMap(0, 0);
            break;
    }
}

function searchBtnOnAction() {
    const userInput = document.getElementById("userInput").value;

    console.log(userInput);
    fetch(`https://api.weatherapi.com/v1/current.json?key=0d6a73dda4df492095472525240309&q=${userInput}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            // Get coordinates from the API response
            const lat = data.location.lat;
            const lng = data.location.lon;

            // Update map with the searched location
            updateMap(lat, lng);

            // Continue with other API calls for weather data
            searchData(userInput);
            getLast5DaysForecast(userInput);
            dayForecast(userInput);
            getnext2days(userInput);
        })
        .catch(error => {
            console.error("Error fetching location coordinates:", error);
            // If there's an error, still try to get weather data
            searchData(userInput);
            getLast5DaysForecast(userInput);
            dayForecast(userInput);
            getnext2days(userInput);
        });

}

function searchData(userInput) {
    let locationName = document.getElementById("locationName");
    let temp = document.getElementById("temp");
    let conditionIcon = document.getElementById("conditionIcon");
    let cCondition = document.getElementById("cCondition");
    let wind = document.getElementById("wind");
    let humidity = document.getElementById("humidity");
    let uvIndex = document.getElementById("uvIndex");
    let wDirection = document.getElementById("wDirection");
    let localTime = document.getElementById("localTime");
    let iconElement = document.getElementById("lconditionIcon1");


    //currrent forecast
    fetch(`https://api.weatherapi.com/v1/current.json?key=0d6a73dda4df492095472525240309&q=${userInput}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            locationName.innerText = `${data.location.name} / ${data.location.country}`;
            temp.innerText = `${data.current.temp_c}°C / ${data.current.temp_f}°F`;
            conditionIcon.src = `https:${data.current.condition.icon}`;
            cCondition.innerText = data.current.condition.text;
            wind.innerText = `${data.current.wind_mph}mph /${data.current.wind_kph}kph`;
            humidity.innerText = data.current.humidity;
            uvIndex.innerText = data.current.uv;
            wDirection.innerText = data.current.wind_degree;
            localTime.innerText = data.location.localtime;


        })

}

function getLast5DaysForecast(userInput) {
    const today = new Date();

    for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];

        fetch(`https://api.weatherapi.com/v1/history.json?key=0d6a73dda4df492095472525240309&q=${userInput}&dt=${formattedDate}`)
            .then(response => response.json())
            .then(data => {
                const dayElement = document.getElementById(`lday${i}`);
                const lconditionIcon = document.getElementById(`lconditionIcon${i}`);
                const conditionElement = document.getElementById(`condition${i}`);
                if (data.forecast && data.forecast.forecastday[0]) {
                    const weatherData = data.forecast.forecastday[0].day;
                    dayElement.innerText = date.toLocaleDateString('en-US', { weekday: 'short' });
                    lconditionIcon.src = `https:${weatherData.condition.icon}`;
                    lconditionIcon.alt = weatherData.condition.text;
                    conditionElement.innerText = weatherData.condition.text;
                } else {
                    console.error(`No data available for ${formattedDate}`);
                }
            })
            .catch(error => {
                console.error(`Error fetching data for ${formattedDate}:`, error);
            });

    }
}
function dayForecast(userInput) {

    let sixamtemp = document.getElementById("sixamtemp");
    let nineamtemp = document.getElementById("nineamtemp");
    let twlpmtemp = document.getElementById("twlpmtemp");
    let threepmtemp = document.getElementById("threepmtemp");
    let sixpmtemp = document.getElementById("sixpmtemp");
    let ninepmtemp = document.getElementById("ninepmtemp");
    let conditionIcon1 = document.getElementById("conditionIcon1");
    let conditionIcon2 = document.getElementById("conditionIcon2");
    let conditionIcon3 = document.getElementById("conditionIcon3");
    let conditionIcon4 = document.getElementById("conditionIcon4");
    let conditionIcon5 = document.getElementById("conditionIcon5");
    let conditionIcon6 = document.getElementById("conditionIcon6");
    let averageTemp = document.getElementById("averageTemp");
    let chanceRain = document.getElementById("chanceRain");

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=0d6a73dda4df492095472525240309&q=${userInput}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })

        .then(data => {

            sixamtemp.innerText = `${data.forecast.forecastday[0].hour[6].temp_c}°C`
            nineamtemp.innerText = `${data.forecast.forecastday[0].hour[9].temp_c}°C`
            twlpmtemp.innerText = `${data.forecast.forecastday[0].hour[12].temp_c}°C`
            threepmtemp.innerText = `${data.forecast.forecastday[0].hour[15].temp_c}°C`
            sixpmtemp.innerText = `${data.forecast.forecastday[0].hour[18].temp_c}°C`
            ninepmtemp.innerText = `${data.forecast.forecastday[0].hour[21].temp_c}°C`
            conditionIcon1.src = `https:${data.forecast.forecastday[0].hour[6].condition.icon}`;
            conditionIcon2.src = `https:${data.forecast.forecastday[0].hour[9].condition.icon}`;
            conditionIcon3.src = `https:${data.forecast.forecastday[0].hour[12].condition.icon}`;
            conditionIcon4.src = `https:${data.forecast.forecastday[0].hour[15].condition.icon}`;
            conditionIcon5.src = `https:${data.forecast.forecastday[0].hour[18].condition.icon}`;
            conditionIcon6.src = `https:${data.forecast.forecastday[0].hour[21].condition.icon}`;
            averageTemp.innerText = `${data.forecast.forecastday[0].day.avgtemp_c}°C / ${data.forecast.forecastday[0].day.avgtemp_f}°F`;
            chanceRain.innerText = data.forecast.forecastday[0].day.daily_chance_of_rain;



        })

}
function getnext2days(userInput) {
    let fConditionIcon1 = document.getElementById("fConditionIcon1");
    let fConditionIcon2 = document.getElementById("fConditionIcon2");

    let fFeel1 = document.getElementById("fFeel1");
    let fFeel2 = document.getElementById("fFeel2");
    let fAvgTemp1 = document.getElementById("fAvgTemp1");
    let fAvgTemp2 = document.getElementById("fAvgTemp2");

    let nWind1 = document.getElementById("nWind1");
    let nHumidity1 = document.getElementById("nHumidity1");
    let nUvIndex1 = document.getElementById("nUvIndex1");
    let wCofRain1 = document.getElementById("wCofRain1");

    let nWind2 = document.getElementById("nWind2");
    let nHumidity2 = document.getElementById("nHumidity2");
    let nUvIndex3 = document.getElementById("nUvIndex3");
    let wCofRain2 = document.getElementById("wCofRain2");

    const today = new Date();

    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const formattedDate = date.toISOString().split('T')[0];
        const dayElement = document.getElementById(`fDay${i}`);
        if (dayElement) {
            dayElement.innerText = date.toLocaleDateString('en-US', { weekday: 'short' });
        }
    }

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=0d6a73dda4df492095472525240309&q=${userInput}&days=3`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Network response was not ok: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("Full forecast data:", data);




            fConditionIcon1.src = `https:${data.forecast.forecastday[1].day.condition.icon}`;
            fConditionIcon2.src = `https:${data.forecast.forecastday[2].day.condition.icon}`;


            fFeel1.innerText = data.forecast.forecastday[1].day.condition.text;
            fFeel2.innerText = data.forecast.forecastday[2].day.condition.text;


            fAvgTemp1.innerText = `${data.forecast.forecastday[1].day.avgtemp_c}°`;
            fAvgTemp2.innerText = `${data.forecast.forecastday[2].day.avgtemp_c}°`;

            nWind1.innerText = `${data.forecast.forecastday[1].day.maxwind_kph}kph`;
            nHumidity1.innerText = data.forecast.forecastday[1].day.avghumidity;
            nUvIndex1.innerText = data.forecast.forecastday[1].day.uv;
            wCofRain1.innerText = data.forecast.forecastday[1].day.daily_chance_of_rain;

            nWind2.innerText = `${data.forecast.forecastday[2].day.maxwind_kph}kph`;
            nHumidity2.innerText = data.forecast.forecastday[2].day.avghumidity;
            nUvIndex2.innerText = data.forecast.forecastday[2].day.uv;
            wCofRain2.innerText = data.forecast.forecastday[2].day.daily_chance_of_rain;





        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });


    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success function
                showPosition,
                // Error function
                null,
                // Options. See MDN for details.
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
        showPosition(position);
        showError(error);
        showPositionOnMap(position);
    }

    function showPosition(position) {
        x.innerHTML = "Latitude: " + position.coords.latitude +
            "<br>Longitude: " + position.coords.longitude;

    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred."
                break;
        }
    }
    function showPositionOnMap(position) {
        var latlon = position.coords.latitude + "," + position.coords.longitude;

        var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=14&size=400x300&sensor=false";

        document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
    }

}

