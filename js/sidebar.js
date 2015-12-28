(function() {
  'use strict';

  var sequence = 0;

  document.addEventListener('focus', function(evt) {
    Array.prototype.forEach.call(document.querySelectorAll('.selected'), function(el) {
      el.classList.remove('selected');
    });
    evt.target.classList.add('selected');
  }, true);

  document.addEventListener('click', function(evt) {
    if (evt.target.matches('.btnRemove')) {
      evt.preventDefault();
      evt.target.parentElement.parentElement.removeChild(evt.target.parentElement);
    } else if (evt.target.matches('.btnHighlight')) {
      evt.preventDefault();
      var input = evt.target.previousElementSibling;
      var selector = input.value;
      if (input.classList.contains('inpValue')) {
        selector = inpRoot.value + ' ' + selector;
      }

      chrome.devtools.inspectedWindow.eval('(' + highlightSelections.toString() + ')(\'' + selector + '\')', function(x) {
        chrome.devtools.inspectedWindow.eval('console.log(\'' + JSON.stringify(x) + '\');');
      });
    }
  });

  btnAdd.addEventListener('click', function(evt) {
    evt.preventDefault();

    var newProperty = tplProperty.content.cloneNode(true);
    var fieldKey = 'field' + sequence++;
    newProperty.querySelector('div').setAttribute('field-key', fieldKey);
    newProperty.querySelector('input.inpKey').value = fieldKey;
    properties.appendChild(newProperty);
  });

  btnSave.addEventListener('click', function(evt) {
    evt.preventDefault();

    getUrl()
      .then(function(url) {
        var select = {
          $root: inpRoot.value,
        };

        var data = {
          $url: url,
          $select: [select]
        };

        var keys = Array.prototype.slice.call(document.querySelectorAll('.inpKey')).map(function(el) { return el.value; });
        var values = Array.prototype.slice.call(document.querySelectorAll('.inpValue')).map(function(el) { return el.value; });

        for(var i in keys) {
          select[keys[i]] = values[i];
        }

        if (inpPaging.value.trim() !== '') {
          data.$pagination = [inpPaging.value + '@href'];
          if (inpLimit.value.trim() !== '') {
            try {
              var limit = parseInt(inpLimit.value, 10);
              data.$pagination.push(limit);
            } catch(e) {}
          }
        }

        return data;
      })
      .then(function(data) {
        return doScrape(data);
      })
      .then(function(result) {
        results.innerHTML = JSON.stringify(result);
        chrome.devtools.inspectedWindow.eval('console.log(' + JSON.stringify(result) + ')');
      });

  });

  chrome.devtools.panels.elements.onSelectionChanged.addListener(function(){
    chrome.devtools.inspectedWindow.eval('(' + getSelected.toString() + ')()', function(node) {
      var signature = getSignature(node);
      var selected = document.querySelector('.selected');
      if (selected.classList.contains('inpValue') && inpRoot.value) {
        signature = signature.replace(inpRoot.value, '').replace(/^\s\>\s/, '');
      }

      selected.value = signature;
      // chrome.devtools.inspectedWindow.eval('console.log(\'' + signature + '\');');
    });
  });

  function doScrape (data) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('POST', 'http://localhost:3000', true);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          resolve(data);
        } else {
          reject(new Error('Error status code: ' + request.status));
        }
      };
      request.send(JSON.stringify(data));
    });
  }

  function getUrl () {
    return new Promise(function(resolve, reject) {
      chrome.devtools.inspectedWindow.eval('location.href', function(url) { resolve(url); });
    });
  }

  function highlightSelections (selector) {
    Array.prototype.forEach.call(document.querySelectorAll('.scrape-highlighted'), function(el) {
      el.classList.remove('scrape-highlighted');
    });

    var selections = Array.prototype.slice.call(document.querySelectorAll(selector));
    selections.forEach(function(el) {
      el.classList.add('scrape-highlighted');
    });

    return selections.length;
  }

  function getSignature(node) {
    var signature = node.tagName;

    if (node.parent && node.parent.tagName != 'body') {
      var parentSignature = getSignature(node.parent);
      signature = parentSignature + ' ' + signature;
    }

    var len = node.classList.length;
    if (node.classList.indexOf('scrape-highlighted') > -1) {
      len--;
    }
    if (len) {
      signature += node.classList.reduce(function(result, className) {
        if (className !== 'scrape-highlighted') {
          result += '.' + className;
        }
        return result;
      }, '');
    } else if (node.id) {
      signature += '#' + node.id;
    }

    return signature;
  }

  function getSelected () {
    function getMetadata(el) {
      if (!el) return el;

      var metadata = {
        tagName: el.tagName.toLowerCase(),
        id: el.id,
        classList: Array.prototype.slice.call(el.classList),
        parent: getMetadata(el.parentElement),
      };

      return metadata;
    }

    return getMetadata($0);
  }
})();