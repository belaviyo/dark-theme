'use strict';

var style = document.createElement('style');
style.type = 'text/css';

// load style
var req = new XMLHttpRequest();
req.open('GET', chrome.runtime.getURL('data/youtube-umbra.css'));
req.onload = () => {
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
    let response = req.response;
    Object.keys(prefs).forEach(name => {
      response = response.replace('%' + name, prefs[name]);
    });
    style.textContent = response;
  });
};
req.send();

document.documentElement.appendChild(style);
// reinsert when body is ready
var mutation = new MutationObserver(() => {
  document.documentElement.appendChild(style);
  mutation.disconnect();
});
mutation.observe(document, {childList: true, subtree: true});
