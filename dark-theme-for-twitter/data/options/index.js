'use strict';

function save() {
  chrome.storage.local.set({
    'background-color': document.getElementById('background-color').value,
    'text-color': document.getElementById('text-color').value,
    'toolbar-color': document.getElementById('toolbar-color').value,
    'stream-color': document.getElementById('stream-color').value,
    'module-color': document.getElementById('module-color').value,
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 750);
  });
}

function restore() {
  chrome.storage.local.get({
    'background-color': '#2e2e2e',
    'text-color': '#d2cfcf',
    'toolbar-color': '#1f1f1f',
    'stream-color': '#212121',
    'module-color': '#212121'
  }, prefs => {
    Object.keys(prefs).forEach(pref => {
      document.getElementById(pref).value = prefs[pref];
    });
  });
}
function reset() {
  Object.entries({
    'background-color': '#2e2e2e',
    'text-color': '#d2cfcf',
    'toolbar-color': '#1f1f1f',
    'stream-color': '#212121',
    'module-color': '#212121'
  }).forEach(([key, value]) => {
    document.getElementById(key).value = value;
  });
}
document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
document.getElementById('reset').addEventListener('click', reset);
