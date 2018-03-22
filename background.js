let facebookCookieStoreId = null;

// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const FACEBOOK_CONTAINER_NAME = "Facebook";
const FACEBOOK_CONTAINER_COLOR = "blue";
const FACEBOOK_CONTAINER_ICON = "briefcase";
const FACEBOOK_DOMAINS = ["facebook.com", "fb.com"];

const facebookHostREs = [];

for (let facebookDomain of FACEBOOK_DOMAINS) {
  facebookHostREs.push(new RegExp(`^(.*)?${facebookDomain}$`));
  const facebookCookieUrl = `https://${facebookDomain}/`;

  browser.cookies.getAll({domain: facebookDomain}).then(cookies => {
    for (let cookie of cookies) {
      browser.cookies.remove({name: cookie.name, url: facebookCookieUrl});
    }
  });
}

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
    if (tabCookieStoreId !== facebookCookieStoreId) {
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
browser.webRequest.onBeforeRequest.addListener(containFacebook, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);
