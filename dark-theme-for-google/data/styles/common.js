'use strict';

const style = document.documentElement.style;
const invert = hex => {
  return '#' + (Number(`0x1${hex.substr(1)}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
};

const update = prefs => {
  if ('enabled' in prefs) {
    document.documentElement.classList[prefs.enabled ? 'add' : 'remove']('dark');
  }
  if ('bg-color' in prefs) {
    style.setProperty('--bg-color', invert(prefs['bg-color']));
    style.setProperty('--bg-color-inverted', prefs['bg-color']);
  }
  if ('bg-light-color' in prefs) {
    style.setProperty('--bg-light-color', prefs['bg-light-color']);
  }
  if ('link-color' in prefs) {
    style.setProperty('--link-color', prefs['link-color']);
  }
  if ('visited-color' in prefs) {
    style.setProperty('--visited-color', prefs['visited-color']);
  }
  if ('link-header-color' in prefs) {
    style.setProperty('--link-header-color', prefs['link-header-color']);
  }
  if ('link-visited-header-color' in prefs) {
    style.setProperty('--link-visited-header-color', prefs['link-visited-header-color']);
  }
  if ('front-color' in prefs) {
    style.setProperty('--front-color', prefs['front-color']);
  }
  if ('selection-color' in prefs) {
    style.setProperty('--selection-color', prefs['selection-color']);
  }
  if ('selection-bg' in prefs) {
    style.setProperty('--selection-bg', prefs['selection-bg']);
  }
};

chrome.storage.local.get({
  'enabled': true,
  'bg-color': '#06080c',
  'bg-light-color': '#4a4a4a',
  'link-color': '#9bb6df',
  'visited-color': '#906f51',
  'link-header-color': '#6b886b',
  'link-visited-header-color': '#8a7885',
  'front-color': '#e9e8e7',
  'selection-color': '#eeeeee',
  'selection-bg': '#bbbbbb',
  'button-bg': '#1a73e8',
  'custom-css': ''
}, update);

chrome.storage.onChanged.addListener(ps => {
  const prefs = Object.keys(ps).reduce((p, c) => {
    p[c] = ps[c].newValue;
    return p;
  }, {});
  update(prefs);
});
