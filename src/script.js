// Search engine
let apiKey = "c6cb65a19d9148cf4b429a8260e0f527";

// Show current date and time
function showCurrentDate() {
  let now = new Date();
  let day = now.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  day = days[day];
  let date = now.getDate();
  if (date < 10) {
    date = `0${date}`;
  }
  let month = now.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let year = now.getFullYear();
  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let currentTime = document.querySelector(".current-date-time");
  currentTime.innerHTML = `${day}, ${date}.${month}.${year} ${hour}:${minutes}`;
}
showCurrentDate();

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function searchCity(city) {
  let apiUrlCity = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  axios.get(apiUrlCity).then(showPosition);

  function showPosition(response) {
    let latitude = response.data[0].lat;
    let longitude = response.data[0].lon;
    let apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrlWeather).then(showWeather);
  }
  axios.get(apiUrlCity).then(showCity);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city").value;
  searchCity(city);
}
function showCity(response) {
  document.querySelector("#current-city").innerHTML = response.data[0].name;
}

// Show city on load
function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(forecast);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if ((index < 6) & (index !== 0)) {
      forecastHTML += `<div class="col card forecast">
          <div class="card-body">
          <p class="card-title forecast-day">${formatDay(forecastDay.dt)}</p>
          <img src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" class="weather-emoji" width="42" />
          <p class="card-text day">
          <i class="bi bi-sun"></i>${Math.round(
            forecastDay.temp.max
          )}°</p><p class="card-text night"><i class="bi bi-moon-fill"></i> ${Math.round(
        forecastDay.temp.min
      )}°</p></div></div>`;
    }
    console.log(forecastDay);
    forecastElement.innerHTML = forecastHTML;
  });
}

searchCity("Kyiv");

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  let wind = Math.round(response.data.wind.speed);
  document.querySelector("#wind").innerHTML = `${wind} m/s`;

  let humidity = response.data.main.humidity;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;

  let weatherEmojiElement = document.querySelector("#current-weather-emoji");
  let weatherEmoji = response.data.weather[0].icon;
  weatherEmojiElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weatherEmoji}@2x.png`
  );
  weatherEmojiElement.setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  console.log(response.data);

  getForecast(response.data.coord);
}

// Find out the searching city
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

// Current button - current geolocation

function searchCurrentLocation(event) {
  event.preventDefault();
  function handlePosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiUrlCity = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    let apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrlWeather).then(showWeather);
    axios.get(apiUrlCity).then(showCity);
  }
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", searchCurrentLocation);

// temperature conversion
let currentTemperatureCelsius = document.querySelector("#celsius");
currentTemperatureCelsius.addEventListener("click", toCelsius);
let currentTemperatureFahrenheit = document.querySelector("#fahrenheit");
currentTemperatureFahrenheit.addEventListener("click", toFahrenheit);
let currentTemperature = document.querySelector(".current-temperature");

function toFahrenheit(degreesCelsius) {
  let degrees = parseInt(currentTemperature.innerHTML);
  if (
    currentTemperatureFahrenheit.classList.contains("active-degrees") === false
  ) {
    currentTemperatureFahrenheit.classList.add("active-degrees");
    currentTemperatureCelsius.classList.remove("active-degrees");

    return (currentTemperature.innerHTML = Math.round((degrees * 9) / 5 + 32));
  } else {
    return;
  }
}

function toCelsius(degreesFahrenheit) {
  let degrees = parseInt(currentTemperature.innerHTML);
  if (
    currentTemperatureCelsius.classList.contains("active-degrees") === false
  ) {
    currentTemperatureCelsius.classList.add("active-degrees");
    currentTemperatureFahrenheit.classList.remove("active-degrees");
    return (currentTemperature.innerHTML = Math.round(
      ((degrees - 32) * 5) / 9
    ));
  } else {
    return;
  }
}
