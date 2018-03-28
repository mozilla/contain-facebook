// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const FACEBOOK_CONTAINER_NAME = "Facebook";
const FACEBOOK_CONTAINER_COLOR = "blue";
const FACEBOOK_CONTAINER_ICON = "briefcase";
const FACEBOOK_DOMAINS = ["facebook.com", "www.facebook.com", "fb.com"];

const MAC_ADDON_ID = "@testpilot-containers";

let facebookCookieStoreId = null;

const canceledRequests = {};
const facebookHostREs = [];

async function isFacebookAlreadyAssignedInMAC () {
  let macAddonInfo;
  // If the MAC add-on isn't installed, return false
  try {
    macAddonInfo = await browser.management.get(MAC_ADDON_ID);
  } catch (e) {
    return false;
  }
  let anyFBDomainsAssigned = false;
  for (let facebookDomain of FACEBOOK_DOMAINS) {
    const facebookCookieUrl = `https://${facebookDomain}/`;
    const assignment = await browser.runtime.sendMessage(MAC_ADDON_ID, {
      method: "getAssignment",
      url: facebookCookieUrl
    });
    if (assignment) {
      anyFBDomainsAssigned = true;
    }
  }
  return anyFBDomainsAssigned;
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

(async function init() {
  const facebookAlreadyAssigned = await isFacebookAlreadyAssignedInMAC();
  if (facebookAlreadyAssigned) {
    return;
  }

  // Clear all facebook cookies
  for (let facebookDomain of FACEBOOK_DOMAINS) {
    facebookHostREs.push(new RegExp(`^(.*)?${facebookDomain}$`));
    const facebookCookieUrl = `https://${facebookDomain}/`;

    browser.cookies.getAll({domain: facebookDomain}).then(cookies => {
      for (let cookie of cookies) {
        browser.cookies.remove({name: cookie.name, url: facebookCookieUrl});
      }
    });
  }

  // Use existing Facebook container, or create one
  browser.contextualIdentities.query({name: FACEBOOK_CONTAINER_NAME}).then(contexts => {
    if (contexts.length > 0) {
      facebookCookieStoreId = contexts[0].cookieStoreId;
    } else {
      browser.contextualIdentities.create({
        name: FACEBOOK_CONTAINER_NAME,
        color: FACEBOOK_CONTAINER_COLOR,
        icon: FACEBOOK_CONTAINER_ICON}
      ).then(context => {
        facebookCookieStoreId = context.cookieStoreId;
      });
    }
  });

  // Listen to requests and open Facebook into its Container,
  // open other sites into the default tab context
  async function containFacebook(options) {
    const requestUrl = new URL(options.url);
    let isFacebook = false;
    for (let facebookHostRE of facebookHostREs) {
      if (facebookHostRE.test(requestUrl.host)) {
        isFacebook = true;
        break;
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
          browser.tabs.create({url: requestUrl.toString(), cookieStoreId: facebookCookieStoreId});
          browser.tabs.remove(options.tabId);
          return {cancel: true};
        }
      }
    } else {
      if (tabCookieStoreId === facebookCookieStoreId) {
        if (shouldCancelEarly(tab, options)) {
          return {cancel: true};
        }
        browser.tabs.create({url: requestUrl.toString()});
        browser.tabs.remove(options.tabId);
        return {cancel: true};
      }
    }
  }

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
