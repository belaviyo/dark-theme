'use strict';

function update(bol) {
  const path = {
    path: {
      '16': 'data/icons' + (bol ? '/' : '/disabled/') + '16.png',
      '32': 'data/icons' + (bol ? '/' : '/disabled/') + '32.png',
      '64': 'data/icons' + (bol ? '/' : '/disabled/') + '64.png'
    }
  };
  chrome.browserAction.setIcon(path);
  chrome.browserAction.setTitle({
    title: 'Dark Theme for Gmail (' + (bol ? 'enabled' : 'disabled') + ')'
  });
}

chrome.browserAction.onClicked.addListener(() => {
  chrome.storage.local.get({
    enabled: true
  }, prefs => {
    prefs.enabled = !prefs.enabled;
    chrome.storage.local.set(prefs);
    update(prefs.enabled);
  });
});

chrome.storage.local.get({
  enabled: true
}, prefs => update(prefs.enabled));

// FAQs & Feedback
chrome.storage.local.get({
  'version': null,
  'faqs': navigator.userAgent.indexOf('Firefox') === -1
}, prefs => {
  const version = chrome.runtime.getManifest().version;

  if (prefs.version ? (prefs.faqs && prefs.version !== version) : true) {
    chrome.storage.local.set({version}, () => {
      chrome.tabs.create({
        url: 'http://add0n.com/dark-theme.html?from=gmail&version=' + version +
          '&type=' + (prefs.version ? ('upgrade&p=' + prefs.version) : 'install')
      });
    });
  }
});
{
  const {name, version} = chrome.runtime.getManifest();
  chrome.runtime.setUninstallURL('http://add0n.com/feedback.html?name=' + name + '&version=' + version);
}
