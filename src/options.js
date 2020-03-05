"use strict";

function getLocalizedStrings() {
  const strings = document.querySelectorAll(".i18n-string");
  for (let string of strings) {
    const stringID = string.dataset.i18n;
    const localizedTextString = browser.i18n.getMessage(stringID);
    string.textContent = localizedTextString;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  getLocalizedStrings();
});
