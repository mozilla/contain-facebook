"use strict";

// Pattern
// https://www.facebook.com/v2.3/dialog/oauth



function detectFacebookLogin () {

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

  // Test for standard implementation (Example: Facebook Docs)
  const loginButton = document.querySelectorAll(".fb-login-button");
  for (let item of loginButton) {
    item.classList.add("fbc-overlay");
  }
}

browser.runtime.onMessage.addListener(message => {
  console.log("message from background script:", message);
  setTimeout(function(){
    detectFacebookLogin();
  }, 10);
  return Promise.resolve({response: "content_script onMessage listener"});
});
