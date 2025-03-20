let isCelsius = true; // Temperature unit flag (Celsius by default)

async function suggestLocations() {
    const query = document.getElementById('location').value;
    if (query.length < 2) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }
    
    const apiKey = "31a8db7067e546ab87a151349252003";
    const url = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        let suggestionsHTML = '';
        data.forEach(location => {
            suggestionsHTML += `<div onclick="selectLocation('${location.name}')">${location.name}, ${location.country}</div>`;
        });
        
        document.getElementById('suggestions').innerHTML = suggestionsHTML;
    } catch (error) {
        console.error("Error fetching location suggestions", error);
    }
}

function selectLocation(name) {
    document.getElementById('location').value = name;
    document.getElementById('suggestions').innerHTML = '';
}

async function getWeather() {
    const location = document.getElementById('location').value;
    if (!location) {
        alert("Please enter a location");
        return;
    }
    
    const apiKey = "31a8db7067e546ab87a151349252003";
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Location not found");
        }
        
        const data = await response.json();
        
        // Show current weather
        document.getElementById('weatherInfo').innerHTML = `
            <h3>${data.location.name}, ${data.location.country}</h3>
            <p><img src="http:${data.current.condition.icon}" class="icon" alt="weather-icon"> ${data.current.condition.text}</p>
            <p>🌡️ Temperature: ${isCelsius ? data.current.temp_c : data.current.temp_f}°${isCelsius ? 'C' : 'F'}</p>
            <p>💧 Humidity: ${data.current.humidity}%</p>
            <p>💨 Wind Speed: ${data.current.wind_kph} kph</p>
        `;
        
        // Show 7-day forecast
        const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        let forecastHTML = '';
        forecastData.forecast.forecastday.forEach(day => {
            forecastHTML += `
                <div>
                    <img src="http:${day.day.condition.icon}" class="icon" alt="weather-icon">
                    <p>${day.date}</p>
                    <p>${isCelsius ? day.day.avgtemp_c : day.day.avgtemp_f}°${isCelsius ? 'C' : 'F'}</p>
                </div>
            `;
        });
        document.getElementById('forecast').innerHTML = forecastHTML;
    } catch (error) {
        alert(error.message);
    }
}

function toggleTemperatureUnit() {
    isCelsius = !isCelsius; // Toggle between Celsius and Fahrenheit
    getWeather(); // Re-fetch the weather data with the updated unit
}