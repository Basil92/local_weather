var geocoder = new google.maps.Geocoder();
var city = document.getElementById("city");
var kelvin;
var celsius;
var fahrenheit;
var temperature = document.getElementById("temperature");
var sky = document.getElementById("sky");
var skyContainer = document.getElementById("sky-img");

if(navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(usePosition);
}
function usePosition(position) {
	getCity(position.coords.latitude, position.coords.longitude)
	getWeather(position.coords.latitude, position.coords.longitude)
}

function getCity(lat, lng) {
	var latlng = new google.maps.LatLng(lat, lng);
	geocoder.geocode({location: latlng}, function(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
	      	if (results[1]) {
	        	city.innerHTML = (results[1].formatted_address)
	      	} else {
	        	alert("No results found");
	      	}
    	} else {
      		alert("Geocoder failed due to: " + status);
    	}
  	});	
}

function getWeather(lat, lng){
	var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&APPID=69f125837d4e8bbdc989c68b29e19a9f";
	console.log(url)


var xhr = new XMLHttpRequest();

xhr.open('GET', url, true);

xhr.send();

xhr.onreadystatechange = function() {
  var skyStatus;
  if (this.readyState != 4) return;

  // по окончании запроса доступны:
  // status, statusText
  // responseText, responseXML (при content-type: text/xml)

  if (this.status != 200) {
  // обработать ошибку
    alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
    return;
  }
  // получить результат из this.responseText или this.responseXML
  var weatherData = JSON.parse(xhr.responseText);
  kelvin = weatherData.main.temp;
  toCelsius();
  sky.innerHTML = weatherData.weather[0].main;
  skyImg(weatherData.weather[0].icon);  
}
}

function toCelsius() {
  if(kelvin){
    celsius = kelvin - 273.15;
    temperature.innerHTML = Math.round(celsius*100)/100 + " &degC";
    temperature.removeEventListener("click", toCelsius);
    temperature.addEventListener("click", toFahrenheit);
  }
}

function toFahrenheit(degree) {
  if(kelvin){
    fahrenheit = kelvin * 9/5 - 459.67;
    temperature.innerHTML = Math.round(fahrenheit*100)/100 + " &degF";
    temperature.removeEventListener("click", toFahrenheit);
    temperature.addEventListener("click", toKelvin);
  }
}

function toKelvin() {
  if(celsius){
    kelvin = celsius + 273.15;
    temperature.innerHTML = Math.round(kelvin*100)/100 + " K";
    temperature.removeEventListener("click", toKelvin);
    temperature.addEventListener("click", toCelsius);
  }
}

function skyImg(skyStatus) {
  if(skyStatus) {
    //console.log('http://openweathermap.org/img/w/' + skyStatus)
    var url = 'http://openweathermap.org/img/w/' + skyStatus + '.png'
    skyContainer.style.backgroundImage = "url("+ url + ")";
    skyContainer.style.backgroundRepeat = "no-repeat";
    console.log(url)
  }
}