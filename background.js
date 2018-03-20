let facebookCookieStoreId = null;

browser.contextualIdentities.query({name: "Facebook"}).then(contexts => {
  if (contexts.length > 0) {
    console.log("User already has a/the Facebook container, assigning cookieStoreId: ", contexts[0].cookieStoreId);
    facebookCookieStoreId = contexts[0].cookieStoreId;
  } else {
    browser.contextualIdentities.create({name: "Facebook", color: "blue", icon: "circle"}).then(context => {
      console.log("created context. Assigning cookieStoreId: ", context.cookieStoreId);
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
      console.log("detected a top-level load to facebook.com ...");
      if (tabCookieStoreId !== facebookCookieStoreId) {
        console.log("not in the facebookCookieStoreId! (", facebookCookieStoreId, "). Switching cookieStoreId.");
        browser.tabs.create({url: requestUrl, cookieStoreId: facebookCookieStoreId});
        browser.tabs.remove(options.tabId);
        return {cancel: true};
      }
    } else {
      console.log("detected a top-level load NOT to facebook.com ...");
      if (tabCookieStoreId === facebookCookieStoreId) {
        console.log("IN the facebookCookieStoreId! (", facebookCookieStoreId, "). Switching cookieStoreId.");
        browser.tabs.create({url: requestUrl});
        browser.tabs.remove(options.tabId);
        return {cancel: true};
      }
    }
  });
},{urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);
