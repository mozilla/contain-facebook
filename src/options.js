"use strict";

function getLocalizedStrings() {
  const strings = document.querySelectorAll(".i18n-string");
  for (let string of strings) {
    const stringID = string.dataset.i18n;
    const localizedTextString = browser.i18n.getMessage(stringID);
    string.textContent = localizedTextString;
  }
}

async function resetSettingsToDefault() {
  const checkboxes = document.querySelectorAll(".settings-checkbox");

  const defaultSettings = await browser.runtime.sendMessage({
    message: "get-default-settings"
  });

  checkboxes.forEach((item) => {
    item.checked = defaultSettings[item.id];
  });

  const settings = buildSettingsObject();
  await browser.runtime.sendMessage({
    message: "update-settings",
    settings
  });

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

  const resetSettingsButton = document.getElementById("resetSettingsButton");
  resetSettingsButton.addEventListener("click", () => resetSettingsToDefault(), false);
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

async function removeAllowedSite() {
  await browser.runtime.sendMessage({
    message: "remove-domain-from-list",
    removeDomain: this.dataset.site
  });
  browser.tabs.reload();
}

const allowedSitesList = document.querySelector(".added-urls");

const AllowedSites = {
  build: function(sites) {
    allowedSitesList.innerHTML = "";
    if (sites.length < 1) {
      AllowedSites.setEmptyState();
    } else {
      for (let site of sites) {
        let listItem = document.createElement("li");

        let urlItem = document.createElement("div");
        urlItem.classList.add("url-item");

        let urlItemImage = document.createElement("div");
        urlItemImage.classList.add("allowed-site-icon");

        let faviconUrl = `https://${site}/favicon.ico`;

        const testFavicon = {
          favIconError: function() {
            urlItemImage.classList.add("no-image");
          },
          favIconFound: function() {
            urlItemImage.style.backgroundImage = `url(https://${site}/favicon.ico`;
          },
          init: function(URL) {
            let tester=new Image();
            tester.addEventListener("load", this.favIconFound);
            tester.addEventListener("error", this.favIconError);
            tester.src=URL;
          }
        };

        testFavicon.init(faviconUrl);

        urlItem.appendChild(urlItemImage);

        let urlDomainWrapper = document.createElement("div");
        urlDomainWrapper.classList.add("url-domain-wrapper");

        let urlDomainRemoveButton = document.createElement("button");
        urlDomainRemoveButton.classList.add("remove-site");
        urlDomainRemoveButton.type = "button";
        urlDomainRemoveButton.dataset.site = site;
        urlDomainWrapper.appendChild(urlDomainRemoveButton);

        let urlDomainSpan = document.createElement("span");
        urlDomainSpan.textContent = site;
        urlDomainWrapper.appendChild(urlDomainSpan);

        urlItem.appendChild(urlDomainWrapper);
        listItem.appendChild(urlItem);
        allowedSitesList.appendChild(listItem);
      }
      AllowedSites.setRemoverListeners();
    }
  },
  init: async function() {
    const siteList = await browser.runtime.sendMessage({
      message: "what-sites-are-added"
    });
    AllowedSites.build(siteList);
  },
  setEmptyState: function() {
    let listItem = document.createElement("li");
    let urlItem = document.createElement("div");
    urlItem.textContent = browser.i18n.getMessage("no-sites-added");
    urlItem.classList.add("url-item", "empty");
    listItem.appendChild(urlItem);
    allowedSitesList.appendChild(listItem);
  },
  setRemoverListeners: function() {
    const domainRemoveButtons = document.querySelectorAll(".remove-site");
    for (let button of domainRemoveButtons) {
      button.addEventListener("click", removeAllowedSite, false);
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  getLocalizedStrings();
  await updateSettings();
  await AllowedSites.init();
});
