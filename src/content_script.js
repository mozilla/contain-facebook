"use strict";

function detectFacebookLoginButton() {
  // Test for standard implementation (Example: Facebook Docs)
  console.log("detectFacebookLoginButton");
  const loginButton = document.querySelectorAll(".fb-login-button");
  for (let item of loginButton) {
    let replacementClassArr = ["fbc-loginButton", "fbc-overlay"];
    replacementClassArr.push("fbc-size-" + item.getAttribute("data-size"));
    replacementClassArr.push("fbc-button-type-" + item.getAttribute("data-button-type"));
    item.classList.add(...replacementClassArr);
  }
}

browser.runtime.onMessage.addListener(message => {
  console.log("message from background script:", message);
  setTimeout(function(){
    detectFacebookLoginButton();
  }, 10);

  return Promise.resolve({response: "content_script onMessage listener"});
});

setTimeout(detectFacebookLoginButton, 150);
