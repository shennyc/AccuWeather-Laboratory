document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "E5rUY8hAzh2UGx20KUA62iwNkEs1cuPy"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const forecastDiv = document.getElementById("forecast");
    const hourlyDiv = document.getElementById("hourly");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchDailyWeather(locationKey); // Fetch daily weather
                    fetchHourlyWeather(locationKey); // Fetch hourly weather
                } else {
                    weatherDiv.innerHTML = "<p>City not found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = "<p>Error fetching location data.</p>";
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = "<p>No current weather data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = "<p>Error fetching weather data.</p>";
            });
    }

    function fetchDailyWeather(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&language=en`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyWeather(data.DailyForecasts);
                } else {
                    forecastDiv.innerHTML = "<p>No daily weather data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching daily weather data:", error);
                forecastDiv.innerHTML = "<p>Error fetching daily weather data.</p>";
            });
    }

    function fetchHourlyWeather(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyWeather(data);
                } else {
                    hourlyDiv.innerHTML = "<p>No hourly weather data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching hourly weather data:", error);
                hourlyDiv.innerHTML = "<p>Error fetching hourly weather data.</p>";
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const icon = data.WeatherIcon < 10 ? `0${data.WeatherIcon}` : data.WeatherIcon;
        const iconUrl = `https://developer.accuweather.com/sites/default/files/${icon}-s.png`;
        const weatherContent = `
            <h2>Current Weather</h2>
            <img src="${iconUrl}" alt="${weather}">
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayDailyWeather(dailyForecasts) {
        const dailyContent = dailyForecasts.map(day => {
            const date = new Date(day.Date).toLocaleDateString();
            const minTemp = day.Temperature.Minimum.Value;
            const maxTemp = day.Temperature.Maximum.Value;
            const weather = day.Day.IconPhrase;
            const icon = day.Day.Icon < 10 ? `0${day.Day.Icon}` : day.Day.Icon;
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${icon}-s.png`;
            return `
                <div class="forecast-day">
                    <h3>${date}</h3>
                    <img src="${iconUrl}" alt="${weather}">
                    <p>Min Temperature: ${minTemp}°C</p>
                    <p>Max Temperature: ${maxTemp}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        }).join('');

        forecastDiv.innerHTML = `<h2>5-Day Forecast</h2>${dailyContent}`;
    }

    function displayHourlyWeather(hourlyForecasts) {
        const hourlyContent = hourlyForecasts.map(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString();
            const temp = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            const icon = hour.WeatherIcon < 10 ? `0${hour.WeatherIcon}` : hour.WeatherIcon;
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${icon}-s.png`;
            return `
                <div class="forecast-hour">
                    <h3>${time}</h3>
                    <img src="${iconUrl}" alt="${weather}">
                    <p>Temperature: ${temp}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        }).join('');

        hourlyDiv.innerHTML = `<h2>12-Hour Forecast</h2>${hourlyContent}`;
    }
});