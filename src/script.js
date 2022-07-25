// Search engine
let apiKey = "c6cb65a19d9148cf4b429a8260e0f527";

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
searchCity("Kyiv");

function showWeather(response) {
  let wind = Math.round(response.data.wind.speed);
  document.querySelector("#wind").innerHTML = `${wind} m/s`;

  let humidity = response.data.main.humidity;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;

  let weatherEmojiElement = document.querySelector("#current-weather-emoji");
  let weatherEmoji = response.data.weather[0].icon;
  weatherEmojiElement.src = `https://openweathermap.org/img/wn/${weatherEmoji}@2x.png`;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
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

    return (currentTemperature.innerHTML = degrees =
      Math.round((degrees * 9) / 5 + 32));
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
    return (currentTemperature.innerHTML = degrees =
      Math.round(((degrees - 32) * 5) / 9));
  } else {
    return;
  }
}

// let weatherArray = Object.keys(weather);

// if (weatherArray.includes(inputCity.value)) {
//   console.log(
//     `It is currently ${Math.round(weather[city].temp)}°C (${
//       (Math.round(weather[city].temp) * 9) / 5 + 32
//     }°F) in ${city} with a humidity of ${weather[city].humidity}%`
//   );
// } else {
//   console.log(
//     `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${city}`
//   );
// }

// Show current date and time
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
