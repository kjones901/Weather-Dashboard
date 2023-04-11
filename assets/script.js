var cityForm = document.getElementById("city-form");
var cityInput;
var weatherData = [];
var cityTitle = document.getElementById("city-name");

//this takes the input of the user and saves it as a variable to be used by future functions.
cityForm.addEventListener("submit", function (event) {
  event.preventDefault();
  cityInput = document.getElementById("city-input").value;
  getLatLon();
});

//this takes the user inputed city name and fetchs the latitude and longitude.
//it creates a variable called city that logs the name,lat,&lon that is used as parameters in future functions.
function getLatLon() {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      cityInput +
      "&limit=1&appid=fe875364d73fc24b0907b9330ffdd475&units=imperial"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var city = {
        name: data[0].name,
        lat: data[0].lat,
        lon: data[0].lon,
      };
      getWeather(city.lat, city.lon);
      saveCityData(city);
      createHistoryButton(city);
      cityTitle.innerHTML = data[0].name;
    });
}

//this takes the lat and lon from getLatLon and fetches the 5 day weather forecast from openweathermap.org
//it saves the data in an array and calls displayWeather.
function getWeather(lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=fe875364d73fc24b0907b9330ffdd475&units=imperial"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      weatherData = data.list;
      displayWeather();
    });
}

//this stores the city variable created by getlatlon in local storage.
function saveCityData(city) {
  var cityData = JSON.parse(localStorage.getItem("cityData")) || [];
  cityData.push(city);
  localStorage.setItem("cityData", JSON.stringify(cityData));
}

//this creates clickable buttons in the DOM that can be used to recall data from local storage.
function createHistoryButton(city) {
  var historyButton = document.createElement("li");
  historyButton.classList.add("history-button");
  historyButton.textContent = city.name;
  historyButton.id = "button-" + city.name;
  historyButton.style.cursor = "pointer";
  historyButton.style.color = "darkgreen";
  historyButton.style.paddingLeft = "10px";
  historyButton.addEventListener("click", function (event) {
    event.preventDefault();
    displayFromLocal(city.name);
  });
  document.getElementById("city-history").appendChild(historyButton);
}

//this loads local storage and sends the data to the creatHistoryButton function.
function loadFromLocalStorage() {
  var cityData = JSON.parse(localStorage.getItem("cityData")) || [];
  for (let i = 0; i < cityData.length; i++) {
    createHistoryButton(cityData[i]);
  }
}

//this grabs the elements in HTML and edits their contents to display the data pulled by getWeather from openweather's api.
//using a single for loop it goes through the the html elements as well as the data in the weatherData array.
//it rotates through the weatherData in increments of 8 because each object is broken into 3hr time blocks, so each 8th block will be 24hrs later.
function displayWeather() {
  for (var i = 0; i <= 4; i++) {
    var dispTemp = document.getElementById("today+" + [i] + "-temp");
    dispTemp.innerHTML = weatherData[i * 8].main.temp;
    var dispCond = document.getElementById("today+" + [i] + "-conditions");
    dispCond.innerHTML = weatherData[i * 8].weather[0].main;
    var dispWind = document.getElementById("today+" + [i] + "-wind");
    dispWind.innerHTML = weatherData[i * 8].wind.speed;
    var dispHumidity = document.getElementById("today+" + [i] + "-humidity");
    dispHumidity.innerHTML = weatherData[i * 8].main.humidity;
  }
}

//this pulls the information from local storage to update the title with the city name and run getWeather with the saved lat & lon.
function displayFromLocal(city) {
  var cityData = JSON.parse(localStorage.getItem("cityData"));
  for (var i = 0; i < cityData.length; i++) {
    if (cityData[i].name === city) {
      var lat = cityData[i].lat;
      var lon = cityData[i].lon;
      getWeather(lat, lon);
      cityTitle.innerHTML = city;
    }
  }
}

//this clears local storage and deletes the buttons created in the history.
function clearLocalStorage(event) {
  event.preventDefault();
  localStorage.clear();
  var historyButtons = document.querySelectorAll(".history-button");
  for (let i = 0; i < historyButtons.length; i++) {
    historyButtons[i].remove();
  }
}

//this calls clearLocalStorage.
document.getElementById("clear-button").addEventListener("click", clearLocalStorage);

loadFromLocalStorage();
