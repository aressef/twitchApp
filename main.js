// Array of Twitch streamers
var streamerArray = ["freecodecamp", "ESL_SC2", "BikeMan", "Dazss", "Syndicate", "goldglove", "tsm_bjergsen", "noobs2ninjas", "riotgames", "esl_csgo", "summit1g"];
var streamerListsArray = [];


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

  requestForstreamerInfo: function() {
    streamerResults = [];
    streamerArray.forEach(function(streamer) {
      var url = 'https://wind-bow.glitch.me/twitch-api/users/' + streamer;

      var xhr = communicationWithTwitchAPI.createCORSRequest('GET', url);
      if (!xhr) {
        throw new Error('CORS not supported');
      }

      xhr.onload = function() {
        streamerInfoResponse = JSON.parse(xhr.responseText);
        streamerResults.push(streamerInfoResponse);

        if (streamerResults.length == streamerArray.length) {
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
    streamerArray.forEach(function(streamer) {
      var url = 'https://wind-bow.glitch.me/twitch-api/streams/' + streamer;

      var xhr = communicationWithTwitchAPI.createCORSRequest('GET', url);
      if (!xhr) {
        throw new Error('CORS not supported');
      }

      xhr.onload = function() {
        streamInfoResponse = JSON.parse(xhr.responseText);
        streamResults.push(streamInfoResponse);

        if (streamResults.length == streamerArray.length) {
          display.streamerInfo();
          display.moreInfoSlider();
        }

      };

      xhr.onerror = function() {
       console.log('There was an error!');
      };

      xhr.send();

    });
    console.log(streamerResults);
    console.log(streamResults);
  }


};


var display = {

  streamerInfo: function() {
    streamerDiv = document.querySelector('.streamerDiv');

    streamerResults.sort(function(a, b) {
      var nameA = a.display_name.toUpperCase();
      var nameB = b.display_name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    for (var i = 0; i < streamerArray.length; i++) {
      streamerList = document.createElement('ul');
      streamerLogoLi = document.createElement('li');
      streamerLogo = document.createElement('img');
      streamerNameLi = document.createElement('li');
      streamerOnlineStatusLi = document.createElement('li');
      streamerStatus = document.createElement('a');
      streamerLinkForLogo = document.createElement('a');
      streamerLinkForStatus = document.createElement('a');
      moreInfoButton = document.createElement('div');
      moreInfoAboutStreamersDiv = document.createElement('div');
      moreInfoAboutStreamersUL = document.createElement('ul');
      streamerBioLi = document.createElement('li');
      streamerGameStreaming = document.createElement('li');
      streamerFollowers = document.createElement('li');
      streamerViewers = document.createElement('li');

      streamerList.className = 'streamerList';
      streamerLogoLi.className = 'streamerLogoLi';
      streamerLogo.className = 'streamerLogo';
      streamerNameLi.className = 'streamerName';
      streamerOnlineStatusLi.className = 'streamerOnlineStatus';
      streamerStatus.className = 'streamerStatus';
      moreInfoButton.className = 'moreInfoButton';
      moreInfoAboutStreamersDiv.className = 'moreInfoAboutStreamersDiv';
      moreInfoAboutStreamersDiv.className += ' moreInfoSlideUp';
      moreInfoAboutStreamersUL.className = 'moreInfoAboutStreamersUL';
      streamerBioLi.className = 'streamerBio';
      streamerGameStreaming.className = 'streamerGameStreaming';
      streamerFollowers.className = 'streamerFollowers';
      streamerViewers.className = 'streamerViewers';

      streamerNameLi.textContent = streamerResults[i].display_name;
      bioText = 'Bio: ';
      boldBioText = bioText.bold();
      streamerBioLi.innerHTML = boldBioText + streamerResults[i].bio;

      // moreInfoButton
      keyArrowDown = document.createElement('i');
      keyArrowDown.className = 'material-icons';
      keyArrowDown.className += ' moreInfoArrow';
      keyArrowDown.textContent = 'keyboard_arrow_down';
      moreInfoButton.textContent = 'More';
      moreInfoButton.appendChild(keyArrowDown);

      // statusOnline
      statusOnlineIcon = document.createElement('i');
      statusOnlineIcon.className = 'material-icons';
      statusOnlineIcon.className += ' statusOnlineIcon';
      statusOnlineIcon.textContent = 'play_circle_outline';

      // statusOffline
      statusOfflineIcon = document.createElement('i');
      statusOfflineIcon.className = 'material-icons';
      statusOfflineIcon.className += ' statusOfflineIcon';
      statusOfflineIcon.textContent = 'not_interested';

      // streamer Logo
      streamerLogo.src = streamerResults[i].logo;
      streamerLogo.alt = streamerResults[i].display_name + ' logo';

      if (streamerBioLi.textContent == '') {
        streamerBioLi.textContent = streamerResults[i].display_name + " has provided no bio.";
      }

      streamerDiv.appendChild(streamerList);
      streamerList.appendChild(streamerLogoLi);
      streamerLogoLi.appendChild(streamerLogo);
      streamerList.appendChild(streamerNameLi);
      streamerList.appendChild(streamerOnlineStatusLi);
      streamerList.appendChild(moreInfoButton);
      streamerList.appendChild(moreInfoAboutStreamersDiv);
      moreInfoAboutStreamersDiv.appendChild(moreInfoAboutStreamersUL);
      moreInfoAboutStreamersUL.appendChild(streamerBioLi);


      for (var j = 0; j < streamerArray.length; j++) {
        if (streamResults[j].stream != null) {

          if (streamResults[j].stream.channel.display_name === streamerNameLi.textContent) {
            // Adding Stream Link to Status
            streamerStatus.href = streamResults[j].stream.channel.url;
            streamerStatus.target = '_blank';
            streamerStatus.textContent = 'Currently Streaming!';
            streamerOnlineStatusLi.appendChild(streamerStatus);
            streamerOnlineStatusLi.insertBefore(statusOnlineIcon, streamerOnlineStatusLi.childNodes[0]);

            // Adding Stream Link to Logo
            streamerLinkForLogo.href = streamResults[j].stream.channel.url;
            streamerLinkForLogo.target = "_blank";
            streamerLinkForLogo.appendChild(streamerLogo);
            streamerLogoLi.appendChild(streamerLinkForLogo);

            // Adding Game being Streamed to More Info Section
            gameStreamingText = 'Streaming: ';
            boldGameStreamingText = gameStreamingText.bold();
            streamerGameStreaming.innerHTML = boldGameStreamingText +  streamResults[j].stream.game;
            moreInfoAboutStreamersUL.insertBefore(streamerGameStreaming, moreInfoAboutStreamersUL.childNodes[0]); // Adding before Bio

            // Adding Stream Viewers to More Info Section
            viewersText = 'Viewers: ';
            boldViewersText = viewersText.bold();
            streamerViewers.innerHTML = boldViewersText +  streamResults[j].stream.viewers;
            moreInfoAboutStreamersUL.appendChild(streamerViewers);

            // Adding Stream followers to More Info Section
            followersText = 'Followers: ';
            boldFollowersText = followersText.bold();
            streamerFollowers.innerHTML = boldFollowersText +  streamResults[j].stream.channel.followers;
            moreInfoAboutStreamersUL.appendChild(streamerFollowers);
          }

        }
      }

      if  (streamerStatus.textContent === '') {
        statusOfflineText = document.createElement('p');
        statusOfflineText.textContent = 'Offline';
        streamerOnlineStatusLi.appendChild(statusOfflineText);
        streamerOnlineStatusLi.insertBefore(statusOfflineIcon, streamerOnlineStatusLi.childNodes[0]);
      }

    }
  },

  allStreamers: function() {

    // Selected menu button is underlined
    var onlineSteamersButton = document.querySelector('.onlineStreamers');
    var allStreamersButton = document.querySelector('.allStreamers');

    if (onlineSteamersButton.classList.contains('menuButtonSelected')) {
      allStreamersButton.classList.toggle('menuButtonSelected');
      allStreamersButton.classList.toggle('menuButtonNotSelected');
      onlineSteamersButton.classList.toggle('menuButtonSelected');
      onlineSteamersButton.classList.toggle('menuButtonNotSelected');
    }

    if (streamerListsArray.length === streamerArray.length) {

      for (var i = 0; i < streamerListsArray.length; i++) {
        streamerListsArray[i].style.display = "grid";
      }

    }

  },

  onlineStreamers: function() {

    // Selected menu button is underlined
    var onlineSteamersButton = document.querySelector('.onlineStreamers');
    var allStreamersButton = document.querySelector('.allStreamers');

    if (allStreamersButton.classList.contains('menuButtonSelected')) {
      allStreamersButton.classList.toggle('menuButtonSelected');
      allStreamersButton.classList.toggle('menuButtonNotSelected');
      onlineSteamersButton.classList.toggle('menuButtonSelected');
      onlineSteamersButton.classList.toggle('menuButtonNotSelected');
    }

    var streamerLists = document.querySelectorAll('.streamerList');
    streamerListsArray = Array.from(streamerLists);

    for (var i = 0; i < streamerListsArray.length; i++) {
      var streamerOnlineStatusNode = streamerListsArray[i].children[2];
      var streamerOnlineStatusTextContent = streamerOnlineStatusNode.textContent;

      if (streamerOnlineStatusTextContent.indexOf('Offline') !== -1) {
        var streamerOnlineStatusParentNode = streamerOnlineStatusNode.parentNode;
        streamerOnlineStatusParentNode.style.display = 'none';
      }
    }

  },

  offlineStreamers: function() {

    // if onlinestreamers() has already been executed this displays all Streamers before removing all online streamers
    this.allStreamers();

    var streamerLists = document.querySelectorAll('.streamerList');
    streamerListsArray = Array.from(streamerLists);

    for (var i = 0; i < streamerListsArray.length; i++) {
      var streamerOnlineStatusNode = streamerListsArray[i].children[2];
      var streamerOnlineStatusTextContent = streamerOnlineStatusNode.textContent;

      if (streamerOnlineStatusTextContent.indexOf('Offline') === -1) {
        var streamerOnlineStatusParentNode = streamerOnlineStatusNode.parentNode;
        streamerOnlineStatusParentNode.style.display = 'none';
      }
    }

  },

  moreInfoSlider: function() {
    var moreInfoButtons = document.getElementsByClassName('moreInfoButton');
    var height;
    for (var i = 0; i < moreInfoButtons.length; i++) {
      moreInfoButtons[i].addEventListener('click', function() {
        height = this.nextSibling.clientHeight;

        this.nextSibling.classList.toggle('moreInfoSlideDown');
        this.nextSibling.classList.toggle('moreInfoSlideUp');

        // Animate Arrow
        var arrow = this.lastChild;

        if (arrow.classList.contains('moreInfoArrowRotateDown')) {
          arrow.classList.toggle('moreInfoArrowRotateDown');
          arrow.classList.toggle('moreInfoArrowRotateUp');
        } else if (arrow.classList.contains('moreInfoArrowRotateUp')) {
          arrow.classList.toggle('moreInfoArrowRotateUp');
          arrow.classList.toggle('moreInfoArrowRotateDown');
        } else {
          arrow.classList.toggle('moreInfoArrowRotateUp');
        }
      });


    }

  }

};


communicationWithTwitchAPI.requestForstreamerInfo();
