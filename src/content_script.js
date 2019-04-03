"use strict";

browser.runtime.onMessage.addListener(message => {
  console.log("message from background script:", message);
  return Promise.resolve({response: "content_script onMessage listener"});
});
