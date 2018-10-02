'use strict';

function update(bol) {
  const path = {
    path: {
      '16': 'data/icons' + (bol ? '/' : '/disabled/') + '16.png',
      '19': 'data/icons' + (bol ? '/' : '/disabled/') + '19.png',
      '32': 'data/icons' + (bol ? '/' : '/disabled/') + '32.png',
      '38': 'data/icons' + (bol ? '/' : '/disabled/') + '38.png',
      '48': 'data/icons' + (bol ? '/' : '/disabled/') + '48.png',
      '64': 'data/icons' + (bol ? '/' : '/disabled/') + '64.png'
    }
  };
  chrome.browserAction.setIcon(path);
  chrome.browserAction.setTitle({
    title: 'Dark Theme for Reddit (' + (bol ? 'enabled' : 'disabled') + ')'
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
// FAQs & Feedback
chrome.storage.local.get({
  'version': null,
  'faqs': navigator.userAgent.indexOf('Firefox') === -1,
  'last-update': 0,
}, prefs => {
  const version = chrome.runtime.getManifest().version;

  if (prefs.version ? (prefs.faqs && prefs.version !== version) : true) {
    const now = Date.now();
    const doUpdate = (now - prefs['last-update']) / 1000 / 60 / 60 / 24 > 30;
    chrome.storage.local.set({
      version,
      'last-update': doUpdate ? Date.now() : prefs['last-update']
    }, () => {
      // do not display the FAQs page if last-update occurred less than 30 days ago.
      if (doUpdate) {
        const p = Boolean(prefs.version);
        window.setTimeout(() => chrome.tabs.create({
          url: chrome.runtime.getManifest().homepage_url + '&version=' + version +
            '&type=' + (p ? ('upgrade&p=' + prefs.version) : 'install'),
          active: p === false
        }), 3000);
      }
    });
  }
});

{
  const {name, version} = chrome.runtime.getManifest();
  chrome.runtime.setUninstallURL(
    chrome.runtime.getManifest().homepage_url + '&rd=feedback&name=' + name + '&version=' + version
  );
}
