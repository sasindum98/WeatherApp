function searchBtnOnAction() {
    const userInput = document.getElementById("userInput").value;

    console.log(userInput);

    searchData(userInput);
    getLast5DaysForecast(userInput);
    dayForecast(userInput)
    getnext7day(userInput)

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


        })

}
function getnext7day(userInput) {

    let fConditionIcon1 = document.getElementById("fConditionIcon1")
    let fConditionIcon2 = document.getElementById("fConditionIcon2")
    let fConditionIcon3 = document.getElementById("fConditionIcon3")
    let fConditionIcon4 = document.getElementById("fConditionIcon4")
    let fConditionIcon5 = document.getElementById("fConditionIcon5")
    let fConditionIcon6 = document.getElementById("fConditionIcon6")
    let fConditionIcon7 = document.getElementById("fConditionIcon7")
    let fFeel1 = document.getElementById("fFeel1")
    let fFeel2 = document.getElementById("fFeel2")
    let fFeel3 = document.getElementById("fFeel3")
    let fFeel4 = document.getElementById("fFeel4")
    let fFeel5 = document.getElementById("fFeel5")
    let fFeel6 = document.getElementById("fFeel6")
    let fFeel7 = document.getElementById("fFeel7")


    const today = new Date();

    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const formattedDate = date.toISOString().split('T')[0];
        const dayElement = document.getElementById(`fDay${i}`);
        dayElement.innerText = date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=0d6a73dda4df492095472525240309&q=${userInput}&days=8`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {

            fConditionIcon1.src = `https:${data.forecast.forecastday[1].day.condition.icon}`;
            fConditionIcon2.src = `https:${data.forecast.forecastday[2].day.condition.icon}`;
            fConditionIcon3.src = `https:${data.forecast.forecastday[3].day.condition.icon}`;
            fConditionIcon4.src = `https:${data.forecast.forecastday[4].day.condition.icon}`;
            fConditionIcon5.src = `https:${data.forecast.forecastday[5].day.condition.icon}`;
            fConditionIcon6.src = `https:${data.forecast.forecastday[6].day.condition.icon}`;
            fConditionIcon7.src = `https:${data.forecast.forecastday[7].day.condition.icon}`;
            fFeel1.innerText = `${data.forecast.forecastday[1].day.condition.text}`;
            fFeel2.innerText = `${data.forecast.forecastday[2].day.condition.text}`;
            fFeel3.innerText = `${data.forecast.forecastday[3].day.condition.text}`;
            fFeel4.innerText = `${data.forecast.forecastday[4].day.condition.text}`;
            fFeel5.innerText = `${data.forecast.forecastday[5].day.condition.text}`;
            fFeel6.innerText = `${data.forecast.forecastday[6].day.condition.text}`;
            fFeel7.innerText = `${data.forecast.forecastday[7].day.condition.text}`;

        })

}
