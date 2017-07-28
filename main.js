// Array of Twitch users
var userArray = ["freecodecamp", "ESL_SC2", "BikeMan", "Dazss", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];


// AJAX Request to Twitch.tv API
var communicationWithTwitchAPI = {
  createCORSRequest: function(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);

    } else {

      // Otherwise, CORS is not supported by the browser.
      xhr = null;

    }

    return xhr;
  },
  makeCORSRequest: function() {
    userArray.forEach(function(user) {
      var url = 'https://wind-bow.glitch.me/twitch-api/users/' + user;

      var xhr = communicationWithTwitchAPI.createCORSRequest('GET', url);
      if (!xhr) {
        throw new Error('CORS not supported');
      }

      xhr.onload = function() {
        var responseText = xhr.responseText;
        var parsed = JSON.parse(responseText);
        console.log(parsed);
      };

      xhr.onerror = function() {
       console.log('There was an error!');
      };

      xhr.send();

    });
  }
};


communicationWithTwitchAPI.makeCORSRequest();
