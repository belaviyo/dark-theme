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
    title: chrome.i18n.getMessage('name') + ' (' + (bol ? 'enabled' : 'disabled') + ')'
  });
}

chrome.browserAction.onClicked.addListener(() => chrome.storage.local.get({
  enabled: true
}, prefs => {
  prefs.enabled = !prefs.enabled;
  chrome.storage.local.set(prefs);
}));

// Schedule
const alarm = (id, val) => {
  val = val.split(':');
  const d = new Date();
  d.setSeconds(0);
  d.setHours(val[0]);
  d.setMinutes(val[1]);

  const now = Date.now();
  const when = d.getTime();

  chrome.alarms.create(id, {
    when: when <= now ? when + 24 * 60 * 60 * 1000 : when,
    periodInMinutes: 24 * 60
  });
};
const idle = state => state === 'active' && configure();

chrome.storage.onChanged.addListener(prefs => {
  if (prefs['day-time'] || prefs['night-time'] || prefs['schedule']) {
    chrome.storage.local.get({
      'day-time': '19:00',
      'night-time': '08:00',
      'schedule': false
    }, prefs => {
      if (prefs.schedule) {
        alarm('day-time', prefs['day-time']);
        alarm('night-time', prefs['night-time']);
        chrome.idle.onStateChanged.removeListener(idle);
        chrome.idle.onStateChanged.addListener(idle);
        configure();
      }
      else {
        chrome.alarms.clear('day-time');
        chrome.alarms.clear('night-time');
        chrome.idle.onStateChanged.removeListener(idle);
      }
    });
  }
  if (prefs.enabled) {
    update(prefs.enabled.newValue);
  }
});

// status
const configure = () => chrome.storage.local.get({
  'day-time': '19:00',
  'night-time': '08:00'
}, prefs => {
  const day = prefs['day-time'].split(':').map((s, i) => s * (i === 0 ? 60 : 1)).reduce((p, c) => p + c, 0);
  let night = prefs['night-time'].split(':').map((s, i) => s * (i === 0 ? 60 : 1)).reduce((p, c) => p + c, 0);

  if (night <= day) {
    night += 24 * 60;
  }
  const d = new Date();
  const now = d.getMinutes() + d.getHours() * 60;

  chrome.storage.local.set({
    enabled: now >= day && now < night
  });
});
chrome.alarms.onAlarm.addListener(configure);

// start-up
{
  const once = () => chrome.storage.local.get({
    'enabled': true,
    'day-time': '19:00',
    'night-time': '08:00',
    'schedule': false
  }, prefs => {
    update(prefs.enabled);
    if (prefs.schedule) {
      alarm('day-time', prefs['day-time']);
      alarm('night-time', prefs['night-time']);
      chrome.idle.onStateChanged.removeListener(idle);
      chrome.idle.onStateChanged.addListener(idle);
      configure();
    }
  });
  // chrome.runtime.onInstalled.addListener(once);
  // chrome.runtime.onStartup.addListener(once);
  once(); // disable and re-enable the extension and test idle listener
}

// FAQs and Feedback
{
  const {onInstalled, setUninstallURL, getManifest} = chrome.runtime;
  const {name, version} = getManifest();
  const page = getManifest().homepage_url;
  onInstalled.addListener(({reason, previousVersion}) => {
    chrome.storage.local.get({
      'faqs': true,
      'last-update': 0
    }, prefs => {
      if (reason === 'install' || (prefs.faqs && reason === 'update')) {
        const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
        if (doUpdate && previousVersion !== version) {
          chrome.tabs.create({
            url: page + '&version=' + version +
              (previousVersion ? '&p=' + previousVersion : '') +
              '&type=' + reason,
            active: reason === 'install'
          });
          chrome.storage.local.set({'last-update': Date.now()});
        }
      }
    });
  });
  setUninstallURL(page + '&rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
}
