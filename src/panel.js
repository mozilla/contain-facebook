/* global browser */

document.addEventListener("DOMContentLoaded", async () => {
  if (document.querySelector("#panel1") !== null) {
    await browser.storage.local.set({PANEL_SHOWN: true});
    await browser.browserAction.setBadgeText({text: ""});
  }

  const uiMessages = document.querySelectorAll(".uiMessage");
  uiMessages.forEach(el => {
    const message = browser.i18n.getMessage(el.id);
    el.textContent = message;
  });
});
