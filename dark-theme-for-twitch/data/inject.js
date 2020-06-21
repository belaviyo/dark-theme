'use strict';

var update = enabled => {
  const theme = localStorage.getItem('twilight.theme');
  if (theme === '1' && enabled === false) {
    localStorage.setItem('twilight.theme', 0);
    document.documentElement.classList.remove('tw-root--theme-dark');
  }
  else if (theme !== '1' && enabled === true) {
    localStorage.setItem('twilight.theme', 1);
    document.documentElement.classList.add('tw-root--theme-dark');
  }
};

var e;
var enabled = false;
var style = code => {
  if (enabled === false) {
    return;
  }
  if (e) {
    e.textContent = code;
  }
  else {
    e = document.createElement('style');
    e.textContent = code;
    document.documentElement.appendChild(e);
  }
};

chrome.storage.local.get({
  'enabled': true,
  'custom-css': ''
}, prefs => {
  update(prefs.enabled);
  if (prefs['custom-css']) {
    style(prefs['custom-css']);
  }
});

chrome.storage.onChanged.addListener(prefs => {
  enabled = prefs.enabled;
  if (prefs.enabled) {
    update(prefs.enabled.newValue);
  }
  if (prefs['custom-css']) {
    style(prefs['custom-css'].newValue);
  }
});
