let facebookCookieStoreId = null;

// Param values from https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities/create
const FACEBOOK_CONTAINER_NAME = "Facebook";
const FACEBOOK_CONTAINER_COLOR = "blue";
const FACEBOOK_CONTAINER_ICON = "circle";

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

browser.webRequest.onBeforeRequest.addListener(options => {
  const requestUrl = options.url;
  const isFacebook = requestUrl.indexOf("facebook.com") > -1;
  browser.tabs.get(options.tabId).then(tab => {
    const tabCookieStoreId = tab.cookieStoreId;
    if (isFacebook) {
      if (tabCookieStoreId !== facebookCookieStoreId) {
        browser.tabs.create({url: requestUrl, cookieStoreId: facebookCookieStoreId});
        browser.tabs.remove(options.tabId);
        return {cancel: true};
      }
    } else {
      if (tabCookieStoreId === facebookCookieStoreId) {
        browser.tabs.create({url: requestUrl});
        browser.tabs.remove(options.tabId);
        return {cancel: true};
      }
    }
  });
},{urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);
