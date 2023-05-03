// Looping Harlem Shake in Chrome by Taylor Newsome ClumsyLulz on twitter //

// Create a new window and play the video
function playVideo() {
  chrome.windows.create({
    url: "https://www.youtube.com/embed/qV0LHCHf-pE?autoplay=1&loop=1",
    type: "popup",
    width: 560,
    height: 315
  });
}

// Stop the video by finding the window and closing it
function stopVideo() {
  chrome.windows.getAll({populate: true}, function(windows) {
    windows.forEach(function(window) {
      if (window.tabs.some(function(tab) {
        return tab.url.includes('youtube.com/embed/qV0LHCHf-pE');
      })) {
        chrome.windows.remove(window.id);
      }
    });
  });
}

// Loop the video by injecting a script into the tab's page
function loopVideo(tabId) {
  chrome.tabs.executeScript(tabId, {
    code: 'document.querySelector("video").setAttribute("loop", "true");'
  });
}

// Listen for button clicks and send the corresponding message to the background page
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('playButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'play'});
  });
  document.getElementById('stopButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'stop'});
  });
});

// Listen for messages from the background page and respond accordingly
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action == 'play') {
    playVideo();
  } else if (message.action == 'stop') {
    stopVideo();
  }
});

// Listen for the creation of a new tab and loop the video when the page has loaded
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.url.includes('youtube.com/embed/qV0LHCHf-pE')) {
    loopVideo(tabId);
  }
});

// Prevent the user from closing the window
window.addEventListener('beforeunload', function(e) {
  chrome.windows.getAll({populate: true}, function(windows) {
    windows.forEach(function(window) {
      if (window.tabs.some(function(tab) {
        return tab.url.includes('youtube.com/embed/qV0LHCHf-pE');
      })) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  });
});
