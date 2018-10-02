'use strict';

function save () {
  chrome.storage.local.set({
    'theme': document.getElementById('theme').value,
    'faqs': document.getElementById('faqs').checked
  }, () => {
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 750);
  });
}

function restore () {
  chrome.storage.local.get({
    theme: 'dark_gmail_mod.css',
    faqs: navigator.userAgent.toLowerCase().indexOf('firefox') === -1 ? true : false
  }, prefs => {
    document.getElementById('theme').value = prefs.theme;
    document.getElementById('faqs').checked = prefs.faqs;
  });
}
document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
