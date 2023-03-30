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
      var lat = data[0].lat;
      var lon = data[0].lon;
      storeCityData(lat, lon);
    });
}

function storeCityData(lat, lon) {
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
      var cityData = JSON.parse(localStorage.getItem("cityData")) || [];

      var newCityData = {
        name: data.city.name,
        temp: data.list[0].main.temp,
        humidity: data.list[0].main.humidity,
        weather: data.list[0].weather[0].main,
        windSpeed: data.list[0].wind.speed,
      };

      cityData.push(newCityData);
      localStorage.setItem("cityData", JSON.stringify(cityData));
      console.log(data);
      console.log(cityData);
    });
}
