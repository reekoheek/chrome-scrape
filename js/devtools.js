(function() {
  'use strict';

  chrome.devtools.panels.elements.createSidebarPane('Scrape',
    function(sidebar) {
      sidebar.setPage('sidebar.html');
      sidebar.setHeight('100vh');
      // sidebar.onShown.addListener(function() {

      // });

      // sidebar.onHidden.addListener(function() {

      // });
  });
})();

