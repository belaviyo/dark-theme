'use strict';

function save() {
  chrome.storage.local.set({
    'theme': document.getElementById('theme').value,
    'faqs': document.getElementById('faqs').checked
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 750);
  });
}

function restore() {
  chrome.storage.local.get({
    theme: 'reddit-minimal-dark.css.css',
    faqs: true
  }, prefs => {
    document.getElementById('theme').value = prefs.theme;
    document.getElementById('faqs').checked = prefs.faqs;
  });
}
document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
