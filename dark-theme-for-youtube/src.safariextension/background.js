/* globals safari */
'use strict';

safari.application.addEventListener('message', (e) => {
  if (e.name === 'get-theme') {
    let url = safari.extension.baseURI + 'data/youtube-umbra.css';
    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = () => {
      let response = req.response;
      [
        'selection-bg-color',
        'selection-text-color',
        'body-font',
        'bg-color',
        'main-text-color',
        'main-faded-text-color',
        'author-highlight-bg-color',
        'sep-line-color',
        'card-bg-color',
        'card-dark-bg-color',
        'card-light-bg-color',
        'card-border-color',
        'card-hover-bg-color',
        'card-light-hover-bg-color',
        'card-light-hover-border-color',
        'menu-bg-color',
        'menu-hover-bg-color',
        'menu-border-color',
        'menu-light-bg-color',
        'menu-light-hover-bg-color',
        'menu-light-active-bg-color',
        'menu-light-border-color',
        'link-color',
        'link-hover-color',
        'input-box-bg-color',
        'input-checkbox-toggle-bg-color',
        'input-checkbox-active-bg-color',
        'input-checkbox-inactive-bg-color'
      ].forEach(name => {
        response = response.replace('%' + name, safari.extension.settings.getItem(name));
      });

      e.target.page.dispatchMessage('theme', {
        theme: response,
        enabled: safari.extension.settings.getItem('toolbar')
      });
    };
    req.send();
  }
});

function update () {
  let i = safari.extension.settings.getItem('toolbar');
  let image = safari.extension.baseURI + ('data/icons/32-' + (i === '1' ? 'enabled' : 'disabled') + '.png');
  safari.extension.toolbarItems[0].image = image;
}

safari.application.addEventListener('command', () => {
  let i = safari.extension.settings.getItem('toolbar');
  if (i === '0') {
    i = '1';
  }
  else {
    i = '0';
  }
  // save prefs
  safari.extension.settings.setItem('toolbar', i);
  // send message to tabs
  safari.application.browserWindows.forEach((win) => {
    win.tabs.forEach(tab => tab.page && tab.page.dispatchMessage('toggle', i));
  });
  // toolbar icon
  update();
}, false);

update();

// FAQs page
(function () {
  let saved = safari.extension.settings.version;
  let version = safari.extension.displayVersion;

  if (version !== saved) {
    if (safari.extension.settings.welcome === 'true') {
      let tab = safari.application.activeBrowserWindow.openTab();
      tab.url = 'http://add0n.com/dark-theme.html?version=' +
        version + '&type=' +
        (saved ? ('upgrade&p=' + saved) : 'install');
    }
    safari.extension.settings.version = version;
  }
})();
