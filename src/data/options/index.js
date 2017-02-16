'use strict';

function save () {
  chrome.storage.local.set({
    'selection-bg-color': document.getElementById('selection-bg-color').value,
    'selection-text-color': document.getElementById('selection-text-color').value,
    'body-font': document.getElementById('body-font').value,
    'bg-color': document.getElementById('bg-color').value,
    'main-text-color': document.getElementById('main-text-color').value,
    'main-faded-text-color': document.getElementById('main-faded-text-color').value,
    'author-highlight-bg-color': document.getElementById('author-highlight-bg-color').value,
    'sep-line-color': document.getElementById('sep-line-color').value,
    'card-bg-color': document.getElementById('card-bg-color').value,
    'card-dark-bg-color': document.getElementById('card-dark-bg-color').value,
    'card-light-bg-color': document.getElementById('card-light-bg-color').value,
    'card-border-color': document.getElementById('card-border-color').value,
    'card-hover-bg-color': document.getElementById('card-hover-bg-color').value,
    'card-light-hover-bg-color': document.getElementById('card-light-hover-bg-color').value,
    'card-light-hover-border-color': document.getElementById('card-light-hover-border-color').value,
    'menu-bg-color': document.getElementById('menu-bg-color').value,
    'menu-hover-bg-color': document.getElementById('menu-hover-bg-color').value,
    'menu-border-color': document.getElementById('menu-border-color').value,
    'menu-light-bg-color': document.getElementById('menu-light-bg-color').value,
    'menu-light-hover-bg-color': document.getElementById('menu-light-hover-bg-color').value,
    'menu-light-active-bg-color': document.getElementById('menu-light-active-bg-color').value,
    'menu-light-border-color': document.getElementById('menu-light-border-color').value,
    'link-color': document.getElementById('link-color').value,
    'link-hover-color': document.getElementById('link-hover-color').value,
    'input-box-bg-color': document.getElementById('input-box-bg-color').value,
    'input-checkbox-toggle-bg-color': document.getElementById('input-checkbox-toggle-bg-color').value,
    'input-checkbox-active-bg-color': document.getElementById('input-checkbox-active-bg-color').value,
    'input-checkbox-inactive-bg-color': document.getElementById('input-checkbox-inactive-bg-color').value
  }, () => {
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 750);
  });
}

function restore () {
  chrome.storage.local.get({
    'selection-bg-color': '#445',
    'selection-text-color': '#dde',
    'body-font': '"Open Sans", sans-serif',
    'bg-color': '#1b1b1d',
    'main-text-color': '#aaaab6',
    'main-faded-text-color': '#66666c',
    'author-highlight-bg-color': '#445',
    'sep-line-color': '#36363f',
    'card-bg-color': '#222225',
    'card-dark-bg-color': '#1e1e20',
    'card-light-bg-color': '#2a2a2d',
    'card-border-color': '#2f2f34',
    'card-hover-bg-color': '#2a2a2d',
    'card-light-hover-bg-color': '#303034',
    'card-light-hover-border-color': '#404044',
    'menu-bg-color': '#2a2a2e',
    'menu-hover-bg-color': '#2f2f34',
    'menu-border-color': '#36363f',
    'menu-light-bg-color': '#3a3a44',
    'menu-light-hover-bg-color': '#3f3f48',
    'menu-light-active-bg-color': '#46464f',
    'menu-light-border-color': '#46464f',
    'link-color': '#ddd',
    'link-hover-color': '#fff',
    'input-box-bg-color': '#171719',
    'input-checkbox-toggle-bg-color': '#54545a',
    'input-checkbox-active-bg-color': '#3a3a44',
    'input-checkbox-inactive-bg-color': '#22222'
  }, prefs => {
    Object.keys(prefs).forEach(pref => {
      document.getElementById(pref).value = prefs[pref];
    });
  });
}
document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
