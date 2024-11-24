const getCity = async (city) => {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
  );
  const cityData = await res.json();
  return cityData;
};

const getWeather = async (latitude, longitude) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
  );
  const weatherData = await res.json();
  return weatherData;
};

document.querySelector("#search-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = document.querySelector("#search-input").value;
  const cityData = await getCity(city);
  const cityName = cityData.results[0].name;
  const country = cityData.results[0].country;
  const timezone = cityData.results[0].timezone;
  const population = cityData.results[0].population;
  const latitude = cityData.results[0].latitude;
  const longitude = cityData.results[0].longitude;

  if (!cityData) {
    alert("City not found");
    return;
  }

  const weatherData = await getWeather(latitude, longitude);

  if (!weatherData) {
    alert("Weather data not found");
    return;
  }

  const temperature = weatherData.current.temperature_2m;
  const forecastMax = weatherData.daily.temperature_2m_max[0];
  const forecastMin = weatherData.daily.temperature_2m_min[0];
  console.log(weatherData);
  console.log(cityData);

  document.querySelector(".weather-info").style.display = "flex";
  document.querySelector(".city-info").style.display = "flex";

  if (weatherData.current.is_day === 0) {
    document.querySelector("#bg-img").src = "./images/night.jpg";
    document.querySelector("body").style.color = "#ffffff";
    document.querySelector("body").style.backgroundColor = "#131314";
  } else {
    document.querySelector("#bg-img").src = "./images/day.jpg";
    document.querySelector("body").style.color = "black";
    document.querySelector("body").style.backgroundColor = "white";
  }

  document.querySelector("#city").textContent = cityName;
  document.querySelector("#temperature").textContent = `${temperature}°C`;

  const tableRows = document.querySelectorAll(".city-info table tr");
  tableRows[0].children[1].textContent = country;
  tableRows[1].children[1].textContent = timezone;
  tableRows[2].children[1].textContent = population;
  document.querySelector("#forecast-min").textContent = `Max: ${forecastMin}°C`;
  document.querySelector("#forecast-max").textContent = `Low: ${forecastMax}°C`;
});
