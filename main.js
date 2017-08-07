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
    userResults = [];
    userArray.forEach(function(user) {
      var url = 'https://wind-bow.glitch.me/twitch-api/users/' + user;

      var xhr = communicationWithTwitchAPI.createCORSRequest('GET', url);
      if (!xhr) {
        throw new Error('CORS not supported');
      }

      xhr.onload = function() {
        userInfoResponse = JSON.parse(xhr.responseText);
        userResults.push(userInfoResponse);

        if (userResults.length == userArray.length) {
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
    streamResults = [];
    userArray.forEach(function(user) {
      var url = 'https://wind-bow.glitch.me/twitch-api/streams/' + user;

      var xhr = communicationWithTwitchAPI.createCORSRequest('GET', url);
      if (!xhr) {
        throw new Error('CORS not supported');
      }

      xhr.onload = function() {
        streamInfoResponse = JSON.parse(xhr.responseText);
        streamResults.push(streamInfoResponse);

        if (streamResults.length == userArray.length) {
          display.userInfo();
        }

      };

      xhr.onerror = function() {
       console.log('There was an error!');
      };

      xhr.send();

    });
    console.log(userResults);
    console.log(streamResults);
  }


};


var display = {

  userInfo: function() {
    userList = document.querySelector('.userList');
    for (var i = 0; i < userArray.length; i++) {
      userInfoDiv = document.createElement('div');
      userNameLi = document.createElement('li');
      userBioLi = document.createElement('li');
      userOnlineStatusLi = document.createElement('li');
      userStreamLink = document.createElement('a');

      userInfoDiv.className = 'userDiv';
      userNameLi.className = 'userName';
      userBioLi.className = 'userBio';
      userOnlineStatusLi.className = 'userOnlineStatus';
      userStreamLink.className = 'userStreamLink';

      userNameLi.textContent = userResults[i].display_name;
      userBioLi.textContent = userResults[i].bio;

      if (userBioLi.textContent == '') {
        userBioLi.textContent = userResults[i].display_name + " user has provided no bio.";
      }

      for (var j = 0; j < userArray.length; j++) {
        if (userResults[i]._links.self.textContent == streamResults[j]._links.self.textContent) {
          if (streamResults[j].stream == null) {
            userOnlineStatusLi.textContent = userResults[i].display_name + ' is currently offline.';
          } else {
            userStreamLink.href = streamResults[j].stream.textContent;
            userStreamLink.textContent = 'here';
            userOnlineStatusLi.textContent = userResults[i].display_name + ' is currently online! Click ' + userStreamLink + 'to view stream.';
          }
        }
      }

      userList.appendChild(userInfoDiv);
      userInfoDiv.appendChild(userNameLi);
      userNameLi.appendChild(userBioLi);
      userBioLi.appendChild(userOnlineStatusLi);

    }
  }

};

communicationWithTwitchAPI.requestForUserInfo();
