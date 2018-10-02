'use strict';

var style = document.createElement('style');
style.type = 'text/css';
var enabled = true;

function load (theme) {
  let req = new XMLHttpRequest();
  req.open('GET', chrome.runtime.getURL('data/themes/' + theme));
  req.onload = () => {
    style.textContent = req.response;
  };
  req.send();
}

chrome.storage.onChanged.addListener(prefs => {
  if (prefs.enabled) {
    enabled = prefs.enabled.newValue;
    if (enabled) {
      document.documentElement.appendChild(style);
    }
    else {
      try {
        document.documentElement.removeChild(style);
      } catch (e) {}
    }
  }
  if (prefs.theme) {
    load(prefs.theme.newValue);
  }
});

// load style
chrome.storage.local.get({
  theme: 'dark_gmail_mod.css'
}, prefs => load(prefs.theme));

// reinsert when body is ready
var mutation = new MutationObserver(() => {
  if (enabled) {
    console.log(enabled);
    document.documentElement.appendChild(style);
  }
  mutation.disconnect();
});

chrome.storage.local.get({
  enabled: true
}, prefs => {
  enabled = prefs.enabled;
  if (enabled) {
    document.documentElement.appendChild(style);
  }
  mutation.observe(document, {childList: true, subtree: true});
});
