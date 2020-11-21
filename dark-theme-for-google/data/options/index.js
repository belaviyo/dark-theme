'use strict';

// localization
[...document.querySelectorAll('[data-i18n]')].forEach(e => {
  e[e.dataset.i18nValue || 'textContent'] = chrome.i18n.getMessage(e.dataset.i18n);
});

function save() {
  chrome.storage.local.set({
    'front-color': document.getElementById('front-color').value,
    'link-color': document.getElementById('link-color').value,
    'visited-color': document.getElementById('visited-color').value,
    'link-header-color': document.getElementById('link-header-color').value,
    'link-visited-header-color': document.getElementById('link-visited-header-color').value,
    'bg-color': document.getElementById('bg-color').value,
    'bg-light-color': document.getElementById('bg-light-color').value,
    'selection-bg': document.getElementById('selection-bg').value,
    'custom-css': document.getElementById('custom-css').value,
    'day-time': document.getElementById('day-time').value,
    'night-time': document.getElementById('night-time').value,
    'schedule': document.getElementById('schedule').checked,
    'faqs': document.getElementById('faqs').checked,
    'exclude-images': document.getElementById('exclude-images').checked,
    'exclude-photos': document.getElementById('exclude-photos').checked,
    'exclude-translate': document.getElementById('exclude-translate').checked,
    'exclude-blog': document.getElementById('exclude-blog').checked,
    'exclude-books': document.getElementById('exclude-books').checked,
    'exclude-discussions': document.getElementById('exclude-discussions').checked,
    'exclude-news': document.getElementById('exclude-news').checked,
    'exclude-places': document.getElementById('exclude-places').checked,
    'exclude-recipes': document.getElementById('exclude-recipes').checked,
    'exclude-shopping': document.getElementById('exclude-shopping').checked,
    'exclude-video': document.getElementById('exclude-video').checked
  }, () => {
    const status = document.getElementById('status');
    status.textContent = chrome.i18n.getMessage('options_saved');
    setTimeout(() => status.textContent = '', 750);
  });
}

document.getElementById('schedule').addEventListener('change', e => {
  document.getElementById('state').textContent = chrome.i18n.getMessage('options_' + (e.target.checked ? 'enabled' : 'disabled'));
});

const defaults = {
  'front-color': '#e9e8e7',
  'link-color': '#9bb6df',
  'visited-color': '#906f51',
  'link-header-color': '#6b886b',
  'link-visited-header-color': '#8a7885',
  'bg-color': '#222324',
  'bg-light-color': '#292a2c',
  'selection-color': '#eeeeee',
  'selection-bg': '#bbbbbb',
  'custom-css': '',
  'day-time': '19:00',
  'night-time': '08:00',
  'schedule': false,
  'faqs': true,
  'exclude-images': false,
  'exclude-photos': false,
  'exclude-translate': false,
  'exclude-blog': false,
  'exclude-books': false,
  'exclude-discussions': false,
  'exclude-news': false,
  'exclude-places': false,
  'exclude-recipes': false,
  'exclude-shopping': false,
  'exclude-video': false
};

function restore() {
  chrome.storage.local.get(defaults, prefs => {
    Object.keys(prefs).forEach(pref => {
      console.log(pref);
      const e = document.getElementById(pref);
      e[e.type === 'checkbox' ? 'checked' : 'value'] = prefs[pref];
    });
    document.getElementById('schedule').dispatchEvent(new Event('change'));
  });
}
document.addEventListener('DOMContentLoaded', restore);
document.addEventListener('submit', e => {
  e.preventDefault();
  save();
});
document.getElementById('reset').addEventListener('click', () => {
  Object.entries(defaults).forEach(([key, value]) => {
    document.getElementById(key)[key === 'schedule' || key === 'faqs' ? 'checked' : 'value'] = value;
  });
  document.getElementById('schedule').dispatchEvent(new Event('change'));
  save();
});
// support
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '&rd=donate'
}));
