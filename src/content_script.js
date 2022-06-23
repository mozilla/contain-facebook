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
  "[id*='signin_fb_btn']", // Ebay
  ".btn-social.facebook", // emag.ro
  ".button-login.facebook-login", // estadao.com.br
  "[class*='signup-provider-facebook']", // Fandom
  ".socialContainer-0-131 .mainFacebook-0-150", // Honey
  "[class*='facebook_login_click']", // Hi5
  "[data-test-id*='facebook-create-button']", // Doordash
  "[class*='FacebookButton--facebook-button']", // Strava
  "#login_form > .facebook", // Strava
  "[class*='facebook-connect-button']", // Twitch
  "[data-testid*='facebook-login']", // Spotify
  ".logInWithButtons .logInWith.facebook", // bazqux.com
  "[href*='signin/facebook']",
  "[data-test*='login-with-facebook']", // Producthunt
  "[data-oauthserver*='facebook']", // Stackoverflow
  ".puppeteer_test_login_button_facebook", // Quora
  "[href*='connect/facebook']", //Medium
  "[data-login-with-facebook='']", // etsy
  "[data-destination*='facebook']",
  ".fm-sns-item.facebook", // AliExpress
  ".social-login .button--facebook", // noovie.com
  "#home_account_fb", // Deezer
  ".front-door .btn.btn-facebook", // GroupMe
  "[class*='meetup-signupModal-facebook']", // Meetup Signup Homepage
  "#facebook-register", // Meetup Signup Static Page
  "[href*='https://www.facebook.com/v11.0/dialog/oauth']", // Meetup Signup Non-homepage
  ".fb-start .ybtn--social.ybtn--facebook", // Yelp
  "[aria-label*='Log in with Facebook']", // Tinder
  ".registration__form .button.color-provider-facebook", // Bumble
  "#facebookLoginButton", // eHarmony
  "[action*='facebook_login']", // Airbnb
  "[action*='facebook_signup']", // Airbnb
  "#social-auth-provider-facebook-web", // VRBO
  "[class*='FBLoginForm__Button']", // Mixcloud homepage
  ".button.button--facebook", // Buzzfeed Login
  "#js-facebook-oauth-login", // NY Times
  "#login-facebook-button", // Indeed
  ".btn-social-connect.btn-facebook", // Zillow (Zindex Issue)
  "[class*='fb-login']", // Default FB class name "fbc-login-button"
  ".fb-login-button" // Default FB class name "fbc-login-button"
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

function isFixed(elem) {
  do {
    if (getComputedStyle(elem).position == "fixed") return true;
  } while ((elem = elem.offsetParent));
  return false;
}

const fragmentClasses = ["fbc-badge-fence", "fbc-badge-tooltip", "fbc-badge-prompt"];
<<<<<<< HEAD
=======
const htmlBadgeFragmentPromptParagraphStrings = [browser.i18n.getMessage("inPageUI-tooltip-prompt-p1"), browser.i18n.getMessage("inPageUI-tooltip-prompt-p2")];
const htmlEmailBadgeFragmentPromptParagraphStrings = [browser.i18n.getMessage("inPageUI-tooltip-email-prompt-p1"), browser.i18n.getMessage("inPageUI-tooltip-email-prompt-p2")];
const htmlBadgeFragmentPromptButtonStrings = ["btn-cancel", "btn-allow"];
const htmlEmailBadgeFragmentPromptButtonStrings = ["btn-relay-dismiss", "btn-relay-try"];
>>>>>>> 3cdab59 (add mobile panel orientation)

function getTooltipFragmentStrings(socialAction) {
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

  if (!localStorage.settings) {
    localStorage.settings = {};
  }

  const checkboxes = document.querySelectorAll(".settings-checkbox");

  checkboxes.forEach((item) => {
    let settingName = item.id;
    item.checked = localStorage.settings[settingName];
  });

  await settingsCheckboxListener();
}

<<<<<<< HEAD
=======


>>>>>>> 3cdab59 (add mobile panel orientation)
function settingsCheckboxListener() {
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

function createBadgeFragment(socialAction) {
  const htmlBadgeFragment = document.createDocumentFragment();

  for (let className of fragmentClasses) {
    const div = document.createElement("div");
    div.className = className;
    htmlBadgeFragment.appendChild(div);
  }

  // Create Tooltip
  const htmlBadgeFragmentTooltipDiv = htmlBadgeFragment.querySelector(".fbc-badge-tooltip");
<<<<<<< HEAD
<<<<<<< HEAD
  htmlBadgeFragmentTooltipDiv.appendChild(document.createTextNode(getTooltipFragmentStrings(socialAction)));
=======
  htmlBadgeFragmentTooltipDiv.appendChild( document.createTextNode( getTooltipFragmentStrings(socialAction) ) );
>>>>>>> c07e173 (reposition iframe on resize)
=======
  htmlBadgeFragmentTooltipDiv.appendChild(document.createTextNode(getTooltipFragmentStrings(socialAction)));
>>>>>>> 3cdab59 (add mobile panel orientation)

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

function createElementWithClassList(elemType, elemClass) {
  const newElem = document.createElement(elemType);
  newElem.classList.add(elemClass);
  return newElem;
}

<<<<<<< HEAD
function buildInpageIframe(socialAction, target, FBC_IFRAME_HEIGHT) {
=======

<<<<<<< HEAD
function buildInpageIframe(socialAction, target) {
>>>>>>> c07e173 (reposition iframe on resize)
=======
function buildInpageIframe(socialAction, target, FBC_IFRAME_HEIGHT) {
>>>>>>> de2a237 (resize iframe height according to content)
  const iframe = document.createElement("iframe");
  iframe.src = browser.runtime.getURL(`inpage-content.html?action=${socialAction}`);
  iframe.width = 350;
  // This height is derived from the Figma file. However, this is just the starting instance of the iframe/inpage menu. After it's built out, it resizes itself based on the inner contents.
  iframe.height = FBC_IFRAME_HEIGHT;
  iframe.title = browser.i18n.getMessage("facebookContainer");
  iframe.tabIndex = 0;
  iframe.ariaHidden = "false";
  iframe.id = socialAction;
  iframe.classList.add("fbc-content-box");
<<<<<<< HEAD
  
  // setIframeSrcValue(iframe.src);
=======
>>>>>>> c07e173 (reposition iframe on resize)

  return iframe;
}

<<<<<<< HEAD
// function setIframeSrcValue(val) {
//   // return val;
//   const iframeVal = val;
//   // return val;
// }

// function getIframeSrcValue() {
//   const val = getIframeSrcValue();
//   // console.log(val);
//   // return "hello";
// }


function injectIframeOntoPage(socialAction, target, FBC_IFRAME_HEIGHT) {
  const fbcContent = buildInpageIframe(socialAction, target, FBC_IFRAME_HEIGHT);

=======
function injectIframeOntoPage(socialAction, target, FBC_IFRAME_HEIGHT) {
  const fbcContent = buildInpageIframe(socialAction, target, FBC_IFRAME_HEIGHT);
>>>>>>> de2a237 (resize iframe height according to content)
  const fbcWrapper = createElementWithClassList(
<<<<<<< HEAD
<<<<<<< HEAD
    "div",
    "fbc-wrapper"
  );
  const fbcChevron = createElementWithClassList(
    "div",
    "fbc-iframe-chevron"
=======
      "div",
      "fbc-wrapper"
    );
  const fbcChevron = createElementWithClassList(
    "div",
    "iframe-chevron"
>>>>>>> 3cc76d3 (add right/left chevron)
=======
    "div",
    "fbc-wrapper"
  );
  const fbcChevron = createElementWithClassList(
    "div",
    "fbc-iframe-chevron"
>>>>>>> 3cdab59 (add mobile panel orientation)
  );

  fbcWrapper.appendChild(fbcChevron);
  fbcWrapper.appendChild(fbcContent);

  return fbcWrapper;
}

function positionIframe(fencePos) {
  const fencePosition = fencePos.getBoundingClientRect();
  const iframeBox = document.querySelector(".fbc-content-box");
  const iframeWrapper = document.querySelector(".fbc-wrapper");
  const iframeElement = iframeWrapper.getElementsByTagName("iframe");
  const iframeChevron = document.querySelector(".fbc-iframe-chevron");
<<<<<<< HEAD

  const offsetX = 20;
  const offsetY = 55;

  const iframePaddingAllowance = iframeBox.offsetWidth + offsetX;

  // Desktop Values
  const xRight = fencePosition.x + offsetX + fencePos.offsetWidth;
  const xLeft = fencePosition.x - iframePaddingAllowance;
  const yPos = fencePosition.y - offsetY;

  // Mobile Values
  const xPosMobile = fencePosition.x;
  const yPosMobile = fencePosition.y + offsetY;

  const iconRightAllowance = window.innerWidth - fencePosition.x + fencePos.offsetWidth;
  const iconLeftAllowance = window.innerWidth - iconRightAllowance;

  // Desktop Orientation
  if (iconRightAllowance > iframePaddingAllowance || iconLeftAllowance > iframePaddingAllowance) {

    // Position iframe relative to FBC Icon
    iframeBox.style.marginLeft = `${xRight}px`;
    iframeBox.style.marginTop = `${yPos}px`;

    // Add Chevron (Default left arrow)
    const xPosChevron = xRight - iframeChevron.offsetWidth;
    const yPosChevron = yPos + offsetY;

<<<<<<< HEAD
    iframeChevron.style.marginLeft = `${xPosChevron}px`;
    iframeChevron.style.marginTop = `${yPosChevron}px`;

    const calculateOffsetDiff = window.innerWidth - fencePosition.x;

    // Flip the iframe to show on the left side when icon is too close to the edge
    if (iframePaddingAllowance > calculateOffsetDiff) {
      iframeBox.style.marginLeft = `${xLeft}px`;
      iframeChevron.classList.add("fbc-chevron-arrow-right");
      iframeChevron.style.marginLeft = `${xPosChevron - fencePos.offsetWidth - iframeChevron.offsetWidth - offsetX}px`;
    }

    else {
      iframeChevron.classList.remove("fbc-chevron-arrow-right");
    }

    iframeChevron.classList.remove("fbc-chevron-arrow-top");
  }

  // Mobile Orientation
  else {
    for (const panels of iframeElement) {
      panels.width = window.innerWidth;
      if (window.innerWidth > 480) {
        panels.width = 350;
      }
    }

    iframeChevron.classList.add("fbc-chevron-arrow-top");
    iframeBox.style.marginTop = `${yPosMobile}px`;

    const xPosChevronMobile = xPosMobile;
    const yPosChevronMobile = yPosMobile - iframeChevron.offsetWidth;

    iframeChevron.style.marginLeft = `${xPosChevronMobile}px`;
    iframeChevron.style.marginTop = `${yPosChevronMobile}px`;

  }
=======
  const offsetX = 20; 
=======

  const offsetX = 20;
>>>>>>> 3cdab59 (add mobile panel orientation)
  const offsetY = 55;

  const iframePaddingAllowance = iframeBox.offsetWidth + offsetX;

  // Desktop Values
  const xRight = fencePosition.x + offsetX + fencePos.offsetWidth;
  const xLeft = fencePosition.x - iframePaddingAllowance;
  const yPos = fencePosition.y - offsetY;

  // Mobile Values
  const xPosMobile = fencePosition.x;
  const yPosMobile = fencePosition.y + offsetY;

  const iconRightAllowance = window.innerWidth - fencePosition.x + fencePos.offsetWidth;
  const iconLeftAllowance = window.innerWidth - iconRightAllowance;

  // Desktop Orientation
  if (iconRightAllowance > iframePaddingAllowance || iconLeftAllowance > iframePaddingAllowance) {

    // Position iframe relative to FBC Icon
    iframeBox.style.marginLeft = `${xRight}px`;
    iframeBox.style.marginTop = `${yPos}px`;

    // Add Chevron (Default left arrow)
    const xPosChevron = xRight - iframeChevron.offsetWidth;
    const yPosChevron = yPos + offsetY;

    iframeChevron.style.marginLeft = `${xPosChevron}px`;
    iframeChevron.style.marginTop = `${yPosChevron}px`;

    const calculateOffsetDiff = window.innerWidth - fencePosition.x;

    // Flip the iframe to show on the left side when icon is too close to the edge
    if (iframePaddingAllowance > calculateOffsetDiff) {
      iframeBox.style.marginLeft = `${xLeft}px`;
      iframeChevron.classList.add("fbc-chevron-arrow-right");
      iframeChevron.style.marginLeft = `${xPosChevron - fencePos.offsetWidth - iframeChevron.offsetWidth - offsetX}px`;
    }

    else {
      iframeChevron.classList.remove("fbc-chevron-arrow-right");
    }

    iframeChevron.classList.remove("fbc-chevron-arrow-top");
  }

  // Mobile Orientation
  else {
    for (const panels of iframeElement) {
      panels.width = window.innerWidth;
      if (window.innerWidth > 480) {
        panels.width = 350;
      }
    }

    iframeChevron.classList.add("fbc-chevron-arrow-top");
    iframeBox.style.marginTop = `${yPosMobile}px`;

<<<<<<< HEAD
>>>>>>> e14401f (flip iframe on small device width)
=======
    const xPosChevronMobile = xPosMobile;
    const yPosChevronMobile = yPosMobile - iframeChevron.offsetWidth;

    iframeChevron.style.marginLeft = `${xPosChevronMobile}px`;
    iframeChevron.style.marginTop = `${yPosChevronMobile}px`;

  }
>>>>>>> 3cdab59 (add mobile panel orientation)
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
function openInputPrompt(socialAction, fencePos, target, FBC_IFRAME_HEIGHT) {
=======
function openLoginPrompt(socialAction, fencePos, htmlBadgeDiv, target) {
=======
function openLoginPrompt(socialAction, fencePos, target) {
>>>>>>> c07e173 (reposition iframe on resize)
=======
function openLoginPrompt(socialAction, fencePos, target, FBC_IFRAME_HEIGHT) {
<<<<<<< HEAD
>>>>>>> de2a237 (resize iframe height according to content)
  const hasFbcWrapper = document.querySelector('.fbc-wrapper');
=======
  const hasFbcWrapper = document.querySelector(".fbc-wrapper");
>>>>>>> 9da6a46 (add reload on allow prompt)
  if (!hasFbcWrapper) {
    injectIframeOntoPage(socialAction, target, FBC_IFRAME_HEIGHT);
    positionIframe(fencePos);
>>>>>>> d5ca6b2 (localize emails trings)

<<<<<<< HEAD
  const iframeSrcVal = buildInpageIframe(socialAction, target, FBC_IFRAME_HEIGHT).src;

  const hasFbcWrapper = document.querySelector(".fbc-wrapper");
  if (!hasFbcWrapper) {
    document.body.appendChild(injectIframeOntoPage(socialAction, target, FBC_IFRAME_HEIGHT));
    positionIframe(fencePos);
=======
>>>>>>> c125976 (resize and scroll reposition iframe)
    ["resize", "scroll"].forEach(function (evt) {
      if (document.querySelector(".fbc-wrapper")) {
        window.addEventListener(evt, () => {
          positionIframe(fencePos);
        });
<<<<<<< HEAD
=======
      }
    });

    window.addEventListener("message", (e) => {
      if (e.data === "allowTriggered") {
        target.click();
>>>>>>> c125976 (resize and scroll reposition iframe)
      }
    });

    postMessageListeners(iframeSrcVal, target);
    
  } else {
    hasFbcWrapper.remove();
  }
}

function postMessageListeners(iframeSrcVal, target){

  window.addEventListener("message", (e) => {
    if (
      e.data === "allowTriggered" 
      && iframeSrcVal.includes(e.origin)
    ){
      target.click();
    }
  });

  window.addEventListener("message", (e) => {
    if (
      e.data === "closeTheInjectedIframe" 
      && iframeSrcVal.includes(e.origin)
    ) {
      closeIframe();
    }
  });

  window.addEventListener("message", (e) => {
    if (
      e.data === "checkboxTicked" 
      && iframeSrcVal.includes(e.origin)
      && localStorageAvailable()
    ) {
      setLocalStorageTickedCheckBox();
    }
  });
}

async function localStorageAvailable() {
  if (typeof(Storage) !== "undefined") {
    return true;
  } else {
    return false;
  }
}

function setLocalStorageTickedCheckBox() {
  localStorage.setItem("checkbox-ticked", true);
}


function addFacebookBadge(target, badgeClassUId, socialAction) {
  // Detect if target is visible

  const htmlBadgeDiv = createBadgeFragment(socialAction);

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

<<<<<<< HEAD
<<<<<<< HEAD
  const FBC_IFRAME_HEIGHT_LOGIN = 230;
  const FBC_IFRAME_HEIGHT_EMAIL = 240;

=======
>>>>>>> c07e173 (reposition iframe on resize)
=======
  const FBC_IFRAME_HEIGHT_LOGIN = 250;
  const FBC_IFRAME_HEIGHT_EMAIL = 290;

<<<<<<< HEAD
>>>>>>> de2a237 (resize iframe height according to content)
=======
  let allowClickSwitch = false;

  window.addEventListener("message", (e) => {
    if (e.data === "allowTriggered") {
      allowClickSwitch = true;
    }
  });

>>>>>>> 9da6a46 (add reload on allow prompt)
  // Show/hide prompt if login element
  if (socialAction === "login") {
    htmlBadgeFragmentFenceDiv.addEventListener("click", (e) => {

      if (!e.isTrusted) {
        // The click was not user generated so ignore
        return false;
<<<<<<< HEAD
<<<<<<< HEAD
      }

      else {
        e.preventDefault();
        e.stopPropagation();
        openInputPrompt("login", e.target.parentElement, target, FBC_IFRAME_HEIGHT_LOGIN);    
      }
    });
  } 
  
  if (socialAction === "email") {

    // Remove the email prompt when the "do not show me again" checkbox is ticked for the first time
    window.addEventListener("message", () => {
      if (
        localStorage.getItem("checkbox-ticked") === "true"
      ) {
        htmlBadgeFragmentFenceDiv.remove();
        closeIframe();
      }
=======
      } 
      
=======
      }

<<<<<<< HEAD
>>>>>>> 3cdab59 (add mobile panel orientation)
      e.preventDefault();
      e.stopPropagation();
      openLoginPrompt("login", e.target.parentElement, target, FBC_IFRAME_HEIGHT_LOGIN);
=======
      if (allowClickSwitch) {
        setTimeout(()=>{
          location.reload(true);
        }, 250);
        return;
      } 
      else {
        e.preventDefault();
        e.stopPropagation();
        openLoginPrompt("login", e.target.parentElement, target, FBC_IFRAME_HEIGHT_LOGIN);    
      }
<<<<<<< HEAD
  
>>>>>>> 9da6a46 (add reload on allow prompt)
      // if (allowClickSwitch) {
      //   // Button disabled. Either will trigger new HTTP request or page will refresh.
      //   setTimeout(()=>{
      //     location.reload(true);
      //   }, 250);
      //   return;
      // } else {
      //   // Click badge, button disabled
      //   e.preventDefault();
      //   // e.stopPropagation();
      //   openLoginPrompt("login", e.target.parentElement, htmlBadgeDiv, target);
      // }
>>>>>>> c07e173 (reposition iframe on resize)
=======
>>>>>>> e1cf345 (remove commented out code)
    });
<<<<<<< HEAD

=======
  } if (socialAction === "email") {
>>>>>>> 3cdab59 (add mobile panel orientation)
    htmlBadgeFragmentFenceDiv.addEventListener("click", (e) => {
      if (!e.isTrusted) {
        // The click was not user generated so ignore
        return false;
      }
      e.preventDefault();
      e.stopPropagation();
<<<<<<< HEAD
<<<<<<< HEAD
      openInputPrompt("email", e.target.parentElement, target, FBC_IFRAME_HEIGHT_EMAIL);
=======
      openLoginPrompt("email", e.target.parentElement, target);
=======
      openLoginPrompt("email", e.target.parentElement, target, FBC_IFRAME_HEIGHT_EMAIL);
<<<<<<< HEAD
>>>>>>> de2a237 (resize iframe height according to content)
      // e.target.parentElement.classList.toggle("active");
      // positionPrompt( htmlBadgeDiv );
      // target.classList.toggle("js-fbc-prompt-active");
      // document.body.classList.toggle("js-fbc-prompt-active");
>>>>>>> c07e173 (reposition iframe on resize)
=======
>>>>>>> e1cf345 (remove commented out code)
    });

  } else if (socialAction === "share-passive") {
    htmlBadgeDiv.classList.add("fbc-badge-share-passive", "fbc-badge-share");

    shareBadgeEventListenerInit(target, htmlBadgeDiv, { allowClickThrough: true });

  } else if (socialAction === "share") {
    htmlBadgeDiv.classList.add("fbc-badge-share");
    shareBadgeEventListenerInit(target, htmlBadgeDiv, { allowClickThrough: true });
  }

  // Applies to both!
  htmlBadgeFragmentFenceDiv.addEventListener("mouseenter", () => {
    positionPrompt(htmlBadgeDiv);
  });

<<<<<<< HEAD
=======


>>>>>>> c07e173 (reposition iframe on resize)
  positionFacebookBadge(target, badgeClassUId, itemWidth, badgeSmallSwitch);


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
    setTimeout(() => {
      positionPrompt(htmlBadgeDiv);
    }, 50);
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

function positionPrompt(activeBadge) {
  const elemRect = activeBadge.getBoundingClientRect();

  if ((window.innerWidth - elemRect.left) < 350) {
    activeBadge.classList.add("fbc-badge-prompt-align-right");
  }

  const modifierClassList = ["fbc-badge-prompt-align-top", "fbc-badge-prompt-align-bottom", "fbc-badge-prompt-align-right"];

  if (elemRect.top < 140) {
    activeBadge.classList.add("fbc-badge-prompt-align-top");
  } else if ((window.innerHeight - elemRect.bottom) < 130) {
    activeBadge.classList.add("fbc-badge-prompt-align-bottom");
  } else if ((window.innerWidth - elemRect.left) < 350) {
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
  if (!isFixed(target) && htmlBadgeDiv.classList.contains("fbc-badge-fixed")) {
    htmlBadgeDiv.classList.remove("fbc-badge-fixed");
  } else if (isFixed(target)) {
    htmlBadgeDiv.classList.add("fbc-badge-fixed");
    return { offsetPosX: elemRect.left, offsetPosY: elemRect.top };
  } else {
    // Removed left body offset calc as it doesn't apply
    // return {offsetPosX: elemRect.left - bodyRect.left, offsetPosY: elemRect.top - bodyRect.top};
    return { offsetPosX: elemRect.left, offsetPosY: elemRect.top + window.scrollY };
  }
}

function isVisible(target) {
  const currentComputedStyle = window.getComputedStyle(target, false);
  const styleTransform = (currentComputedStyle.getPropertyValue("transform") === "matrix(1, 0, 0, 0, 0, 0)");
  const styleHidden = (currentComputedStyle.getPropertyValue("visibility") === "hidden");
  const styleDisplayNone = (currentComputedStyle.getPropertyValue("display") === "none");
  if (styleTransform || styleHidden || styleDisplayNone) return false;
  return true;
}

function checkVisibilityAndApplyClass(target, htmlBadgeDiv) {

  if (target === null) {
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
    if (!isVisible(parentElement)) {
      if (!htmlBadgeDivHasDisabledClass) {
        htmlBadgeDiv.classList.add("fbc-badge-disabled");
      }
      return false;
    } else {
      if (htmlBadgeDivHasDisabledClass) {
        htmlBadgeDiv.classList.remove("fbc-badge-disabled");
      }
      return true;
    }
  }

  const { offsetParent } = target;
  if (offsetParent) {
    if (!isVisible(parentElement)) {
      if (!htmlBadgeDivHasDisabledClass) {
        htmlBadgeDiv.classList.add("fbc-badge-disabled");
      }
      return false;
    } else {
      if (htmlBadgeDivHasDisabledClass) {
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
  } else if (htmlHeight < bodyHeight) {
    return document.querySelector("html").getBoundingClientRect();
  } else {
    return document.body.getBoundingClientRect();
  }
}

function calcZindex(target) {
  // Loop through each parent, getting Zindex (if its a number).
  // As it finds them, it grabs the highest/largest.
  let zIndexLevel = 0;
  for (; target && target !== document; target = target.parentNode) {
    const zindex = document.defaultView.getComputedStyle(target).getPropertyValue("z-index");
    if (!isNaN(zindex)) {
      if (zIndexLevel < zindex) {
        zIndexLevel = zindex;
      }
    }
  }

  // Take highest zindex in parent tree and adds one more.
  zIndexLevel = zIndexLevel + 2;
  return zIndexLevel;
}


function positionFacebookBadge(target, badgeClassUId, targetWidth, smallSwitch) {

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
  const { offsetPosX, offsetPosY } = getOffsetsAndApplyClass(elemRect, bodyRect, target, htmlBadgeDiv);

  const htmlBadgeDivPosX = (offsetPosX + targetWidth) - elementSizeOffsetX;
  const htmlBadgeDivPosY = offsetPosY - elementSizeOffsetY;

  // TODO: Add Zindex Targeting
  const targetZindex = calcZindex(target);


  // Set badge position based on target coordinates/size
  htmlBadgeDiv.style.zIndex = targetZindex;
  htmlBadgeDiv.style.left = htmlBadgeDivPosX + "px";
  htmlBadgeDiv.style.top = htmlBadgeDivPosY + "px";

<<<<<<< HEAD
<<<<<<< HEAD
=======

  // if (document.querySelector(".fbc-wrapper")) {
  //   positionIframe(target);
  // }

  // console.log(target);

  window.addEventListener("resize", () => {  
  if (document.querySelector(".fbc-wrapper")) {
    positionIframe(htmlBadgeDiv);
  }
 }, true);

>>>>>>> c07e173 (reposition iframe on resize)
=======
>>>>>>> c125976 (resize and scroll reposition iframe)
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

function patternDetection(selectionArray, socialActionIntent) {
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

<<<<<<< HEAD

=======
>>>>>>> 3cdab59 (add mobile panel orientation)
async function detectFacebookOnPage() {
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

  const checkboxTicked = localStorage.getItem("checkbox-ticked");

  if (relayAddonPromptDismissed && !relayAddonEnabled && !relayAddonPromptDismissed.hideRelayEmailBadges && trackersDetectedOnCurrentPage && checkboxTicked !== "true") {
    patternDetection(EMAIL_PATTERN_DETECTION_SELECTORS, "email");
    updateSettings();
  }

  escapeKeyListener();
}

// Resize listener. Only fires after window stops resizing.
let resizeId;

window.addEventListener("resize", () => {
  clearTimeout(resizeId);
  resizeId = setTimeout(screenUpdate, 25);
});

// On Scroll, checking for position fixed on elements
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      screenUpdate();
      ticking = false;
    });

    ticking = true;
  }
});

// Fires on screen Resize or Scroll
function screenUpdate() {
  if (checkForTrackers) {
    for (let item of facebookDetectedElementsArr) {
      positionFacebookBadge(item);
    }
  }
}

function escapeKeyListener() {
  document.body.addEventListener("keydown", function (e) {
<<<<<<< HEAD
    if (e.key === "Escape" && document.querySelector(".fbc-wrapper")) {
      closeIframe();
=======
    if (e.key === "Escape" && document.body.classList.contains("js-fbc-prompt-active")) {
      closePrompt();
>>>>>>> 3cdab59 (add mobile panel orientation)
    }
  });
}


window.addEventListener("click", function () {
  if (this.document.querySelector(".fbc-wrapper")) {
    // stopPropagation();
    closeIframe();
  }
});

<<<<<<< HEAD
// window.addEventListener("message", (e) => {
//   if (
//     e.data === "closeTheInjectedIframe" 
//   ) {
//     closeIframe();
//   }
// });
=======
window.addEventListener("message", (e) => {
  if (e.data === "closeTheInjectedIframe") {
    closeIframe();
  }
});
>>>>>>> d5ca6b2 (localize emails trings)

function closeIframe() {
  const hasFbcWrapper = document.querySelector(".fbc-wrapper");
  hasFbcWrapper.remove();
}


window.addEventListener("click", function (e) {
  if (document.body.classList.contains("js-fbc-prompt-active")) {
    const activePrompt = findActivePrompt();
    const activePromptTarget = document.querySelector(".fbc-has-badge.js-fbc-prompt-active");
    if (!activePrompt.contains(e.target) && !activePromptTarget.contains(e.target)) {
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
  if (message["msg"] == "allowed-facebook-subresources" || message["msg"] == "facebook-domain") {
    // Flags function to not add badges to page
    checkForTrackers = false;
  } else {
    setTimeout(() => {
      contentScriptInit(true, message["msg"]);
    }, 10);
  }

  return Promise.resolve({ response: "content_script onMessage listener" });
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
  window.addEventListener("load", function () {
    CheckIfURLShouldBeBlocked();
  }, false);
}

addPassiveWindowOnloadListener();

function contentScriptSetTimeout() {
  // console.timeEnd('contentScriptSetTimeout');
  // console.timeStart('contentScriptSetTimeout');
  contentScriptDelay = Math.ceil(contentScriptDelay * 2);
  contentScriptInit(false);
  if (contentScriptDelay > 999999) {
    return false;
  }
  setTimeout(contentScriptSetTimeout, contentScriptDelay);
}
