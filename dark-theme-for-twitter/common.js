'use strict';

function set(enabled) {
  if (enabled) {
    chrome.cookies.set({
      url: 'https://twitter.com/',
      domain: '.twitter.com',
      name: 'night_mode',
      value: '1'
    });
  }
  else {
    chrome.cookies.remove({
      url: 'https://twitter.com/',
      name: 'night_mode'
    });
  }
}

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
    title: 'Dark Theme for Twitter (' + (bol ? 'enabled' : 'disabled') + ')'
  });
}

chrome.cookies.onChanged.addListener(changeInfo => {
  if (changeInfo.cookie.name === 'night_mode' && changeInfo.cookie.domain === '.twitter.com') {
    if (changeInfo.cause === 'explicit') {
      chrome.cookies.get({
        url: 'https://twitter.com/',
        name: 'night_mode'
      }, cookie => {
        const enabled = Boolean(cookie && cookie.value === '1');
        chrome.storage.local.set({enabled}, () => update(enabled));
      });
    }
  }
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.storage.local.get({
    enabled: true
  }, prefs => set(!prefs.enabled));
});

chrome.storage.local.get({
  enabled: true
}, prefs => {
  set(prefs.enabled);
  // if disabled (there is no cookie) and hence update is not being called
  if (!prefs.enabled) {
    update(prefs.enabled);
  }
});

// FAQs & Feedback
chrome.storage.local.get({
  'version': null,
  'faqs': navigator.userAgent.indexOf('Firefox') === -1
}, prefs => {
  const version = chrome.runtime.getManifest().version;

  if (prefs.version ? (prefs.faqs && prefs.version !== version) : true) {
    chrome.storage.local.set({version}, () => {
      chrome.tabs.create({
        url: 'http://add0n.com/dark-theme.html?from=twitter&version=' + version +
          '&type=' + (prefs.version ? ('upgrade&p=' + prefs.version) : 'install')
      });
    });
  }
});
{
  const {name, version} = chrome.runtime.getManifest();
  chrome.runtime.setUninstallURL('http://add0n.com/feedback.html?name=' + name + '&version=' + version);
}
