"use strict";

// Use the following patterns to check for on-screen Facebook elements

const PATTERN_DETECTION_SELECTORS = [
  "[title*='Facebook']",
  "[title='Log in with Facebook']",
  "[class*='fb-login']",
  "[class*='FacebookConnectButton']",
  "[class*='signup-provider-facebook']", // Fandom
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
  "[data-destination*='facebook']",
  "[data-partner*='facebook']" // AliExpress
];

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

function isFixed (elem) {
  do {
    if (getComputedStyle(elem).position == "fixed") return true;
  } while ((elem = elem.offsetParent));
  return false;
}

const fragmentClasses = ["fbc-badge-fence", "fbc-badge-tooltip", "fbc-badge-prompt"];
const htmlBadgeFragmentPromptParagraphStrings = ["Allow Facebook to track you here?", "If you want to use log in with Facebook then Facebook will then be able to track your activity on this site. This can helpthem build a fuller picture of your online life."];
const htmlBadgeFragmentPromptCheckboxLabelString = "Don't show me this again";
const htmlBadgeFragmentPromptButtonStrings = ["btn-cancel", "btn-allow"];

function createBadgeFragment () {
  const htmlBadgeFragment = document.createDocumentFragment();

  for (let className of fragmentClasses) {
    const div = document.createElement("div");
    div.className = className;
    htmlBadgeFragment.appendChild(div);
  }

  const htmlBadgeFragmentTooltipDiv = htmlBadgeFragment.querySelector(".fbc-badge-tooltip");
  const htmlBadgeFragmentPromptDiv = htmlBadgeFragment.querySelector(".fbc-badge-prompt");
  // const htmlBadgeFragmentFenceDiv = htmlBadgeFragment.querySelector(".fbc-badge-fence");

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

  // <input type="checkbox" id="scales" name="scales" checked>
  // <label for="scales">Scales</label>

  const htmlBadgeFragmentPromptForm = document.createElement("form");
  const htmlBadgeFragmentPromptCheckbox = document.createElement("input");
  htmlBadgeFragmentPromptCheckbox.type = "checkbox";
  htmlBadgeFragmentPromptCheckbox.id = "showHideToggle";
  const htmlBadgeFragmentPromptCheckboxLabel = document.createElement("label");
  htmlBadgeFragmentPromptCheckboxLabel.htmlFor = "showHideToggle";
  htmlBadgeFragmentPromptCheckboxLabel.appendChild(document.createTextNode(htmlBadgeFragmentPromptCheckboxLabelString));

  htmlBadgeFragmentPromptForm.appendChild(htmlBadgeFragmentPromptCheckbox);
  htmlBadgeFragmentPromptForm.appendChild(htmlBadgeFragmentPromptCheckboxLabel);
  htmlBadgeFragmentPromptContents.appendChild(htmlBadgeFragmentPromptForm);

  htmlBadgeFragmentPromptDiv.appendChild(htmlBadgeFragmentPromptContents);

  const htmlBadgeFragmentPromptButtonDiv = document.createElement("div");
  htmlBadgeFragmentPromptButtonDiv.className = "fbc-badge-prompt-buttons";
  for (let buttonString of htmlBadgeFragmentPromptButtonStrings) {
    const button = document.createElement("button");
    const currentIndex = htmlBadgeFragmentPromptButtonStrings.indexOf(buttonString);
    button.className = "fbc-badge-prompt-button-" + currentIndex;
    button.appendChild(document.createTextNode( browser.i18n.getMessage(buttonString) ));
    htmlBadgeFragmentPromptButtonDiv.appendChild(button);
  }

  htmlBadgeFragmentPromptDiv.appendChild(htmlBadgeFragmentPromptButtonDiv);

  htmlBadgeFragmentTooltipDiv.appendChild( document.createTextNode( browser.i18n.getMessage("inPageUI-tooltip-share-button") ) );

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

function addFacebookBadge (target, badgeClassUId) {
  // Detect if target is visible

  const htmlBadgeDiv = createBadgeFragment();

  const htmlBadgeFragmentPromptButtonCancel = htmlBadgeDiv.querySelector(".fbc-badge-prompt-button-0");
  const htmlBadgeFragmentPromptButtonAllow = htmlBadgeDiv.querySelector(".fbc-badge-prompt-button-1");
  const htmlBadgeFragmentFenceDiv = htmlBadgeDiv.querySelector(".fbc-badge-fence");

  htmlBadgeDiv.className = "fbc-badge " + badgeClassUId;

  document.body.appendChild(htmlBadgeDiv);

  const itemWidth = parseInt(target.offsetWidth, 10);
  const itemHeight = parseInt(target.offsetHeight, 10);

  const ratioCheck = (itemWidth / itemHeight);

  const badgeSmallSwitch = shouldBadgeBeSmall(ratioCheck, itemHeight);
  if (badgeSmallSwitch) {
    htmlBadgeDiv.classList.add("fbc-badge-small");
  }

  positionFacebookBadge(target, badgeClassUId, itemWidth, badgeSmallSwitch);

  // Show/hide prompt
  htmlBadgeFragmentFenceDiv.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentElement.classList.toggle("active");
    document.body.classList.toggle("js-fbc-prompt-active");
    positionPrompt( badgeClassUId );
  });

  // Add to Container "Allow"
  htmlBadgeFragmentPromptButtonAllow.addEventListener("click", (e) => {
    e.preventDefault();
    browser.runtime.sendMessage("add-to-facebook-container");
    target.click();
  });

  // Close prompt
  htmlBadgeFragmentPromptButtonCancel.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.remove("js-fbc-prompt-active");
    e.target.parentElement.parentNode.parentNode.classList.remove("active");
  });
}

function findActivePrompt() {
  const allBadges = document.querySelectorAll(".fbc-badge");
  for (let badge of allBadges) {
    if ( badge.classList.contains("active") ){
      return badge;
    }
  }
}

function closePrompt() {
  const activePrompt = findActivePrompt();
  activePrompt.classList.remove("active");
  document.body.classList.remove("js-fbc-prompt-active");
}

function positionPrompt ( target ) {
  target = document.querySelector("." + target);
  const targetPrompt = target.querySelector(".fbc-badge-prompt");
  const elemRect = target.getBoundingClientRect();
  if ( (window.innerWidth - elemRect.left) < 350  ) {
    targetPrompt.classList.add("fbc-badge-prompt-align-right");
  } else {
    targetPrompt.classList.remove("fbc-badge-prompt-align-right");
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

function checkVisibilityAndAppleClass(target, htmlBadgeDiv) {

  // console.log("checkVisibilityAndAppleClass");

  const htmlBadgeDivHasDisabledClass = htmlBadgeDiv.classList.contains("fbc-badge-disabled");
  const targetIsNull = (target === null);

  if ( targetIsNull && !htmlBadgeDivHasDisabledClass ) {
    // Element no longer exists and its badge needs to be hidden
    htmlBadgeDiv.classList.add("fbc-badge-disabled");
    return;
  }

  const parentIsHidden = (target.offsetParent === null);

  // console.log([parentIsHidden, targetIsNull]);

  if ( parentIsHidden && !htmlBadgeDivHasDisabledClass ) {
    // Parent isnt visible and its badge needs to be hidden
    htmlBadgeDiv.classList.add("fbc-badge-disabled");
  }

  if ( !parentIsHidden && !targetIsNull && htmlBadgeDivHasDisabledClass ||  !parentIsHidden && htmlBadgeDivHasDisabledClass ) {
    htmlBadgeDiv.classList.remove("fbc-badge-disabled");
  }

}

function calcZindex(target) {
  const targetParents = [];

  while (target) {
    targetParents.unshift(target);
    target = target.parentNode;
    const parentZindex = window.getComputedStyle(target).getPropertyValue("z-index");
    if ( parentZindex !== "auto" ) {
      return parseInt(parentZindex, 10) + 1;
    }
  }
  return 0;
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

  checkVisibilityAndAppleClass(target, htmlBadgeDiv);

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
  // console.log(targetZindex);

  // Set badge position based on target coordinates/size
  // htmlBadgeDiv.style.zIndex = targetZindex;
  htmlBadgeDiv.style.left = htmlBadgeDivPosX + "px";
  htmlBadgeDiv.style.top = htmlBadgeDivPosY + "px";
}

// List of badge-able in-page elements
const facebookDetectedElementsArr = [];

function detectFacebookOnPage () {
  if (!checkForTrackers) {
    return;
  }
  for (let querySelector of PATTERN_DETECTION_SELECTORS) {
    for (let item of document.querySelectorAll(querySelector)) {
      // overlay the FBC icon badge on the item
      if (!item.classList.contains("fbc-badged")) {
        const itemUIDClassName = "fbc-badgeUID_" + (facebookDetectedElementsArr.length + 1);
        const itemUIDClassTarget = "js-" + itemUIDClassName;
        facebookDetectedElementsArr.push(itemUIDClassName);
        addFacebookBadge(item, itemUIDClassTarget);
        item.classList.add("fbc-badged");
        item.classList.add(itemUIDClassName);
      }
    }
  }
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
  // console.log("scrolling");
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
    if ( !activePrompt.contains(e.target) ) {
      closePrompt();
    }
  } else {
    detectFacebookOnPage();
    screenUpdate();
  }
});

let checkForTrackers = true;

browser.runtime.onMessage.addListener(message => {
  if ( message["msg"] == "allowe-facebook-subresources" || message["msg"] == "facebook-domain" ) {
    checkForTrackers = false;
  } else {
    checkForTrackers = true;
    setTimeout(() => {
      detectFacebookOnPage();
    }, 10);
  }

  return Promise.resolve({response: "content_script onMessage listener"});
});

setTimeout(()=> {
  if (checkForTrackers){
    detectFacebookOnPage();
  }
}, 200);
