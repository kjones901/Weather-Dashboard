var LatLonUrl =
  "https://api.openweathermap.org/data/2.5/forecast?lat=40.1150133&lon=-111.6547774&appid=fe875364d73fc24b0907b9330ffdd475&units=imperial";

var cityForm = document.getElementById("city-form");
var cityInput;

cityForm.addEventListener("submit", function (event) {
  event.preventDefault();
  cityInput = document.getElementById("city-input").value;
  getCityName();
});

function getCityName() {
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
      getCityLatLon(lat, lon);
    });
}

function getCityLatLon(lat, lon) {
  var LatLonUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=fe875364d73fc24b0907b9330ffdd475&units=imperial";

  fetch(LatLonUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
