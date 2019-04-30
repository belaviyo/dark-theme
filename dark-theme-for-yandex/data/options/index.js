'use strict';

const info = document.getElementById('status');

// localization
[...document.querySelectorAll('[data-i18n]')].forEach(e => {
  e[e.dataset.i18nValue || 'textContent'] = chrome.i18n.getMessage(e.dataset.i18n);
});

function save() {
  chrome.storage.local.set({
    'custom-css': document.getElementById('custom-css').value,
    'day-time': document.getElementById('day-time').value,
    'night-time': document.getElementById('night-time').value,
    'schedule': document.getElementById('schedule').checked,
    'faqs': document.getElementById('faqs').checked
  }, () => {
    info.textContent = chrome.i18n.getMessage('options_saved');
    setTimeout(() => info.textContent = '', 750);
  });
}

document.getElementById('schedule').addEventListener('change', e => {
  document.getElementById('state').textContent = chrome.i18n.getMessage('options_' + (e.target.checked ? 'enabled' : 'disabled'));
});

var defaults = {
  'custom-css': '',
  'day-time': '19:00',
  'night-time': '08:00',
  'schedule': false,
  'faqs': true
};

function restore() {
  chrome.storage.local.get(defaults, prefs => {
    Object.keys(prefs).forEach(pref => {
      document.getElementById(pref)[pref === 'schedule' || pref === 'faqs' ? 'checked' : 'value'] = prefs[pref];
    });
    document.getElementById('schedule').dispatchEvent(new Event('change'));
  });
}
document.addEventListener('DOMContentLoaded', restore);
document.addEventListener('submit', e => {
  e.preventDefault();
  save();
});
// reset
document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    info.textContent = 'Double-click to reset!';
    window.setTimeout(() => info.textContent = '', 750);
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});
// support
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '&rd=donate'
}));
