'use strict';

chrome.storage.onChanged.addListener(prefs => {
  if (prefs.enabled) {
    var toggle = document.querySelector('.DashUserDropdown .js-nightmode-icon');
    if (toggle) {
      if (document.cookie.indexOf('night_mode=1') === -1 && prefs.enabled.newValue) {
        toggle.closest('a').click();
      }
      if (document.cookie.indexOf('night_mode=1') !== -1 && prefs.enabled.oldValue) {
        toggle.closest('a').click();
      }
    }
    else {
      window.location.reload();
    }
  }
});

var style = document.createElement('style');
style.type = 'text/css';
var enabled = true;

const update = () => chrome.storage.local.get({
  'background-color': '#2e2e2e',
  'text-color': '#d2cfcf',
  'toolbar-color': '#1f1f1f',
  'stream-color': '#212121',
  'module-color': '#212121'
}, prefs => {
  style.textContent = `
    body {
      background-color: ${prefs['background-color']} !important;
    }
    body,
    .flex-module-header h3,
    .SummaryCard-content,
    .TwitterCard-title,
    .fullname {
      color: ${prefs['text-color']} !important;
    }
    .global-nav-inner {
      background-color: ${prefs['toolbar-color']} !important;
    }
    .stream-item {
      background-color: ${prefs['stream-color']} !important;
    }
    .module,
    .flex-module {
      background-color: ${prefs['module-color']} !important;
    }
  `;
});
update();

chrome.storage.onChanged.addListener(prefs => {
  if (prefs.enabled) {
    enabled = prefs.enabled.newValue;
    if (enabled) {
      document.documentElement.appendChild(style);
    }
    else {
      try {
        document.documentElement.removeChild(style);
      }
      catch (e) {}
    }
  }
  if (prefs['background-color'] || prefs['text-color'] || prefs['border-color']) {
    update();
  }
});

// reinsert when body is ready
var mutation = new MutationObserver(() => {
  if (enabled) {
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
