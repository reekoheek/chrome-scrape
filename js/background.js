'use strict';

// chrome.runtime.onInstalled.addListener(details => {
//   console.log('previousVersion', details.previousVersion);
// });


// console.log('\'Allo \'Allo! Event Page for Browser Action');

// chrome.browserAction.onClicked.addListener(function(tab){
//   chrome.browserAction.setBadgeText({text: ':)'});
//   chrome.windows.create({
//     'url': 'toolbox.html',
//     'type': 'popup',
//     'width': 100,
//     'height': 400,
//     'left': 0,
//     'top': 0,
//     'type': 'panel',
//   }, function(window) {
//     chrome.tabs.sendMessage(tab.id, {
//       action: 'start-editor'
//     });
//   });
// });