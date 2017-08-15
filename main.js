// Array of Twitch users
var userArray = ["freecodecamp", "ESL_SC2", "BikeMan", "Dazss", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var userListsArray = [];


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
    userDiv = document.querySelector('.userDiv');

    for (var i = 0; i < userArray.length; i++) {
      userList = document.createElement('ul');
      userNameLi = document.createElement('li');
      userBioLi = document.createElement('li');
      userOnlineStatusLi = document.createElement('li');
      userStreamLink = document.createElement('a');
      userLogoLi = document.createElement('li');
      userLogo = document.createElement('img');

      userList.className = 'userList';
      userNameLi.className = 'userName';
      userBioLi.className = 'userBio';
      userOnlineStatusLi.className = 'userOnlineStatus';
      userStreamLink.className = 'userStreamLink';
      userLogoLi.className = 'userLogoLi';
      userLogo.className = 'userLogo';

      userNameLi.textContent = userResults[i].display_name;
      userBioLi.textContent = userResults[i].bio;

      // User Logo
      userLogo.src = userResults[i].logo;
      userLogo.alt = userResults[i].display_name + ' logo';

      if (userBioLi.textContent == '') {
        userBioLi.textContent = userResults[i].display_name + " user has provided no bio.";
      }

      userDiv.appendChild(userList);
      userList.appendChild(userNameLi);
      userList.appendChild(userBioLi);
      userList.appendChild(userOnlineStatusLi);
      userList.appendChild(userLogoLi);
      userLogoLi.appendChild(userLogo);

      for (var j = 0; j < userArray.length; j++) {
        if (streamResults[j].stream != null) {
          if (streamResults[j].stream.channel.display_name === userNameLi.textContent) {
            userStreamLink.href = streamResults[j].stream.channel.url;
            userStreamLink.target = "_blank";
            userStreamLink.textContent = 'here';
            userOnlineStatusLi.textContent = streamResults[j].stream.channel.display_name + ' is currently live! Click ' + userStreamLink + ' to view stream.'
          }
        }

        // Having this as the else statement forthe if statement above was not working ??
        if (userOnlineStatusLi.textContent === '') {
          userOnlineStatusLi.textContent = 'Status: Offline';
        }

      }
    }
  },

  allStreamers: function() {

    if (userListsArray.length === userArray.length) {

      for (var i = 0; i < userListsArray.length; i++) {
        userListsArray[i].style.display = "inherit";
      }

    }

  },

  onlineStreamers: function() {

    // if offlineUsers() has already been executed this displays all Streamers before removing all offline streamers
    this.allStreamers();

    var userLists = document.querySelectorAll('.userList');

    userListsArray = Array.from(userLists);
    hiddenUsers = [];
    console.log(userListsArray);

    for (var i = 0; i < userListsArray.length; i++) {
      var userOnlineStatusNode = userListsArray[i].children[2];
      var userOnlineStatusTextContent = userOnlineStatusNode.textContent;

      if (userOnlineStatusTextContent.indexOf('Offline') !== -1) {
        var userOnlineStatusParentNode = userOnlineStatusNode.parentNode;

        hiddenUsers.push(userOnlineStatusParentNode);
        userOnlineStatusParentNode.style.display = 'none';

      }
    }

  },

  offlineStreamers: function() {

    // if onlineUsers() has already been executed this displays all Streamers before removing all online streamers
    this.allStreamers();

    var userLists = document.querySelectorAll('.userList');

    userListsArray = Array.from(userLists);
    hiddenUsers = [];

    for (var i = 0; i < userListsArray.length; i++) {
      var userOnlineStatusNode = userListsArray[i].children[2];
      var userOnlineStatusTextContent = userOnlineStatusNode.textContent;

      if (userOnlineStatusTextContent.indexOf('Offline') === -1) {
        var userOnlineStatusParentNode = userOnlineStatusNode.parentNode;

        hiddenUsers.push(userOnlineStatusParentNode);
        userOnlineStatusParentNode.style.display = 'none';

      }
    }

  }

};





communicationWithTwitchAPI.requestForUserInfo();
