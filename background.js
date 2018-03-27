// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const FACEBOOK_CONTAINER_NAME = "Facebook";
const FACEBOOK_CONTAINER_COLOR = "blue";
const FACEBOOK_CONTAINER_ICON = "briefcase";
const FACEBOOK_DOMAINS = ["facebook.com", "www.facebook.com", "fb.com", "fbcdn.net", "instagram.com", "www.instagram.com", "whatsapp.com", "www.whatsapp.com", "web.whatsapp.com", "messenger.com", "www.messenger.com"];

const MAC_ADDON_ID = "@testpilot-containers";

let macAddonEnabled = false;
let facebookCookieStoreId = null;
let facebookCookiesCleared = false;

const canceledRequests = {};
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

function cancelRequest (tab, options) {
  // we decided to cancel the request at this point, register canceled request
  canceledRequests[tab.id] = {
    requestIds: {
      [options.requestId]: true
    },
    urls: {
      [options.url]: true
    }
  };

  // since webRequest onCompleted and onErrorOccurred are not 100% reliable
  // we register a timer here to cleanup canceled requests, just to make sure we don't
  // end up in a situation where certain urls in a tab.id stay canceled
  setTimeout(() => {
    if (canceledRequests[tab.id]) {
      delete canceledRequests[tab.id];
    }
  }, 2000);
}

function shouldCancelEarly (tab, options) {
  // we decided to cancel the request at this point
  if (!canceledRequests[tab.id]) {
    cancelRequest(tab, options);
  } else {
    let cancelEarly = false;
    if (canceledRequests[tab.id].requestIds[options.requestId] ||
        canceledRequests[tab.id].urls[options.url]) {
      // same requestId or url from the same tab
      // this is a redirect that we have to cancel early to prevent opening two tabs
      cancelEarly = true;
    }
    // register this requestId and url as canceled too
    canceledRequests[tab.id].requestIds[options.requestId] = true;
    canceledRequests[tab.id].urls[options.url] = true;
    if (cancelEarly) {
      return true;
    }
  }
  return false;
}

function generateFacebookHostREs () {
  for (let facebookDomain of FACEBOOK_DOMAINS) {
    facebookHostREs.push(new RegExp(`^(.*\\.)?${facebookDomain}$`));
  }
}

async function clearFacebookCookies () {
  // Clear all facebook cookies
  const containers = await browser.contextualIdentities.query({});
  containers.push({
    cookieStoreId: 'firefox-default'
  });
  containers.map(container => {
    const storeId = container.cookieStoreId;
    if (storeId === facebookCookieStoreId) {
      // Don't clear cookies in the Facebook Container
      return;
    }

    FACEBOOK_DOMAINS.map(async facebookDomain => {
      const facebookCookieUrl = `https://${facebookDomain}/`;

      const cookies = await browser.cookies.getAll({
        domain: facebookDomain,
        storeId
      });

      cookies.map(cookie => {
        browser.cookies.remove({
          name: cookie.name,
          url: facebookCookieUrl,
          storeId
        });
      });
    });
  });
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

  // We have to check with every request if the requested URL is assigned with MAC
  // because the user can assign URLs at any given time (needs MAC Events)
  if (macAddonEnabled) {
    const macAssigned = await getMACAssignment(options.url);
    if (macAssigned) {
      // This URL is assigned with MAC, so we don't handle this request
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
        if (shouldCancelEarly(tab, options)) {
          return {cancel: true};
        }
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
      if (shouldCancelEarly(tab, options)) {
        return {cancel: true};
      }
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

  await setupContainer();
  clearFacebookCookies();
  generateFacebookHostREs();

  // Add the request listener
  browser.webRequest.onBeforeRequest.addListener(containFacebook, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);

  // Clean up canceled requests
  browser.webRequest.onCompleted.addListener((options) => {
    if (canceledRequests[options.tabId]) {
     delete canceledRequests[options.tabId];
    }
  },{urls: ["<all_urls>"], types: ["main_frame"]});
  browser.webRequest.onErrorOccurred.addListener((options) => {
    if (canceledRequests[options.tabId]) {
      delete canceledRequests[options.tabId];
    }
  },{urls: ["<all_urls>"], types: ["main_frame"]});
})();
