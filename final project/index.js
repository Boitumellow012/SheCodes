const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const currentCity = document.querySelector("#current-city");
const currentDate = document.querySelector("#current-date");
const weatherDescription = document.querySelector("#weather-description");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const weatherIcon = document.querySelector("#weather-icon");
const currentTemperature = document.querySelector("#current-temperature");
const forecastElement = document.querySelector("#forecast");
const currentLocationBtn = document.querySelector(".current-location-btn");

let celsiusTemperature = null;

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${hours}:${minutes}`;
}

function displayCurrentWeather(response) {
  celsiusTemperature = Math.round(response.data.temperature.current);

  currentCity.textContent = response.data.city;
  currentDate.textContent = formatDate(response.data.time * 1000);
  weatherDescription.textContent = response.data.condition.description;
  humidity.textContent = `${response.data.temperature.humidity}%`;
  windSpeed.textContent = `${Math.round(response.data.wind.speed)} km/h`;
  currentTemperature.textContent = celsiusTemperature;
  weatherIcon.setAttribute("src", response.data.condition.icon_url);
  weatherIcon.setAttribute("alt", response.data.condition.description);
}

function displayForecast(response) {
  const forecastDays = response.data.daily.slice(1, 6); 
  let forecastHTML = '<div class="forecast-container">';

  forecastDays.forEach((day) => {
    const forecastDate = new Date(day.time * 1000);
    const dayName = forecastDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const maxTemp = Math.round(day.temperature.maximum);
    const minTemp = Math.round(day.temperature.minimum);

    forecastHTML += `
            <div class="forecast-day">
                <div class="forecast-day-name">${dayName}</div>
                <img src="${day.condition.icon_url}" alt="${day.condition.description}" class="forecast-icon">
                <div class="forecast-temperatures">
                    <span class="forecast-max">${maxTemp}°</span>
                    <span class="forecast-min">${minTemp}°</span>
                </div>
            </div>
        `;
  });

  forecastHTML += "</div>";
  forecastElement.innerHTML = forecastHTML;
}

function searchCity(city) {
  const apiKey = "b2a5adcct04b33178913oc335f405433";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(displayCurrentWeather)
    .catch((error) => {
      console.error("Error fetching current weather:", error);
      alert("City not found. Please try another location.");
    });

  const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios
    .get(forecastUrl)
    .then(displayForecast)
    .catch((error) => {
      console.error("Error fetching forecast:", error);
    });
}

function handleSubmit(event) {
  event.preventDefault();
  const city = searchInput.value.trim();
  if (city) {
    searchCity(city);
    searchInput.value = "";
  }
}

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = "b2a5adcct04b33178913oc335f405433";
        const apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;

        axios
          .get(apiUrl)
          .then((response) => {
            displayCurrentWeather(response);
            const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;
            return axios.get(forecastUrl);
          })
          .then(displayForecast)
          .catch((error) => {
            console.error("Error fetching weather:", error);
            alert("Unable to retrieve weather data for your location.");
          });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert(
          "Unable to retrieve your location. Please enable location services or search for a city."
        );
      }
    );
  } else {
    alert(
      "Geolocation is not supported by your browser. Please search for a city."
    );
  }
}

searchForm.addEventListener("submit", handleSubmit);
currentLocationBtn.addEventListener("click", getCurrentLocationWeather);

searchCity("Paris");
