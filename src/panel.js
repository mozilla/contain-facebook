/* global browser */

document.addEventListener("DOMContentLoaded", async () => {
  const {PANEL_SHOWN} = await browser.storage.local.get("PANEL_SHOWN");
  if (document.querySelector("#panel1") !== null && !PANEL_SHOWN) {
    await browser.storage.local.set({PANEL_SHOWN: true});
    const tabs = await browser.tabs.query({});
    tabs.map(tab => {
      browser.browserAction.setBadgeText({tabId: tab.id, text: ""});
    });
  }

  const tabsQueryResult = await browser.tabs.query({currentWindow: true, active: true});
  const currentActiveTab = tabsQueryResult[0];
  const currentActiveURL = new URL(currentActiveTab.url);

  const uiMessages = document.querySelectorAll(".uiMessage");
  for (const el of uiMessages) {
    if (el.id.endsWith("Header") && currentActiveURL.hostname == "") {
      el.textContent = browser.i18n.getMessage("onUnknownSiteHeader");
      continue;
    }
    el.textContent = browser.i18n.getMessage(el.id, currentActiveURL.hostname);
  }
});


browser.runtime.onMessage.addListener(message => {
  console.log("message from background script: ", message);
  return Promise.resolve({response: "panel.js onMessage listener"});
});
