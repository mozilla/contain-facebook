"use strict";

// Use the following patterns to check for on-screen Facebook elements
// Unused Patterns from previous mixed set of selectors
// "[title*='Facebook']",
// "[aria-label*='Facebook']",

const EMAIL_PATTERN_DETECTION_SELECTORS = [
  "input[type='email']",
];

const LOGIN_PATTERN_DETECTION_SELECTORS = [
  "[title='Log in with Facebook']",
  "[class*='FacebookConnectButton']",
  "[class*='js-facebook-login']", // kickstarter
  ".signup__button.button--facebook", // massdrop
  "[class*='signinInitialStep_fbButton']", // soundcloud
  "[id*='signin_fb_btn']", // Ebay
  "[class*='facebookV2Login']", // emag.ro
  "[class*='btn-facebook-signin']", // estadao.com.br
  "[class*='signup-provider-facebook']", // Fandom
  ".socialContainer-0-131 .mainFacebook-0-150", // Honey
  "[class*='facebook_login_click']", // Hi5
  "[data-test-id*='facebook-create-button']", // Doordash
  "[class*='facebook-signup-button']", // Strava
  "[class*='facebook-connect-button']", // Twitch
  "[href*='facebook.com/v2.3/dialog/oauth']", // Spotify
  "[href*='/sign_in/Facebook']", // bazqux.com
  "[href*='signin/facebook']",
  "[href*='/auth/facebook']", // Producthunt
  "[data-oauthserver*='facebook']", // Stackoverflow
  "[class*='ModalLoginSignup-facebook-connect']", // Freelancer.com
  "[id*='facebook_connect_button']", // Quora
  "[data-action*='facebook-auth']", //Medium
  "[data-login-with-facebook='']", // etsy
  "[data-destination*='facebook']",
  "[data-partner*='facebook']", // AliExpress
  ".social-login .button--facebook", // noovie.com
  "#home_account_fb.unlogged-btn-facebook", // Deezer
  "[class*='_1HC-DxGDAHiEbG3x6-vzL9']", // Match UK Login
  ".social-login > button.btn-facebook", // GroupMe
  "[class*='meetup-signupModal-facebook']", // Meetup Signup Homepage
  "#register-form--creds .button--facebook", // Meetup Signup Static Page
  "#modal--register .button--facebook", // Meetup Signup Non-homepage
  ".join-linkedin-form + .third-party-btn-container button.fb-btn", // LinkedIn
  ".fb-start .ybtn--social.ybtn--facebook", // Yelp
  "form > .c-btn.c-btn--facebook.c-btn--icon.c-btn--full", // komoot
  "[aria-label*='Log in with Facebook']", // Tinder
  "[action*='facebook_login']", // Airbnb
  "[action*='facebook_signup']", // Airbnb
  "[data-tag='login-form'] ~ span button[color='facebookBlue']", // Patreon
  ".homepage-photo-leader .welcome-buttons div.btn-facebook", // Mixcloud homepage
  ".modal-content .auth-form div.btn-facebook", // Mixcloud login modal
  "[class*='fb-login']" // Default FB class name "fbc-login-button"
];

// TODO: Disarm click events on detected elements
const SHARE_PATTERN_DETECTION_SELECTORS = [
  "[href*='facebook.com/dialog/feed']", // Feed dialog
  "[data-bfa-network*='facebook']", // Buzzfeed Mini Share
  "[aria-label*='share on facebook']", // MSN
  "[data-tracking*='facebook|share']", // football.london
  "[class*='facebookShare']", // Producthunt share
  "[class*='social-tray__link--facebook']", // Vice
  ".post-action-options + .right > .social-icon.icon-f", // Imgur share
  "[title='Share on Facebook']" // Medium
];

// TODO: Disarm click events on detected elements
const PASSIVE_SHARE_PATTERN_DETECTION_SELECTORS = [
  "[href*='facebook.com/dialog/share']", // Share dialog
  "[href*='facebook.com/sharer']", // Legacy Share dialog
];


async function getLocalStorageSettingFromBackground(setting) {
  // Send request to background determine if to show Relay email field prompt
  const backgroundResp = await browser.runtime.sendMessage({
    message: "check-settings",
    setting
  });

  return backgroundResp;
}

function isFixed (elem) {
  do {
    if (getComputedStyle(elem).position == "fixed") return true;
  } while ((elem = elem.offsetParent));
  return false;
}

const fragmentClasses = ["fbc-badge-fence", "fbc-badge-tooltip", "fbc-badge-prompt"];
const htmlBadgeFragmentPromptParagraphStrings = [ browser.i18n.getMessage("inPageUI-tooltip-prompt-p1"), browser.i18n.getMessage("inPageUI-tooltip-prompt-p2") ];
const htmlEmailBadgeFragmentPromptParagraphStrings = [ browser.i18n.getMessage("inPageUI-tooltip-email-prompt-p1"), browser.i18n.getMessage("inPageUI-tooltip-email-prompt-p2") ];
const htmlBadgeFragmentPromptButtonStrings = ["btn-cancel", "btn-allow"];
const htmlEmailBadgeFragmentPromptButtonStrings = ["btn-relay-dismiss", "btn-relay-try"];

function getTooltipFragmentStrings (socialAction) {
  switch (socialAction) {
  case "login":
    return browser.i18n.getMessage("inPageUI-tooltip-button-login");
  case "share":
    return browser.i18n.getMessage("inPageUI-tooltip-button-share");
  case "share-passive":
    return browser.i18n.getMessage("inPageUI-tooltip-button-share-passive");
  case "email":
    return browser.i18n.getMessage("inPageUI-tooltip-button-email");
  }
}

function buildSettingsObject() {
  let data = {};
  const checkboxes = document.querySelectorAll(".settings-checkbox");

  checkboxes.forEach((item) => {
    let settingName = item.id;
    Object.defineProperty(data, settingName, {
      value: item.checked,
      writable: true,
      configurable: true,
      enumerable: true
    });
  });

  return data;
}

async function updateSettings() {
  
  let localStorage = await browser.storage.local.get();

  if(!localStorage.settings) {
    localStorage.settings = {};
  }

  const checkboxes = document.querySelectorAll(".settings-checkbox");

  checkboxes.forEach((item) => {
    let settingName = item.id;
    item.checked = localStorage.settings[settingName];
  });

  await settingsCheckboxListener();
}



function settingsCheckboxListener(){
  const checkboxes = document.querySelectorAll(".settings-checkbox");

  checkboxes.forEach((item) => {
    item.addEventListener("change", async () => {
      const settings = buildSettingsObject();
      await browser.runtime.sendMessage({
        message: "update-settings",
        settings
      });
    });
  });
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
  } else if (socialAction === "email") {
    const htmlBadgeFragmentPromptDiv = htmlBadgeFragment.querySelector(".fbc-badge-prompt");

    const htmlBadgeFragmentPromptH1 = document.createElement("h1");

    htmlBadgeFragmentPromptH1.appendChild(document.createTextNode( browser.i18n.getMessage("facebookContainer") ));
    htmlBadgeFragmentPromptDiv.appendChild(htmlBadgeFragmentPromptH1);

    const htmlBadgeFragmentPromptContents = document.createElement("div");
    htmlBadgeFragmentPromptContents.className = "fbc-badge-prompt-contents";

    for (let promptParagraphString of htmlEmailBadgeFragmentPromptParagraphStrings) {
      const paragraph = document.createElement("p");
      paragraph.appendChild(document.createTextNode(promptParagraphString));
      htmlBadgeFragmentPromptContents.appendChild(paragraph);
    }

    const dontShowAgainCheckboxForm = document.createElement("div");
    dontShowAgainCheckboxForm.className = "fbc-badge-prompt-dontShowAgain-checkbox";
    const dontShowAgainCheckboxInput = document.createElement("input");
    dontShowAgainCheckboxInput.type = "checkbox";
    dontShowAgainCheckboxInput.id = "hideRelayEmailBadges";    
    dontShowAgainCheckboxInput.classList.add("fbc-badge-prompt-dontShowAgain-checkbox-input", "settings-checkbox");
    const dontShowAgainCheckboxLabel = document.createElement("label");    
    dontShowAgainCheckboxLabel.htmlFor = "hideRelayEmailBadges";
    const dontShowAgainCheckboxText = document.createTextNode( browser.i18n.getMessage("inPageUI-tooltip-prompt-checkbox") );

    dontShowAgainCheckboxLabel.appendChild(dontShowAgainCheckboxText);
    dontShowAgainCheckboxForm.appendChild(dontShowAgainCheckboxInput);
    dontShowAgainCheckboxForm.appendChild(dontShowAgainCheckboxLabel);

    htmlBadgeFragmentPromptContents.appendChild(dontShowAgainCheckboxForm);

    htmlBadgeFragmentPromptDiv.appendChild(htmlBadgeFragmentPromptContents);

    const htmlBadgeFragmentPromptButtonDiv = document.createElement("div");
    htmlBadgeFragmentPromptButtonDiv.className = "fbc-badge-prompt-buttons";

    for (let buttonString of htmlEmailBadgeFragmentPromptButtonStrings) {
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

function openLoginPrompt(parent, el, htmlBadgeDiv) {
  parent.classList.toggle("active");
  positionPrompt( htmlBadgeDiv );
  el.classList.toggle("js-fbc-prompt-active");
  document.body.classList.toggle("js-fbc-prompt-active");
  htmlBadgeDiv.querySelector(".fbc-badge-prompt-btn-cancel").focus()
}

function addFacebookBadge (target, badgeClassUId, socialAction) {
  // Detect if target is visible

  const htmlBadgeDiv = createBadgeFragment(socialAction);

  const htmlBadgeFragmentPromptButtonCancel = htmlBadgeDiv.querySelector(".fbc-badge-prompt-btn-cancel");
  const htmlBadgeFragmentPromptButtonAllow = htmlBadgeDiv.querySelector(".fbc-badge-prompt-btn-allow");
  const htmlEmailBadgeFragmentPromptButtonDismiss = htmlBadgeDiv.querySelector(".fbc-badge-prompt-btn-relay-dismiss");
  const htmlEmailBadgeFragmentPromptButtonTry = htmlBadgeDiv.querySelector(".fbc-badge-prompt-btn-relay-try");
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
      if (!e.isTrusted) {
        // The click was not user generated so ignore
        return false;
      } 
      
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
        openLoginPrompt(htmlBadgeFragmentFenceDiv.parentElement, target, htmlBadgeDiv);
      }
    });

    htmlBadgeFragmentFenceDiv.addEventListener("click", (e) => {
      if (!e.isTrusted) {
        // The click was not user generated so ignore
        return false;
      } 
      
      e.preventDefault();
      openLoginPrompt(e.target.parentElement, target, htmlBadgeDiv);
    });

    // Add to Container "Allow"
    htmlBadgeFragmentPromptButtonAllow.addEventListener("click", (e) => {
      if (!e.isTrusted) {
        // The click was not user generated so ignore
        return false;
      } 

      e.preventDefault();
      allowClickSwitch = true;
      browser.runtime.sendMessage({
        message: "add-domain-to-list"
      });

      target.click();
    });

    // Close prompt
    htmlBadgeFragmentPromptButtonCancel.addEventListener("click", (e) => {
      if (!e.isTrusted) {
        // The click was not user generated so ignore
        return false;
      } 
      e.preventDefault();
      document.body.classList.remove("js-fbc-prompt-active");
      document.querySelector(".fbc-has-badge.js-fbc-prompt-active").classList.remove("js-fbc-prompt-active");
      e.target.parentElement.parentNode.parentNode.classList.remove("active");
    });
  } else if (socialAction === "email") {
    htmlBadgeFragmentFenceDiv.addEventListener("click", (e) => {
      if (!e.isTrusted) {
        // The click was not user generated so ignore
        return false;
      } 
      e.preventDefault();
      e.target.parentElement.classList.toggle("active");
      positionPrompt( htmlBadgeDiv );
      target.classList.toggle("js-fbc-prompt-active");
      document.body.classList.toggle("js-fbc-prompt-active");
    });

    // Add to Container "Allow"
    htmlEmailBadgeFragmentPromptButtonTry.addEventListener("click", (e) => {
      if (!e.isTrusted) {
        // The click was not user generated so ignore
        return false;
      } 
      

      window.open("https://relay.firefox.com/?utm_source=firefox&utm_medium=addon&utm_campaign=Facebook%20Container&utm_content=Try%20Firefox%20Relay");
    });

    // Dismiss email/relay prompt
    htmlEmailBadgeFragmentPromptButtonDismiss.addEventListener("click", (e)=>{
      if (!e.isTrusted) {
        // The click was not user generated so ignore
        return false;
      } 
      
      closePrompt();
      const activeBadge = document.querySelector("." + badgeClassUId);
      activeBadge.style.display = "none";
    }, false);

  } else if (socialAction === "share-passive") {
    htmlBadgeDiv.classList.add("fbc-badge-share-passive", "fbc-badge-share");

    shareBadgeEventListenerInit(target, htmlBadgeDiv, {allowClickThrough: true});

  } else if (socialAction === "share")  {
    htmlBadgeDiv.classList.add("fbc-badge-share");
    shareBadgeEventListenerInit(target, htmlBadgeDiv, {allowClickThrough: true});
  }

  // Applies to both!
  htmlBadgeFragmentFenceDiv.addEventListener("mouseenter", () => {
    positionPrompt( htmlBadgeDiv );
  });

}

// Add Event Listener actions/hooks to share badges
function shareBadgeEventListenerInit(target, htmlBadgeDiv, options) {
  if (!options.allowClickThrough) {
    target.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  target.addEventListener("mouseover", () => {
    target.classList.add("fbc-badge-tooltip-active");
    htmlBadgeDiv.classList.add("fbc-badge-tooltip-active");
    setTimeout( ()=> {
      positionPrompt( htmlBadgeDiv );
    }, 50 );
  });

  target.addEventListener("mouseout", () => {
    target.classList.remove("fbc-badge-tooltip-active");
    htmlBadgeDiv.classList.remove("fbc-badge-tooltip-active");
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
  const elemRect = activeBadge.getBoundingClientRect();

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

function isVisible(target) {
  const currentComputedStyle = window.getComputedStyle(target, false);
  const styleTransform = ( currentComputedStyle.getPropertyValue("transform") === "matrix(1, 0, 0, 0, 0, 0)" );
  const styleHidden = ( currentComputedStyle.getPropertyValue("visibility") === "hidden" );
  const styleDisplayNone = ( currentComputedStyle.getPropertyValue("display") === "none" );
  if (styleTransform || styleHidden || styleDisplayNone) return false;
  return true;
}

function checkVisibilityAndApplyClass(target, htmlBadgeDiv) {

  if ( target === null ) {
    htmlBadgeDiv.classList.add("fbc-badge-disabled");
    return false;
  }

  const htmlBadgeDivHasDisabledClass = htmlBadgeDiv.classList.contains("fbc-badge-disabled");

  if (!isVisible(target)) {
    if (!htmlBadgeDivHasDisabledClass) {
      htmlBadgeDiv.classList.add("fbc-badge-disabled");
    }
    return false;
  }

  const { parentElement } = target;
  if (parentElement) {
    if ( !isVisible(parentElement) ) {
      if (!htmlBadgeDivHasDisabledClass) {
        htmlBadgeDiv.classList.add("fbc-badge-disabled");
      }
      return false;
    } else {
      if ( htmlBadgeDivHasDisabledClass ) {
        htmlBadgeDiv.classList.remove("fbc-badge-disabled");
      }
      return true;
    }
  }

  const { offsetParent } = target;
  if (offsetParent) {
    if ( !isVisible(parentElement)) {
      if (!htmlBadgeDivHasDisabledClass) {
        htmlBadgeDiv.classList.add("fbc-badge-disabled");
      }
      return false;
    } else {
      if ( htmlBadgeDivHasDisabledClass ) {
        htmlBadgeDiv.classList.remove("fbc-badge-disabled");
      }
      return true;
    }
  }
  return true;
}

function determineContainerClientRect() {
  const htmlHeight = document.querySelector("html").offsetHeight;
  const bodyHeight = document.querySelector("body").offsetHeight;
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

  if (!checkVisibilityAndApplyClass(target, htmlBadgeDiv)) {
    return;
  }

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
  let querySelector = selectionArray.join(",");

  for (let item of document.querySelectorAll(querySelector)) {
    // overlay the FBC icon badge on the item
    if (!item.classList.contains("fbc-has-badge") && !isPinterest(item) && !parentIsBadged(item)) {
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

async function detectFacebookOnPage () {
  if (!checkForTrackers) {
    return;
  }

  patternDetection(PASSIVE_SHARE_PATTERN_DETECTION_SELECTORS, "share-passive");
  patternDetection(SHARE_PATTERN_DETECTION_SELECTORS, "share");
  patternDetection(LOGIN_PATTERN_DETECTION_SELECTORS, "login");
  const relayAddonEnabled = await getRelayAddonEnabledFromBackground();
  
  // Check if any FB trackers were blocked, scoped to only the active tab
  const trackersDetectedOnCurrentPage = await checkIfTrackersAreDetectedOnCurrentPage();

  // Check if user dismissed the Relay prompt
  const relayAddonPromptDismissed = await getLocalStorageSettingFromBackground("hideRelayEmailBadges");
  if (relayAddonPromptDismissed && !relayAddonEnabled && !relayAddonPromptDismissed.hideRelayEmailBadges && trackersDetectedOnCurrentPage) {
    patternDetection(EMAIL_PATTERN_DETECTION_SELECTORS, "email");
    updateSettings();
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

async function contentScriptInit(resetSwitch, msg) {
  // Second arg is for debugging to see which contentScriptInit fires
  // Call count tracks number of times contentScriptInit has been called
  // callCount = callCount + 1;

  if (resetSwitch) {
    contentScriptDelay = 999;
    contentScriptSetTimeout();
  }

  // Resource call is not in FBC/FB Domain and is a FB resource
  if (checkForTrackers && msg !== "other-domain") {
    await detectFacebookOnPage();
    screenUpdate();
  }
}

async function getRelayAddonEnabledFromBackground() {
  const relayAddonEnabled = await browser.runtime.sendMessage({
    message: "get-relay-enabled"
  });
  return relayAddonEnabled;
}

async function checkIfTrackersAreDetectedOnCurrentPage() {
  const trackersDetected = await browser.runtime.sendMessage({
    message: "are-trackers-detected"
  });
  return trackersDetected;
}

async function getRootDomainFromBackground(url) {
  // Send request to background to parse URL via PSL
  const backgroundResp = await browser.runtime.sendMessage({
    message: "get-root-domain",
    url
  });

  return backgroundResp;
}

async function CheckIfURLShouldBeBlocked() {
  const siteList = await browser.runtime.sendMessage({
    message: "what-sites-are-added"
  });

  const site = await getRootDomainFromBackground(window.location.href);

  if (siteList.includes(site)) {
    checkForTrackers = false;
  } else {
    await contentScriptInit(false);
  }

}

// Cross-browser implementation of element.addEventListener()
function addPassiveWindowOnloadListener() {
  window.addEventListener("load", function() {
    CheckIfURLShouldBeBlocked();
  }, false);
}

addPassiveWindowOnloadListener();

function contentScriptSetTimeout() {
  // console.timeEnd('contentScriptSetTimeout');
  // console.timeStart('contentScriptSetTimeout');
  contentScriptDelay = Math.ceil(contentScriptDelay * 2);
  contentScriptInit(false);
  if ( contentScriptDelay > 999999 ) {
    return false;
  }
  setTimeout(contentScriptSetTimeout, contentScriptDelay);
}
