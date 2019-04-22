"use strict";

function detectFacebookLoginButton () {
  // TODO: Refactor detectFacebookLoginButton to add HTML badge instead of class/psudeo element
  // Test for standard implementation (Example: Facebook Docs)
  const loginButton = document.querySelectorAll(".fb-login-button");
  for (let item of loginButton) {
    const fbcClassResetArr = ["fbc-overlay-small", "fbc-overlay"];
    const replacementClassArr = ["fbc-loginButton"];
    replacementClassArr.push("fbc-size-" + item.getAttribute("data-size"));
    replacementClassArr.push("fbc-button-type-" + item.getAttribute("data-button-type"));
    // Remove previous detection classes
    item.classList.remove(...fbcClassResetArr);
    // Add declared size values
    item.classList.add(...replacementClassArr);
    // Remeasure elements and add correct badge size
    item.classList.add(...itemWidthCheck(item));
  }
}

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

let htmlBadgeDiv;

function isFixed (elem) {
  do {
    if (getComputedStyle(elem).position == "fixed") return true;
  } while ((elem = elem.offsetParent));
  return false;
}

const fragmentClasses = ["fbc-badge-fence", "fbc-badge-hover", "fbc-badge-prompt"];
const loginTextString = document.createTextNode("Facebook Container has blocked Facebook trackers. If you use Log in with Facebook on this site, Facebook will be able to track you.");

function createBadgeFragment () {
  const htmlBadgeFragment = document.createDocumentFragment();

  for (let className of fragmentClasses) {
    let div = document.createElement("div");
    div.className = className;
    htmlBadgeFragment.appendChild(div);
  }

  const htmlBadgeFragmentHoverDiv = htmlBadgeFragment.querySelector(".fbc-badge-hover");
  // const htmlBadgeFragmentPromptDiv = htmlBadgeFragment.querySelector(".fbc-badge-prompt");
  // const htmlBadgeFragmentFenceDiv = htmlBadgeFragment.querySelector(".fbc-badge-fence");

  htmlBadgeFragmentHoverDiv.appendChild(loginTextString);

  htmlBadgeDiv = document.createElement("div");
  htmlBadgeDiv.appendChild(htmlBadgeFragment);

  return htmlBadgeDiv;
}

function addFacebookBadge (target, badgeClassUId) {
  // Detect if target is visible

  htmlBadgeDiv = createBadgeFragment();

  const htmlBadgeFragmentPromptDiv = htmlBadgeDiv.querySelector(".fbc-badge-prompt");
  // const htmlBadgeFragmentHoverDiv = htmlBadgeDiv.querySelector(".fbc-badge-hover");
  const htmlBadgeFragmentFenceDiv = htmlBadgeDiv.querySelector(".fbc-badge-fence");

  htmlBadgeDiv.className = "fbc-badge " + badgeClassUId;

  document.body.appendChild(htmlBadgeDiv);

  const itemWidth = parseInt(target.offsetWidth, 10);
  const itemHeight = parseInt(target.offsetHeight, 10);

  const ratioCheck = (itemWidth / itemHeight);
  let badgeSmallSwitch = false;

  if (ratioCheck < 1.1) {
    htmlBadgeDiv.classList.add("fbc-badge-small");
    badgeSmallSwitch = true;
  } else if (itemHeight < 39) {
    htmlBadgeDiv.classList.add("fbc-badge-small");
    badgeSmallSwitch = true;
  }

  positionFacebookBadge(target, badgeClassUId, itemWidth, badgeSmallSwitch);

  htmlBadgeFragmentFenceDiv.addEventListener("click", (e) => {
    e.preventDefault();
    htmlBadgeDiv.classList.toggle("active");
    // addToolTipBlock(item);
    // browser.runtime.sendMessage("add-to-facebook-container");
  });

  htmlBadgeFragmentPromptDiv.addEventListener("click", (e) => {
    e.preventDefault();
    // console.log("htmlBadgePrompt");
    browser.runtime.sendMessage("add-to-facebook-container");
    target.click();
  });
}

function positionFacebookBadge (target, badgeClassUId, targetWidth, smallSwitch) {
  // Check for Badge element and select it
  if (!badgeClassUId) {
    badgeClassUId = "js-" + target;
  }

  htmlBadgeDiv = document.querySelector("." + badgeClassUId);

  // Confirm target element is defined
  if (target && typeof target === "object") {
    // TODO: Reverse IF Statement
  } else {
    target = document.querySelector("." + target);
  }

  // Set offset size based on large/small badge
  let elementSizeOffsetX = 20;
  let elementSizeOffsetY = 4;

  if (typeof smallSwitch === "undefined") {
    if (htmlBadgeDiv.classList.contains("fbc-badge-small")) {
      smallSwitch = true;
    }
  }

  if (smallSwitch) {
    elementSizeOffsetX = 12;
    elementSizeOffsetY = 5;
  }

  // Define target element width
  if (!targetWidth) {
    targetWidth = parseInt(target.offsetWidth, 10);
  }

  // Get position coordinates
  const bodyRect = document.body.getBoundingClientRect();
  const elemRect = target.getBoundingClientRect();

  let offsetPosX = elemRect.left - bodyRect.left;
  let offsetPosY = elemRect.top - bodyRect.top;

  if (isFixed(target)) {
    htmlBadgeDiv.classList.add("fbc-badge-fixed");
    offsetPosX = elemRect.left;
    offsetPosY = elemRect.top;
  } else {
    htmlBadgeDiv.classList.remove("fbc-badge-fixed");
  }

  const htmlBadgeDivPosX = (offsetPosX + targetWidth) - elementSizeOffsetX;
  const htmlBadgeDivPosY = offsetPosY - elementSizeOffsetY;

  // Set badge position based on target coordinates/size
  htmlBadgeDiv.style.left = htmlBadgeDivPosX + "px";
  htmlBadgeDiv.style.top = htmlBadgeDivPosY + "px";
}

// Use the following patterns to check for on-screen Facebook elements

const PATTERN_DETECTION_SELECTORS = [
  "[title*='Facebook']",
  "[title='Log in with Facebook']",
  "[class*='fb-login']",
  "[class*='FacebookConnectButton']",
  "[class*='facebook-connect-button']", // Twitch
  "[href*='facebook.com/share']", // Imgur Login
  "[href*='facebook.com/v2.3/dialog/oauth']", // Spotify
  "[href*='signin/facebook']",
  "[href*='facebook.com/dialog/share']",
  "[href*='facebook.com/sharer']", // Buzzfeed
  "[data-bfa-network*='facebook']",
  "[data-oauthserver*='facebook']", // Stackoverflow
  "[id*='facebook_connect_button']", // Quora
  "[aria-label*='Facebook']",
  "[aria-label*='share on facebook']", // MSN
  "[data-destination*='facebook']"
];

// List of badge-able in-page elements
const facebookDetectedElementsArr = [];

function detectFacebookOnPage () {
  for (let querySelector of PATTERN_DETECTION_SELECTORS) {
    for (let item of document.querySelectorAll(querySelector)) {
      // overlay the FBC icon badge on the item
      if (!item.classList.contains("fbc-badged")) {
        let itemUIDClassName = "fbc-badgeUID_" + (facebookDetectedElementsArr.length + 1);
        let itemUIDClassTarget = "js-" + itemUIDClassName;
        facebookDetectedElementsArr.push(itemUIDClassName);
        addFacebookBadge(item, itemUIDClassTarget);
        item.classList.add("fbc-badged");
        item.classList.add(itemUIDClassName);
        // console.log(...facebookDetectedElementsArr);

        // let badge = document.querySelector(itemUIDClassTarget);
        //

        // item.addEventListener("click", (e) => {
        //   e.preventDefault();
        //   console.log("item-click");
        //   // addToolTipBlock(item);
        //   // browser.runtime.sendMessage("add-to-facebook-container");
        // });
        //
        // item.addEventListener("mouseover", (e) => {
        //   e.preventDefault();
        //   console.log("item-mouseover");
        //   // addToolTipBlock(itemUIDClassName);
        //   // browser.runtime.sendMessage("add-to-facebook-container");
        // });
      }

      // add click handler to addDomainToFBC and refresh
    }
  }
}

// Resize listener. Only fires after window stops resizing.
let resizeId;

window.addEventListener("resize", function () {
  clearTimeout(resizeId);
  resizeId = setTimeout(doneResizing, 25);
});

function doneResizing () {
  for (let item of facebookDetectedElementsArr) {
    positionFacebookBadge(item);
  }
}

// On Scroll, checking for position fixed on elements
let last_known_scroll_position = 0;
let ticking = false;

function doneScrolling () {
  for (let item of facebookDetectedElementsArr) {
    positionFacebookBadge(item);
    // console.log("scrollCheckInit");
    // let badgeClassUId = "js-" + item;
    // htmlBadgeDiv = document.querySelector("." + badgeClassUId);
    // if ( htmlBadgeDiv.classList.contains("fbc-badge-fixed") ) {
    //   positionFacebookBadge(item);
    // }
  }
}

window.addEventListener("scroll", function () {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function () {
      doneScrolling(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;
  }
});

browser.runtime.onMessage.addListener(message => {
  console.log("message from background script:", message);
  setTimeout(() => {
    detectFacebookOnPage();
    detectFacebookLoginButton();
  }, 10);
  return Promise.resolve({response: "content_script onMessage listener"});
});

setTimeout(detectFacebookOnPage, 150);
setTimeout(detectFacebookLoginButton, 150);
