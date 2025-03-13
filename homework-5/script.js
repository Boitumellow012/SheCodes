document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");
  const weatherInfo = document.querySelector(".weather-info");
  const forecastItems = document.querySelectorAll(".forecast-item");

  // Sample weather data
  const sampleWeatherData = {
    city: "San Francisco",
    date: "Friday 14:44",
    description: "few clouds",
    humidity: "92%",
    wind: "3.6km/h",
    temperature: "13°C",
    forecast: [
      { day: "Fri", maxTemp: "19°", minTemp: "13°" },
      { day: "Sat", maxTemp: "18°", minTemp: "14°" },
      { day: "Sun", maxTemp: "18°", minTemp: "14°" },
      { day: "Mon", maxTemp: "17°", minTemp: "13°" },
      { day: "Tue", maxTemp: "16°", minTemp: "14°" },
    ],
  };

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = searchInput.value;

    if (city) {
      // Update weather info
      updateWeatherInfo(sampleWeatherData);
    }
  });

  // Function to update weather info
  function updateWeatherInfo(data) {
    // Update city name and weather details
    weatherInfo.querySelector(".info-left h1").textContent = data.city;
    weatherInfo.querySelector(".info-left ul").innerHTML = `
      <li><span>${data.date}</span>, ${data.description}</li>
      <li>Humidity: <strong>${data.humidity}</strong>, Wind: <strong>${data.wind}</strong></li>
    `;
    weatherInfo.querySelector(".temperature-value").textContent =
      data.temperature;

    // Update forecast
    forecastItems.forEach((item, index) => {
      const forecast = data.forecast[index];
      if (forecast) {
        item.querySelector(".forecast-day").textContent = forecast.day;
        item.querySelector(".temperature-max").textContent = forecast.maxTemp;
        item.querySelector(".temperature-min").textContent = forecast.minTemp;
      }
    });
  }
});
