"use strict";

function getLocalizedStrings() {
  const strings = document.querySelectorAll(".i18n-string");
  for (let string of strings) {
    const stringID = string.dataset.i18n;
    const localizedTextString = browser.i18n.getMessage(stringID);
    string.textContent = localizedTextString;
  }
}

function buildSettingsObject() {
  let data = {};
  const checkboxes = document.querySelectorAll(".settings-checkbox");

  checkboxes.forEach((item) => {
    let settingName = item.id;
    Object.defineProperty(data, settingName, {
      value: item.checked,
      writable: true,
      configurable: true,
      enumerable: true
    });
  });

  return data;
}

async function updateSettings() {
  let localStorage = await browser.storage.local.get();

  const checkboxes = document.querySelectorAll(".settings-checkbox");

  checkboxes.forEach((item) => {
    let settingName = item.id;
    item.checked = localStorage.settings[settingName];
  });

  await settingsCheckboxListener();
}

function settingsCheckboxListener(){
  const checkboxes = document.querySelectorAll(".settings-checkbox");

  checkboxes.forEach((item) => {
    item.addEventListener("change", async () => {
      const settings = buildSettingsObject();
      await browser.runtime.sendMessage({
        message: "update-settings",
        settings
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  getLocalizedStrings();
  await updateSettings();
});
