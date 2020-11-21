'use strict';

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

chrome.storage.onChanged.addListener(prefs => {
  if (prefs.enabled) {
    try {
      if (prefs.enabled.newValue === true) {
        getElementByXpath(
          '/html/body/ytd-app/ytd-popup-container/iron-dropdown/div/ytd-multi-page-menu-renderer/div[4]/ytd-multi-page-menu-renderer/div[3]/div[1]/yt-multi-page-menu-section-renderer/div[2]/ytd-compact-link-renderer[3]/a/paper-item'
        ).click();
      }
      else {
        getElementByXpath(
          '/html/body/ytd-app/ytd-popup-container/iron-dropdown/div/ytd-multi-page-menu-renderer/div[4]/ytd-multi-page-menu-renderer/div[3]/div[1]/yt-multi-page-menu-section-renderer/div[2]/ytd-compact-link-renderer[4]/a/paper-item'
        ).click();
      }
    }
    catch (e) {
      window.location.reload();
    }
  }
});

const style = document.createElement('style');
style.type = 'text/css';
style.media = 'screen';
let enabled = true;

const update = () => chrome.storage.local.get({
  'background-color': '#121212',
  'text-color': '#d2cfcf',
  'border-color': '#606060',
  'toolbar-color': '#1f1f1f',
  'custom-css': ''
}, prefs => {
  style.textContent = `
    [dark] *:not([style-scope]):not(.style-scope) {
      --yt-main-app-background: ${prefs['background-color']} !important;
      --yt-main-app-background-tmp: ${prefs['background-color']} !important;
      --yt-spec-general-background-a: ${prefs['background-color']} !important;
      --yt-primary-text-color: ${prefs['text-color']} !important;
      --yt-spec-text-primary: ${prefs['text-color']} !important;
      --yt-border-color: ${prefs['border-color']} !important;
      --yt-swatch-primary: ${prefs['toolbar-color']} !important;
      --yt-spec-brand-background-primary: ${prefs['toolbar-color']} !important;
      --yt-spec-brand-background-secondary: ${prefs['toolbar-color']} !important;
    }
  ` + prefs['custom-css'];
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
const mutation = new MutationObserver(() => {
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
