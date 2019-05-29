"use strict";

// Use the following patterns to check for on-screen Facebook elements
// Unused Patterns from previous mixed set of selectors
// "[title*='Facebook']",
// "[aria-label*='Facebook']",

const LOGIN_PATTERN_DETECTION_SELECTORS = [
  "[title='Log in with Facebook']",
  "[class*='FacebookConnectButton']",
  "[class*='js-facebook-login']", // kickstarter
  "[class*='btn-facebook-signin']", // estadao.com.br
  "[class*='signup-provider-facebook']", // Fandom
  "[class*='facebook_login_click']", // Hi5
  "[class*='facebook-connect-button']", // Twitch
  "[href*='facebook.com/v2.3/dialog/oauth']", // Spotify
  "[href*='/sign_in/Facebook']", // bazqux.com
  "[href*='signin/facebook']",
  "[href*='/auth/facebook']", // Producthunt
  "[data-oauthserver*='facebook']", // Stackoverflow
  "[id*='facebook_connect_button']", // Quora
  "[data-action*='facebook-auth']", //Medium
  "[data-destination*='facebook']",
  "[data-partner*='facebook']", // AliExpress
  ".social-login .button--facebook", // noovie.com
  "#home_account_fb.unlogged-btn-facebook", // Deezer
  "[class*='_1HC-DxGDAHiEbG3x6-vzL9']", // Match UK Login
  "[class*='meetup-signupModal-facebook']", // Meetup Signup Homepage
  "#register-form--creds .button--facebook", // Meetup Signup Static Page
  "#modal--register .button--facebook", // Meetup Signup Non-homepage
  ".join-linkedin-form + .third-party-btn-container button.fb-btn", // LinkedIn
  ".fb-start .ybtn--social.ybtn--facebook", // Yelp
  "[aria-label*='Log in with Facebook']", // Tinder
  "[action*='facebook_login']", // Airbnb
  "[action*='facebook_signup']", // Airbnb
  "[class*='fb-login']" // Default FB class name "fbc-login-button"

];

// TODO: Disarm click events on detected elements
const SHARE_PATTERN_DETECTION_SELECTORS = [
  "[href*='facebook.com/share']",
  "[href*='facebook.com/dialog/share']", // Share dialog
  "[href*='facebook.com/dialog/feed']", // Feed dialog
  "[href*='facebook.com/sharer']", // Buzzfeed
  "[data-bfa-network*='facebook']", // Buzzfeed Mini Share
  "[aria-label*='share on facebook']", // MSN
  "[data-tracking*='facebook|share']", // football.london
  "[class*='facebookShare']", // Producthunt share
  ".post-action-options + .right > .social-icon.icon-f", // Imgur share
  "[title='Share on Facebook']" // Medium
];

function isFixed (elem) {
  do {
    if (getComputedStyle(elem).position == "fixed") return true;
  } while ((elem = elem.offsetParent));
  return false;
}

const fragmentClasses = ["fbc-badge-fence", "fbc-badge-tooltip", "fbc-badge-prompt"];
const htmlBadgeFragmentPromptParagraphStrings = [ browser.i18n.getMessage("inPageUI-tooltip-prompt-p1"), browser.i18n.getMessage("inPageUI-tooltip-prompt-p2") ];
const htmlBadgeFragmentPromptButtonStrings = ["btn-cancel", "btn-allow"];

function getTooltipFragmentStrings (socialAction) {
  switch (socialAction) {
  case "login":
    return browser.i18n.getMessage("inPageUI-tooltip-button-login");
  case "share":
    return browser.i18n.getMessage("inPageUI-tooltip-button-share");
  }
}

function createBadgeFragment (socialAction) {
  const htmlBadgeFragment = document.createDocumentFragment();

  for (let className of fragmentClasses) {
    const div = document.createElement("div");
    div.className = className;
    htmlBadgeFragment.appendChild(div);
  }

  // Create Tooltip
  const htmlBadgeFragmentTooltipDiv = htmlBadgeFragment.querySelector(".fbc-badge-tooltip");
  htmlBadgeFragmentTooltipDiv.appendChild( document.createTextNode( getTooltipFragmentStrings(socialAction) ) );

  // Create Prompt/Allow Dialog
  if (socialAction === "login"){
    const htmlBadgeFragmentPromptDiv = htmlBadgeFragment.querySelector(".fbc-badge-prompt");

    const htmlBadgeFragmentPromptH1 = document.createElement("h1");

    htmlBadgeFragmentPromptH1.appendChild(document.createTextNode( browser.i18n.getMessage("facebookContainer") ));
    htmlBadgeFragmentPromptDiv.appendChild(htmlBadgeFragmentPromptH1);

    const htmlBadgeFragmentPromptContents = document.createElement("div");
    htmlBadgeFragmentPromptContents.className = "fbc-badge-prompt-contents";

    for (let promptParagraphString of htmlBadgeFragmentPromptParagraphStrings) {
      const paragraph = document.createElement("p");
      paragraph.appendChild(document.createTextNode(promptParagraphString));
      htmlBadgeFragmentPromptContents.appendChild(paragraph);
    }

    htmlBadgeFragmentPromptDiv.appendChild(htmlBadgeFragmentPromptContents);

    const htmlBadgeFragmentPromptButtonDiv = document.createElement("div");
    htmlBadgeFragmentPromptButtonDiv.className = "fbc-badge-prompt-buttons";

    for (let buttonString of htmlBadgeFragmentPromptButtonStrings) {
      const button = document.createElement("button");
      button.className = "fbc-badge-prompt-" + buttonString;
      button.appendChild(document.createTextNode( browser.i18n.getMessage(buttonString) ));
      htmlBadgeFragmentPromptButtonDiv.appendChild(button);
    }

    htmlBadgeFragmentPromptDiv.appendChild(htmlBadgeFragmentPromptButtonDiv);
  }

  // Create Empty Wrapper Div
  const htmlBadgeWrapperDiv = document.createElement("div");
  htmlBadgeWrapperDiv.appendChild(htmlBadgeFragment);

  return htmlBadgeWrapperDiv;
}

function shouldBadgeBeSmall(ratioCheck, itemHeight) {
  if (ratioCheck < 1.1) {
    return true;
  } else if (itemHeight < 39) {
    return true;
  }
  return false;
}

function addFacebookBadge (target, badgeClassUId, socialAction) {
  // Detect if target is visible
  // console.log("addFacebookBadge", target);

  const htmlBadgeDiv = createBadgeFragment(socialAction);

  const htmlBadgeFragmentPromptButtonCancel = htmlBadgeDiv.querySelector(".fbc-badge-prompt-btn-cancel");
  const htmlBadgeFragmentPromptButtonAllow = htmlBadgeDiv.querySelector(".fbc-badge-prompt-btn-allow");
  const htmlBadgeFragmentFenceDiv = htmlBadgeDiv.querySelector(".fbc-badge-fence");

  htmlBadgeDiv.className = "fbc-badge " + badgeClassUId;

  document.body.appendChild(htmlBadgeDiv);

  const itemWidth = parseInt(target.offsetWidth, 10);
  const itemHeight = parseInt(target.offsetHeight, 10);

  const ratioCheck = (itemWidth / itemHeight);

  let allowClickSwitch = false;

  const badgeSmallSwitch = shouldBadgeBeSmall(ratioCheck, itemHeight);
  if (badgeSmallSwitch) {
    htmlBadgeDiv.classList.add("fbc-badge-small");
  }

  positionFacebookBadge(target, badgeClassUId, itemWidth, badgeSmallSwitch);

  // Show/hide prompt if login element
  if (socialAction === "login"){
    target.addEventListener("click", (e) => {
      if (allowClickSwitch) {
        // Button disabled. Either will trigger new HTTP request or page will refresh.
        setTimeout(()=>{
          location.reload(true);
        }, 250);
        return;
      } else {
        // Click badge, button disabled
        e.preventDefault();
        e.stopPropagation();
        htmlBadgeFragmentFenceDiv.click();
      }
    });



    htmlBadgeFragmentFenceDiv.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.parentElement.classList.toggle("active");
      positionPrompt( htmlBadgeDiv );
      target.classList.toggle("js-fbc-prompt-active");
      document.body.classList.toggle("js-fbc-prompt-active");
    });

    // Add to Container "Allow"
    htmlBadgeFragmentPromptButtonAllow.addEventListener("click", (e) => {
      e.preventDefault();
      allowClickSwitch = true;
      browser.runtime.sendMessage("add-to-facebook-container");
      target.click();
    });

    // Close prompt
    htmlBadgeFragmentPromptButtonCancel.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.remove("js-fbc-prompt-active");
      document.querySelector(".fbc-has-badge.js-fbc-prompt-active").classList.remove("js-fbc-prompt-active");
      e.target.parentElement.parentNode.parentNode.classList.remove("active");
    });
  } else if (socialAction === "share") {
    htmlBadgeDiv.classList.add("fbc-badge-share");

    target.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    target.addEventListener("mouseover", () => {
      // console.log(["mouseover", target, htmlBadgeDiv]);
      target.classList.add("fbc-badge-tooltip-active");
      htmlBadgeDiv.classList.add("fbc-badge-tooltip-active");
      setTimeout( ()=> {
        positionPrompt( htmlBadgeDiv );
      }, 50 );
    });

    target.addEventListener("mouseout", () => {
      // console.log(["mouseout", target, htmlBadgeDiv]);
      target.classList.remove("fbc-badge-tooltip-active");
      htmlBadgeDiv.classList.remove("fbc-badge-tooltip-active");
    });

  }

  // Applies to both!
  htmlBadgeFragmentFenceDiv.addEventListener("mouseenter", () => {
    positionPrompt( htmlBadgeDiv );
  });

}



function findActivePrompt() {
  const allBadges = document.querySelectorAll(".fbc-badge.active");
  for (let badge of allBadges) {
    return badge;
  }
}

function closePrompt() {
  const activePrompt = findActivePrompt();
  activePrompt.classList.remove("active");
  document.body.classList.remove("js-fbc-prompt-active");
  document.querySelector(".fbc-has-badge.js-fbc-prompt-active").classList.remove("js-fbc-prompt-active");
}

function positionPrompt ( activeBadge ) {
  // console.log(activeBadge);
  // const activeBadge = document.querySelector(".fbc-badge-prompt");
  // const activeBadgePrompt = activeBadge.querySelector(".fbc-badge-prompt");
  const elemRect = activeBadge.getBoundingClientRect();
  // console.log(elemRect);

  if ( (window.innerWidth - elemRect.left) < 350  ) {
    activeBadge.classList.add("fbc-badge-prompt-align-right");
  }

  const modifierClassList = ["fbc-badge-prompt-align-top", "fbc-badge-prompt-align-bottom", "fbc-badge-prompt-align-right"];

  if ( elemRect.top < 140 ) {
    activeBadge.classList.add("fbc-badge-prompt-align-top");
  } else if ( (window.innerHeight - elemRect.bottom) < 130 ) {
    activeBadge.classList.add("fbc-badge-prompt-align-bottom");
  } else if ( (window.innerWidth - elemRect.left) < 350  ) {
    activeBadge.classList.add("fbc-badge-prompt-align-right");
  } else {
    activeBadge.classList.remove(...modifierClassList);
  }
}

function elementSizeOffsetXY(smallSwitch) {
  // [X, Y]
  if (smallSwitch) {
    return [12, 5];
  }
  return [20, 4];
}

function getOffsetsAndApplyClass(elemRect, bodyRect, target, htmlBadgeDiv) {
  if ( !isFixed(target) && htmlBadgeDiv.classList.contains("fbc-badge-fixed") ) {
    htmlBadgeDiv.classList.remove("fbc-badge-fixed");
  } else if ( isFixed(target) ) {
    htmlBadgeDiv.classList.add("fbc-badge-fixed");
    return {offsetPosX: elemRect.left, offsetPosY: elemRect.top};
  } else {
    // Removed left body offset calc as it doesn't apply
    // return {offsetPosX: elemRect.left - bodyRect.left, offsetPosY: elemRect.top - bodyRect.top};
    return {offsetPosX: elemRect.left, offsetPosY: elemRect.top + window.scrollY};
  }
}

function checkVisibilityAndApplyClass(target, htmlBadgeDiv) {
  const htmlBadgeDivHasDisabledClass = htmlBadgeDiv.classList.contains("fbc-badge-disabled");
  const targetIsNull = (target === null);

  if ( targetIsNull && !htmlBadgeDivHasDisabledClass ) {
    // Element no longer exists and its badge needs to be hidden
    htmlBadgeDiv.classList.add("fbc-badge-disabled");
    return;
  }

  const { offsetParent } = target;
  if (offsetParent) {
    const styleTransform = ( window.getComputedStyle(offsetParent, false).getPropertyValue("transform") === "matrix(1, 0, 0, 0, 0, 0)" );
    // console.log(styleTransform);
    if (styleTransform && !htmlBadgeDivHasDisabledClass) {
      htmlBadgeDiv.classList.add("fbc-badge-disabled");
    }
  } else {
    if ( htmlBadgeDivHasDisabledClass ) {
      htmlBadgeDiv.classList.remove("fbc-badge-disabled");
    }
  }

}

function determineContainerClientRect() {
  const htmlHeight = document.querySelector("html").offsetHeight;
  const bodyHeight = document.querySelector("body").offsetHeight;
  // console.log([htmlHeight, bodyHeight, (htmlHeight > bodyHeight)]);
  if (htmlHeight === bodyHeight) {
    return document.body.getBoundingClientRect();
  } else if ( htmlHeight < bodyHeight ) {
    return document.querySelector("html").getBoundingClientRect();
  } else {
    return document.body.getBoundingClientRect();
  }
}

function calcZindex(target) {
  // Loop through each parent, getting Zindex (if its a number).
  // As it finds them, it grabs the highest/largest.
  let zIndexLevel = 0;
  for ( ; target && target !== document; target = target.parentNode ) {
    const zindex = document.defaultView.getComputedStyle(target).getPropertyValue("z-index");
    if ( !isNaN(zindex) ) {
      if (zIndexLevel < zindex) {
        zIndexLevel = zindex;
      }
    }
  }

  // Take highest zindex in parent tree and adds one more.
  zIndexLevel = zIndexLevel + 2;
  return zIndexLevel;
}

function positionFacebookBadge (target, badgeClassUId, targetWidth, smallSwitch) {
  // Check for Badge element and select it
  if (!badgeClassUId) {
    badgeClassUId = "js-" + target;
  }

  const htmlBadgeDiv = document.querySelector("." + badgeClassUId);

  // Confirm target element is defined
  if (!target || !(typeof target === "object")) {
    target = document.querySelector("." + target);
  }

  checkVisibilityAndApplyClass(target, htmlBadgeDiv);

  if (typeof smallSwitch === "undefined") {
    if (htmlBadgeDiv.classList.contains("fbc-badge-small")) {
      smallSwitch = true;
    }
  }

  // Set offset size based on large/small badge
  const [elementSizeOffsetX, elementSizeOffsetY] = elementSizeOffsetXY(smallSwitch);

  // Define target element width
  if (!targetWidth) {
    targetWidth = parseInt(target.offsetWidth, 10);
  }

  // Get position coordinates
  const bodyRect = determineContainerClientRect();
  // const bodyRect = determineContainerClientRect();
  const elemRect = target.getBoundingClientRect();

  // Determine if target element is fixed, will resets or applies class and set appor offset.
  const {offsetPosX, offsetPosY} = getOffsetsAndApplyClass(elemRect, bodyRect, target, htmlBadgeDiv);

  const htmlBadgeDivPosX = (offsetPosX + targetWidth) - elementSizeOffsetX;
  const htmlBadgeDivPosY = offsetPosY - elementSizeOffsetY;

  // TODO: Add Zindex Targeting
  const targetZindex = calcZindex(target);

  // console.log( calcZindex(target) );

  // Set badge position based on target coordinates/size
  htmlBadgeDiv.style.zIndex = targetZindex;
  htmlBadgeDiv.style.left = htmlBadgeDivPosX + "px";
  htmlBadgeDiv.style.top = htmlBadgeDivPosY + "px";
}

function isPinterest(target) {
  const { parentElement } = target;
  if (parentElement) {
    const { previousElementSibling } = parentElement;
    if (previousElementSibling) {
      return previousElementSibling.classList.contains("fbc-has-badge");
    }
  }
  return false;
}

function parentIsBadged(target) {
  const { parentElement } = target;
  if (parentElement) {
    return parentElement.classList.contains("fbc-has-badge");
  }
  return false;
}

// List of badge-able in-page elements
const facebookDetectedElementsArr = [];

function patternDetection(selectionArray, socialActionIntent){
  // console.log("patternDetection");
  for (let querySelector of selectionArray) {
    for (let item of document.querySelectorAll(querySelector)) {
      // overlay the FBC icon badge on the item
      if (!item.classList.contains("fbc-has-badge") && !isPinterest(item) && !parentIsBadged(item)) {
        // console.log([querySelector, item]);
        const itemUIDClassName = "fbc-UID_" + (facebookDetectedElementsArr.length + 1);
        const itemUIDClassTarget = "js-" + itemUIDClassName;
        const socialAction = socialActionIntent;
        facebookDetectedElementsArr.push(itemUIDClassName);
        addFacebookBadge(item, itemUIDClassTarget, socialAction);
        item.classList.add("fbc-has-badge");
        item.classList.add(itemUIDClassName);
      }
    }
  }
}

function detectFacebookOnPage () {
  if (!checkForTrackers) {
    return;
  }

  patternDetection(SHARE_PATTERN_DETECTION_SELECTORS, "share");
  patternDetection(LOGIN_PATTERN_DETECTION_SELECTORS, "login");

  escapeKeyListener();
}

// Resize listener. Only fires after window stops resizing.
let resizeId;

window.addEventListener("resize", ()=> {
  clearTimeout(resizeId);
  resizeId = setTimeout(screenUpdate, 25);
});

// On Scroll, checking for position fixed on elements
let ticking = false;

window.addEventListener("scroll", ()=> {
  if (!ticking) {
    window.requestAnimationFrame(()=> {
      screenUpdate();
      ticking = false;
    });

    ticking = true;
  }
});

// Fires on screen Resize or Scroll
function screenUpdate () {
  if (checkForTrackers) {
    for (let item of facebookDetectedElementsArr) {
      positionFacebookBadge(item);
    }
  }
}

function escapeKeyListener () {
  document.body.addEventListener("keydown", function(e) {
    if(e.key === "Escape" && document.body.classList.contains("js-fbc-prompt-active")) {
      closePrompt();
    }
  });
}

window.addEventListener("click", function(e){
  if ( document.body.classList.contains("js-fbc-prompt-active") ) {
    const activePrompt = findActivePrompt();
    const activePromptTarget = document.querySelector(".fbc-has-badge.js-fbc-prompt-active");
    if ( !activePrompt.contains(e.target) && !activePromptTarget.contains(e.target) ) {
      closePrompt();
    }
  } else {
    contentScriptInit(true);
  }
});

/*
function removeBadges() {
  for (let itemClass of facebookDetectedElementsArr) {
    // positionFacebookBadge(item);
    const target = document.querySelector("." + itemClass);
    target.classList.remove("fbc-has-badge");
    target.classList.remove(itemClass);
    const badge = document.querySelector(".js-" + itemClass);
    badge.parentNode.removeChild(badge);
  }
}
*/

let checkForTrackers = true;

browser.runtime.onMessage.addListener(message => {
  if ( message["msg"] == "allowed-facebook-subresources" || message["msg"] == "facebook-domain" ) {
    // Flags function to not add badges to page
    checkForTrackers = false;
  } else {
    setTimeout(() => {
      contentScriptInit(true, message["msg"]);
    }, 10);
  }

  return Promise.resolve({response: "content_script onMessage listener"});
});

// let callCount = 0;
let contentScriptDelay = 999;

function contentScriptInit(resetSwitch, msg) {
  // Second arg is for debugging to see which contentScriptInit fires
  // Call count tracks number of times contentScriptInit has been called
  // callCount = callCount + 1;
  // console.log(call, callCount);
  // console.log(source, ": ", checkForTrackers);

  if (resetSwitch) {
    contentScriptDelay = 999;
    contentScriptSetTimeout();
  }

  // Resource call is not in FBC/FB Domain and is a FB resource
  if (checkForTrackers && msg !== "other-domain") {
    detectFacebookOnPage();
    screenUpdate();
  }
}

async function CheckIfURLShouldBeBlocked() {
  const siteList = await browser.runtime.sendMessage("what-sites-are-added");

  if (siteList.includes(window.location.host)) {
    checkForTrackers = false;
  } else {
    contentScriptInit(false);
  }

}

// Cross-browser implementation of element.addEventListener()
function addPassiveWindowOnloadListener() {
  const activeOnloadFunction = window.onload;
  window.addEventListener("load", function() {
  // window.onload = function () {
    if (typeof activeOnloadFunction === "function") {
      activeOnloadFunction();
    }
    CheckIfURLShouldBeBlocked();
  }, false);
}

addPassiveWindowOnloadListener();
// window.onload = contentScriptInit(false, "window.onload");
// contentScriptSetTimeout();

function contentScriptSetTimeout() {
  contentScriptDelay = Math.ceil(contentScriptDelay * 2);
  contentScriptInit(false);
  if ( contentScriptDelay > 999999 ) {
    return false;
  }
  setTimeout(contentScriptSetTimeout, contentScriptDelay);
}
