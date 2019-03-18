/* global browser */

document.addEventListener("DOMContentLoaded", async () => {
  if (document.querySelector("#panel1") !== null) {
    await browser.storage.local.set({PANEL_SHOWN: true});
    await browser.browserAction.setBadgeText({text: ""});
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
