/* global browser */

(async () => {
  await browser.storage.local.set({PANEL_SHOWN: true});
  await browser.browserAction.setBadgeText({text: ""});
})();
