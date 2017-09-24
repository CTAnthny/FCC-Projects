$(document).ready(function() {

  (function getLocation() {
    const geoIP = 'https://freegeoip.net/json/?callback=?';

    $.getJSON(geoIP, function(loc) {
      let locInfo = `${loc.city}, ${loc.region_code}`;
      $('#location').text(locInfo);
      getCurrentWeather(loc.latitude, loc.longitude, loc.country_code);
    })
    .fail(function(jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    });
  }());

  function getCurrentWeather(lat, lon, countryCode) {
    let weatherURL = 'https://api.darksky.net/forecast/' +
      callback + '/' + lat + ',' + lon;
    const cors = 'https://cors-anywhere.herokuapp.com/';
    // Bypass CORS
    weatherURL = cors + weatherURL;

    $.getJSON(weatherURL, function(weatherData) {
      // Get Weather Icon
      (function setIcon() {
      // Set Animation HTML Objects
        function Icon(name, html) {
          this.name = name;
          this.html = html;
        };
        let thunderstorm = new Icon('thunderstorm', '<div class="icon thunder-storm"><div class="cloud"></div><div class="lightning">' +
          '<div class="bolt"></div><div class="bolt"></div></div></div>');
        let cloudy = new Icon('cloudy', '<div class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>');
        let snow = new Icon('snow', '<div class="icon flurries"><div class="cloud"></div><div class="snow">' +
          '<div class="flake"></div><div class="flake"></div></div></div>');
        let clearDay = new Icon('clear-day', '<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>');
        let clearNight = new Icon('clear-night', '<div class="icon sunny"><div class="sun"></div></div>');
        let rain = new Icon('rain', '<div class="icon rainy"><div class="cloud"></div><div class="rain"></div></div>');
        let iconObjs = [thunderstorm, cloudy, snow, clearDay, clearNight, rain];

        // Grab Dark Sky Icon Descriptor
        let dsIconDesc = weatherData.currently.icon;
        let iconMatch;

        // Loop through available icons and match DS descriptor
        for (let icon of iconObjs) {
          let iconRegEx = new RegExp(icon.name, 'i');
          if (dsIconDesc.match(iconRegEx)) {
            iconMatch = icon;
          };
        };
        // Set Icon or Cloudy for Default
        if (iconMatch.hasOwnProperty('name')) {
          $('#icon').prepend(iconMatch.html);
        } else {
          $('#icon').prepend(cloudy.html);
        };
      }());

      // Convert Fahrenheit to Celsisus
      function getTempC(temp) {
        return ((temp - 32) * (5 / 9)).toFixed(0);
      };

      // Get Current Temp
      let currentTempF = weatherData.currently.temperature.toFixed(0);
      let currentTempC = getTempC(currentTempF);
      // Get Temp Min/Max
      let minTempF = weatherData.daily.data[0].temperatureMin.toFixed(0);
      let maxTempF = weatherData.daily.data[0].temperatureMax.toFixed(0);
      let minTempC = getTempC(minTempF);
      let maxTempC = getTempC(maxTempF);
      let tempMarker;
      // Use F or C based on country code
      // United States, the Bahamas, Belize, Cayman Islands, Palau, Puerto Rico, Guam, Virgin Islands
      let fCountries = ['US', 'BS', 'BZ', 'KY', 'PW', 'PR', 'GU', 'VI'];
      let fCountryCodeIndex = fCountries.indexOf(countryCode);
      (function setTempUnit(param) {
        if (param > -1) {
          tempMarker = 1;
          $('#currentTemp').text(`${currentTempF}`);
          $('#min').text(`${minTempF}`);
          $('#max').text(`${maxTempF}`);
          $('.temp').after('<a href="javascript:void(0)" class="swap"><i class="wi wi-fahrenheit"></i></a>');
        } else {
          tempMarker = -1;
          $('#currentTemp').text(`${currentTempC}`);
          $('#min').text(`${minTempC}`);
          $('#max').text(`${maxTempC}`);
          $('.temp').after('<a href="javascript:void(0)" class="swap"><i class="wi wi-celsius"></i></a>');
        };
        // Event Handler - Swap Temp Unit
        $('.swap').on("click", function() {
          if (tempMarker == 1) {
            $('.swap').remove();
            setTempUnit(-2);
          } else {
            $('.swap').remove();
            setTempUnit(1);
          };
        });
      }(fCountryCodeIndex));

      // Get Weather Summary
      let desc = weatherData.minutely.summary;
      desc = _.trimEnd(desc, '.');
      $('#desc').text(desc);

      // Get Windspeed
      let wspeed = weatherData.currently.windSpeed;
      $('#wspeed').text(wspeed);

      // Get Humidity
      let hum = (weatherData.currently.humidity * 100).toFixed(0);
      $('#hum').text(hum + '%');

    })
    .fail(function(jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    });
  };






































  var callback = '8fab929876c62d89cc60fec1d9130615';
});
