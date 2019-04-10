"use strict";

// Pattern
// https://www.facebook.com/v2.3/dialog/oauth



function detectFacebookOnPage () {

  // TODO: Loop through array of class names to test for
  // Test for any element with facebook connect in class name (Example: Pinterest)
  const loginButtonClass = document.querySelectorAll("[class*='FacebookConnectButton']");
  for (let item of loginButtonClass) {
    item.classList.add("fbc-overlay");
  }

  // Test for anchor/facebook URL (Example: Imgur)
  const loginButtonHref = document.querySelectorAll("[href*='facebook']");
  for (let item of loginButtonHref) {
    item.classList.add("fbc-overlay");
  }

  const loginButtonDataOAuth = document.querySelectorAll("[data-oauthserver*='facebook']");
  for (let item of loginButtonDataOAuth) {
    item.classList.add("fbc-overlay");
  }

  const loginButtonTitle = document.querySelectorAll("[title*='Share On Facebook']");
  for (let item of loginButtonTitle) {
    item.classList.add("fbc-overlay");
  }
  const loginButtonAriaLabel = document.querySelectorAll("[aria-label*='Facebook']");
  for (let item of loginButtonAriaLabel) {
    item.classList.add("fbc-overlay");
  }

  // Test for standard implementation (Example: Facebook Docs)
  const loginButton = document.querySelectorAll(".fb-login-button");
  for (let item of loginButton) {
    item.classList.add("fbc-overlay");
  }
}

browser.runtime.onMessage.addListener(message => {
  console.log("message from background script:", message);
  setTimeout(function(){
    detectFacebookOnPage();
  }, 10);
  return Promise.resolve({response: "content_script onMessage listener"});
});

setTimeout(detectFacebookOnPage, 150);
