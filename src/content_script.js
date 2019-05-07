"use strict";

// Use the following patterns to check for on-screen Facebook elements
// Unused Patterns from previous mixed set of selectors
// "[title*='Facebook']",
// "[aria-label*='Facebook']",

const LOGIN_PATTERN_DETECTION_SELECTORS = [
  "[title='Log in with Facebook']",
  "[class*='fb-login']",
  "[class*='FacebookConnectButton']",
  "[class*='signup-provider-facebook']", // Fandom
  "[class*='facebook-connect-button']", // Twitch
  "[href*='facebook.com/v2.3/dialog/oauth']", // Spotify
  "[href*='signin/facebook']",
  "[data-oauthserver*='facebook']", // Stackoverflow
  "[id*='facebook_connect_button']", // Quora
  "[data-action*='facebook-auth']", //Medium
  "[data-destination*='facebook']",
  "[data-partner*='facebook']", // AliExpress
  ".join-linkedin-form + .third-party-btn-container button.fb-btn", // LinkedIn
  "[action*='oauth_connect?from=facebook_login&service=facebook']" // Airbnb
];

// TODO: Disarm click events on detected elements
const SHARE_PATTERN_DETECTION_SELECTORS = [
  "[href*='facebook.com/share']", // Imgur Login
  "[href*='facebook.com/dialog/share']",
  "[href*='facebook.com/sharer']", // Buzzfeed
  "[data-bfa-network*='facebook']", // Buzzfeed Mini Share
  "[aria-label*='share on facebook']", // MSN
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
    target.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }
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
  const activeBadgePrompt = activeBadge.querySelector(".fbc-badge-prompt");
  const elemRect = activeBadge.getBoundingClientRect();
  if ( (window.innerWidth - elemRect.left) < 350  ) {
    activeBadgePrompt.classList.add("fbc-badge-prompt-align-right");
  } else {
    activeBadgePrompt.classList.remove("fbc-badge-prompt-align-right");
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
    return {offsetPosX: elemRect.left - bodyRect.left, offsetPosY: elemRect.top - bodyRect.top};
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

  const parentIsHidden = (target.offsetParent === null);

  if ( parentIsHidden && !htmlBadgeDivHasDisabledClass ) {
    // Parent isnt visible and its badge needs to be hidden
    htmlBadgeDiv.classList.add("fbc-badge-disabled");
  }

  if ( !parentIsHidden && !targetIsNull && htmlBadgeDivHasDisabledClass ||  !parentIsHidden && htmlBadgeDivHasDisabledClass ) {
    htmlBadgeDiv.classList.remove("fbc-badge-disabled");
  }

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
  const bodyRect = document.body.getBoundingClientRect();
  const elemRect = target.getBoundingClientRect();

  // Determine if target element is fixed, will resets or applies class and set appor offset.
  const {offsetPosX, offsetPosY} = getOffsetsAndApplyClass(elemRect, bodyRect, target, htmlBadgeDiv);

  const htmlBadgeDivPosX = (offsetPosX + targetWidth) - elementSizeOffsetX;
  const htmlBadgeDivPosY = offsetPosY - elementSizeOffsetY;

  // TODO: Add Zindex Targeting
  // const targetZindex = calcZindex(target);

  // Set badge position based on target coordinates/size
  // htmlBadgeDiv.style.zIndex = targetZindex;
  htmlBadgeDiv.style.left = htmlBadgeDivPosX + "px";
  htmlBadgeDiv.style.top = htmlBadgeDivPosY + "px";
}

// List of badge-able in-page elements
const facebookDetectedElementsArr = [];

function patternDetection(selectionArray, socialActionIntent){
  for (let querySelector of selectionArray) {
    for (let item of document.querySelectorAll(querySelector)) {
      // overlay the FBC icon badge on the item
      if (!item.classList.contains("fbc-has-badge")) {
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
    detectFacebookOnPage();
    screenUpdate();
  }
});

let checkForTrackers = true;

browser.runtime.onMessage.addListener(message => {
  // console.log("browser.runtime.onMessage");
  // console.log(message["msg"]);
  if ( message["msg"] == "allowed-facebook-subresources" || message["msg"] == "facebook-domain" ) {
    checkForTrackers = false;
  } else {
    checkForTrackers = true;
    setTimeout(() => {
      detectFacebookOnPage();
    }, 10);
  }

  return Promise.resolve({response: "content_script onMessage listener"});
});

// For non-triggered pages
setTimeout(()=> {
  if (checkForTrackers){
    detectFacebookOnPage();
  }
}, 1000);
