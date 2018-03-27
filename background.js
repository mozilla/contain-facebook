// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const FACEBOOK_CONTAINER_NAME = "Facebook";
const FACEBOOK_CONTAINER_COLOR = "blue";
const FACEBOOK_CONTAINER_ICON = "briefcase";
const FACEBOOK_DOMAINS = ["facebook.com", "www.facebook.com", "fb.com", "instagram.com", "www.instagram.com", "whatsapp.com", "www.whatsapp.com", "web.whatsapp.com"];

let facebookCookieStoreId = null;

const facebookHostREs = [];

async function isFacebookAlreadyAssignedInMAC () {
  let anyFBDomainsAssigned = false;
  for (let facebookDomain of FACEBOOK_DOMAINS) {
    const facebookCookieUrl = `https://${facebookDomain}/`;
    let assignment;
    try {
      assignment = await browser.runtime.sendMessage("@testpilot-containers", {
        method: "getAssignment",
        url: facebookCookieUrl
      });
    } catch (e) {
      return false;
    }
    if (assignment) {
      anyFBDomainsAssigned = true;
    }
  }
  return anyFBDomainsAssigned;
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
          browser.tabs.create({url: requestUrl.toString(), cookieStoreId: facebookCookieStoreId});
          browser.tabs.remove(options.tabId);
          return {cancel: true};
        }
      }
    } else {
      if (tabCookieStoreId === facebookCookieStoreId) {
        browser.tabs.create({url: requestUrl.toString()});
        browser.tabs.remove(options.tabId);
        return {cancel: true};
      }
    }
  }

  // Add the request listener
  browser.webRequest.onBeforeRequest.addListener(containFacebook, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);
})();
