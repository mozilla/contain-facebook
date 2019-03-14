/* global browser */

document.addEventListener("DOMContentLoaded", async () => {
  if (document.querySelector("#panel1") !== null) {
    await browser.storage.local.set({PANEL_SHOWN: true});
    await browser.browserAction.setBadgeText({text: ""});
  }

  const tabsQueryResult = await browser.tabs.query({currentWindow: true, active: true});
  const currentActiveTab = tabsQueryResult[0];
  const currentActiveURL = new URL(currentActiveTab.url);
  const currentActiveHostname = currentActiveURL.hostname;

  const uiMessages = document.querySelectorAll(".uiMessage");
  uiMessages.forEach(el => {
    const message = browser.i18n.getMessage(el.id, currentActiveHostname);
    el.textContent = message;
  });
});
