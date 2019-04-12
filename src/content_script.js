"use strict";

function itemWidthCheck(target){

  const itemHeight = target.offsetHeight;
  const itemWidth = target.offsetWidth;
  let iconClassArr = ["fbc-overlay"];

  const ratioCheck = ( itemWidth / itemHeight );

  if ( ratioCheck < 1.1 ) {
    iconClassArr.push("fbc-overlay-small");
  } else if ( itemHeight < 39 ) {
    iconClassArr.push("fbc-overlay-small");
  }
  return iconClassArr;
}

function detectFacebookOnPage () {

  // TODO: Loop through array of class names to test for
  // Test for any element with facebook connect in class name (Example: Pinterest)

  const loginButtonTitle = document.querySelectorAll("[title='Share On Facebook']");
  console.log(loginButtonTitle);
  for (let item of loginButtonTitle) {
    // console.log("loginButtonTitle", item);
    if ( !item.classList.contains("fbc-overlay") ) {
      item.classList.add(...itemWidthCheck(item));
    }
  }

  const loginButtonTitleLogin = document.querySelectorAll("[title='Log in with Facebook']");
  console.log(loginButtonTitleLogin);
  for (let item of loginButtonTitleLogin) {
    // console.log("loginButtonTitle", item);
    if ( !item.classList.contains("fbc-overlay") ) {
      item.classList.add(...itemWidthCheck(item));
    }
  }

  const loginButtonClass2 = document.querySelectorAll("[class*='fb-login']");
  for (let item of loginButtonClass2) {

    // console.log("loginButtonClass", item);
    if ( !item.classList.contains("fbc-overlay") ) {
      item.classList.add(...itemWidthCheck(item));
    }
  }

  const loginButtonClass = document.querySelectorAll("[class*='FacebookConnectButton']");
  for (let item of loginButtonClass) {

    // console.log("loginButtonClass", item);
    if ( !item.classList.contains("fbc-overlay") ) {
      item.classList.add(...itemWidthCheck(item));
    }
  }

  // Test for anchor/facebook URL (Example: Imgur)
  const loginButtonHref = document.querySelectorAll("[href*='facebook']");
  console.log(loginButtonHref);
  for (let item of loginButtonHref) {
    // console.log("loginButtonHref", item);
    if ( !item.classList.contains("fbc-overlay") ) {
      item.classList.add(...itemWidthCheck(item));
    }
  }
  const likeButtonBfaNetwork = document.querySelectorAll("['data-bfa-network'*='facebook']");
  for (let item of likeButtonBfaNetwork) {
    // console.log("likeButtonBfaNetwork", item);
    if ( !item.classList.contains("fbc-overlay") ) {
      item.classList.add(...itemWidthCheck(item));
    }
  }

  const loginButtonDataOAuth = document.querySelectorAll("[data-oauthserver*='facebook']");
  for (let item of loginButtonDataOAuth) {
    // console.log("loginButtonDataOAuth", item);
    if ( !item.classList.contains("fbc-overlay") ) {
      item.classList.add(...itemWidthCheck(item));
    }
  }


  const loginButtonAriaLabel = document.querySelectorAll("[aria-label*='Facebook']");
  for (let item of loginButtonAriaLabel) {
    // console.log("loginButtonAriaLabel", item);
    if ( !item.classList.contains("fbc-overlay") ) {
      item.classList.add(...itemWidthCheck(item));
    }
  }

  const loginButtonDataDestination = document.querySelectorAll("[data-destination*='facebook']");
  for (let item of loginButtonDataDestination) {
    // console.log("loginButtonDataDestination", item);
    if ( !item.classList.contains("fbc-overlay") ) {
      item.classList.add(...itemWidthCheck(item));
    }
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
