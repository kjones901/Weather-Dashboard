var cityForm = document.getElementById("city-form");
var cityInput;

cityForm.addEventListener("submit", function (event) {
  event.preventDefault();
  cityInput = document.getElementById("city-input").value;
  getLatLon();
});

function getLatLon() {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
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
    });
}

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
      console.log(data);
      for (var i = 0; i < 40; i += 8) {
        console.log(i, data.list[i]);
      }
    });
}

function saveCityData(city) {
  var cityData = JSON.parse(localStorage.getItem("cityData")) || [];

  cityData.push(city);

  localStorage.setItem("cityData", JSON.stringify(cityData));
}

function createHistoryButton(city) {
  var historyButton = document.createElement("li");
  historyButton.classList.add("history-button");
  historyButton.textContent = city.name;
  historyButton.id = "button-" + city.name;
  historyButton.style.cursor = "pointer";
  historyButton.style.color = "darkgreen";
  historyButton.addEventListener("click", function (event) {
    event.preventDefault();
    var buttonId = historyButton.id;
    getHistory();
    console.log(buttonId);
  });
  document.getElementById("city-history").appendChild(historyButton);
}

function loadFromLocalStorage() {
  var cityData = JSON.parse(localStorage.getItem("cityData")) || [];
  for (let i = 0; i < cityData.length; i++) {
    createHistoryButton(cityData[i]);
  }
}

function getHistory() {
  console.log("clicky");
}

loadFromLocalStorage();
