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

  requestForUserInfo: function() {
    queryResults = [];
    userArray.forEach(function(user) {
      var url = 'https://wind-bow.glitch.me/twitch-api/users/' + user;

      var xhr = communicationWithTwitchAPI.createCORSRequest('GET', url);
      if (!xhr) {
        throw new Error('CORS not supported');
      }

      xhr.onload = function() {
        userInfoResponse = JSON.parse(xhr.responseText);
        queryResults.push(userInfoResponse);

        if (queryResults.length == userArray.length) {
          //display.userInfo();
          communicationWithTwitchAPI.requestForStreamInfo();
        }

      };

      xhr.onerror = function() {
       console.log('There was an error!');
      };

      xhr.send();

    });
  },

  requestForStreamInfo: function() {
    userArray.forEach(function(user) {
      var url = 'https://wind-bow.glitch.me/twitch-api/streams/' + user;

      var xhr = communicationWithTwitchAPI.createCORSRequest('GET', url);
      if (!xhr) {
        throw new Error('CORS not supported');
      }

      xhr.onload = function() {
        streamInfoResponse = JSON.parse(xhr.responseText);
        queryResults.push(streamInfoResponse);

        if (queryResults.length == userArray.length * 2) {
          display.userInfo();
        }

      };

      xhr.onerror = function() {
       console.log('There was an error!');
      };

      xhr.send();

    });
    console.log(queryResults);
  }


};


var display = {

  userInfo: function() {
    userList = document.querySelector('.userList');
    for (var i = 0; i < userArray.length; i++) {
      userInfoDiv = document.createElement('div');
      userNameLi = document.createElement('li');
      userBioLi = document.createElement('li');

      userInfoDiv.className = 'userDiv';
      userNameLi.className = 'userName';
      userBioLi.className = 'userBio';

      userNameLi.textContent = queryResults[i].display_name;
      userBioLi.textContent = queryResults[i].bio;

      if (userBioLi.textContent == '') {
        userBioLi.textContent = "This user has provided no bio.";
      }

      if ()

      userList.appendChild(userInfoDiv);
      userInfoDiv.appendChild(userNameLi);
      userNameLi.appendChild(userBioLi);

    }
  }

};

communicationWithTwitchAPI.requestForUserInfo();
//communicationWithTwitchAPI.requestForStreamInfo();
