"use strict";

// Pattern
// https://www.facebook.com/v2.3/dialog/oauth



function detectFacebookLogin () {

  // TODO: Count instances of a match (Using [0] currently)
  // Test for anchor/facebook URL (Example: Imgur)
  const loginButtonHref = document.querySelectorAll("[href*='facebook']");
  loginButtonHref[0].classList.add("fbc-overlay");

  // TODO: Grab each element attribute and search for "dialog/oauth" string
  const loginButtonDataOAuth = document.querySelectorAll("[data-oauthserver*='facebook']");
  loginButtonDataOAuth[0].classList.add("fbc-overlay");

  // TODO: Grab each element attribute and search for "dialog/oauth" string
  // const loginButtonTitle = document.querySelectorAll("[title='Share On Facebook']");
  // loginButtonTitle[0].classList.add("fbc-overlay");

  // Test for standard implementation (Example: Facebook Docs)
  const loginButton = document.querySelectorAll(".fb-login-button");
  loginButton[0].classList.add("fbc-loginButton");
}

browser.runtime.onMessage.addListener(message => {
  console.log("message from background script:", message);
  setTimeout(function(){
    detectFacebookLogin();
  }, 10);
  return Promise.resolve({response: "content_script onMessage listener"});
});
