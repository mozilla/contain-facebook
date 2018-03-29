// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const FACEBOOK_CONTAINER_NAME = "Facebook";
const FACEBOOK_CONTAINER_COLOR = "blue";
const FACEBOOK_CONTAINER_ICON = "briefcase";
const FACEBOOK_DOMAINS = ["facebook.com", "www.facebook.com", "fb.com", "messenger.com", "www.messenger.com"];

const MAC_ADDON_ID = "@testpilot-containers";

let macAddonEnabled = false;
let facebookCookieStoreId = null;
let facebookCookiesCleared = false;

const facebookHostREs = [];

async function isMACAddonEnabled () {
  try {
    const macAddonInfo = await browser.management.get(MAC_ADDON_ID);
    if (macAddonInfo.enabled) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

async function setupMACAddonManagementListeners () {
  browser.management.onInstalled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = true;
    }
  });
  browser.management.onUninstalled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = false;
    }
  })
  browser.management.onEnabled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = true;
    }
  })
  browser.management.onDisabled.addListener(info => {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = false;
    }
  })
}

async function getMACAssignment (url) {
  try {
    const assignment = await browser.runtime.sendMessage(MAC_ADDON_ID, {
      method: "getAssignment",
      url
    });
    return assignment;
  } catch (e) {
    return false;
  }
}

function generateFacebookHostREs () {
  for (let facebookDomain of FACEBOOK_DOMAINS) {
    facebookHostREs.push(new RegExp(`^(.*\\.)?${facebookDomain}$`));
  }
}

function clearFacebookCookies () {
  // Clear all facebook cookies
  for (let facebookDomain of FACEBOOK_DOMAINS) {
    const facebookCookieUrl = `https://${facebookDomain}/`;

    browser.cookies.getAll({domain: facebookDomain}).then(cookies => {
      for (let cookie of cookies) {
        browser.cookies.remove({name: cookie.name, url: facebookCookieUrl});
      }
    });
  }
}

async function setupContainer () {
  // Use existing Facebook container, or create one
  const contexts = await browser.contextualIdentities.query({name: FACEBOOK_CONTAINER_NAME})
  if (contexts.length > 0) {
    facebookCookieStoreId = contexts[0].cookieStoreId;
  } else {
    const context = await browser.contextualIdentities.create({
      name: FACEBOOK_CONTAINER_NAME,
      color: FACEBOOK_CONTAINER_COLOR,
      icon: FACEBOOK_CONTAINER_ICON
    })
    facebookCookieStoreId = context.cookieStoreId;
  }
}

async function containFacebook (options) {
  // Listen to requests and open Facebook into its Container,
  // open other sites into the default tab context
  const requestUrl = new URL(options.url);

  let isFacebook = false;
  for (let facebookHostRE of facebookHostREs) {
    if (facebookHostRE.test(requestUrl.host)) {
      isFacebook = true;
      break;
    }
  }

  // We have to check with every request if Facebook is assigned with MAC
  // because the user can assign it at any given time (needs MAC Events)
  if (isFacebook && macAddonEnabled) {
    const facebookAlreadyAssigned = await getMACAssignment(options.url);
    if (facebookAlreadyAssigned) {
      // This Facebook URL is assigned with MAC, so we don't handle this request
      return;
    }
  }

  const tab = await browser.tabs.get(options.tabId);
  const tabCookieStoreId = tab.cookieStoreId;
  if (isFacebook) {
    if (tabCookieStoreId !== facebookCookieStoreId && !tab.incognito) {
      // See https://github.com/mozilla/contain-facebook/issues/23
      // Sometimes this add-on is installed but doesn't get a facebookCookieStoreId ?
      if (facebookCookieStoreId) {
        browser.tabs.create({
          url: requestUrl.toString(),
          cookieStoreId: facebookCookieStoreId,
          active: tab.active,
          index: tab.index
        });
        browser.tabs.remove(options.tabId);
        return {cancel: true};
      }
    }
  } else {
    if (tabCookieStoreId === facebookCookieStoreId) {
      browser.tabs.create({
        url: requestUrl.toString(),
        active: tab.active,
        index: tab.index
      });
      browser.tabs.remove(options.tabId);
      return {cancel: true};
    }
  }
}

(async function init() {
  await setupMACAddonManagementListeners();
  macAddonEnabled = await isMACAddonEnabled();

  clearFacebookCookies();
  generateFacebookHostREs();
  await setupContainer();

  // Add the request listener
  browser.webRequest.onBeforeRequest.addListener(containFacebook, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);
})();
