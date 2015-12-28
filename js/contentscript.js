(function() {
  'use strict';

  chrome.extension.onMessage.addListener(function(msg/*, sender, sendResponse*/) {
    if (msg.action === 'start-editor') {
      startEditor(msg);
    } else {
      console.error('Uncaught message: ' + msg);
    }
  });

  function startEditor (msg) {
    // var toolbar = document.createElement('div');
    // toolbar.style.position = 'fixed';
    // toolbar.style.width = '100%';
    // toolbar.style.backgroundColor = 'red';
    // toolbar.style.height = '50px';
    // toolbar.style.top = '0px';

    // var btnAdd = document.createElement('a');
    // btnAdd.innerHTML = 'Add';
    // btnAdd.setAttribute('href', 'javascript:alert("huer");');
    // toolbar.appendChild(btnAdd);

    // document.body.style.top = '50px';
    // document.body.insertBefore(toolbar, document.body.firstChild);
  }

  // startEditor();
})();
