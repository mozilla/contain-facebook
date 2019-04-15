"use strict";

function itemWidthCheck (target) {
  const itemHeight = target.offsetHeight;
  const itemWidth = target.offsetWidth;
  const iconClassArr = ["fbc-overlay"];

  const ratioCheck = (itemWidth / itemHeight);

  if (ratioCheck < 1.1) {
    iconClassArr.push("fbc-overlay-small");
  } else if (itemHeight < 39) {
    iconClassArr.push("fbc-overlay-small");
  }
  return iconClassArr;
}

// Use the following patterns to check for on-screen Facebook elements 

const PATTERN_DETECTION_SELECTORS = [
  "[title*='Facebook']",
  "[title='Log in with Facebook']",
  "[class*='fb-login']",
  "[class*='FacebookConnectButton']",
  "[href*='facebook']",
  "[data-bfa-network*='facebook']",
  "[data-oauthserver*='facebook']",
  "[aria-label*='Facebook']",
  "[data-destination*='facebook']"
];

function detectFacebookOnPage () {

  for (let querySelector of PATTERN_DETECTION_SELECTORS) {
    for (let item of document.querySelectorAll(querySelector)) {
      if (!item.classList.contains("fbc-overlay")) {
        item.classList.add(...itemWidthCheck(item));
      }
    }
  }
}

browser.runtime.onMessage.addListener(message => {
  console.log("message from background script:", message);
  setTimeout(function () {
    detectFacebookOnPage();
  }, 10);
  return Promise.resolve({response: "content_script onMessage listener"});
});

setTimeout(detectFacebookOnPage, 150);
