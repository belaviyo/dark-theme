/* globals safari */
'use strict';

var style = document.createElement('style');
style.type = 'text/css';

safari.self.addEventListener('message', (e) => {
  if (e.name === 'theme') {
    if (e.message.enabled === '0' && style.parentNode) {
      style.parentNode.removeChild(style);
    }
    style.textContent = e.message.theme;
  }
  else if (e.name === 'toggle') {
    if (e.message === '1') {
      document.documentElement.appendChild(style);
    }
    else {
      style.parentNode.removeChild(style);
    }
  }
});
safari.self.tab.dispatchMessage('get-theme');

document.documentElement.appendChild(style);
// reinsert when body is ready
var mutation = new MutationObserver(() => {
  document.documentElement.appendChild(style);
  mutation.disconnect();
});
mutation.observe(document, {childList: true, subtree: true});
/*
window.addEventListener('resize', () => {
  document.documentElement.appendChild(style);
});
*/
