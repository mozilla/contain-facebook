/* global browser */

// TODO 
// Send message to background.js the first time that onboarding "Done" button is clicked and onboarding has been completed.

// removes elements (if there are any) from the panel;
const clearPanel = (wrapper) => {
  const wrapperHeight = wrapper.clientHeight;
  wrapper.style.minHeight = wrapperHeight;

  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
};


const setUpPanel = (panelId) => {
  const page = document.body;
  clearPanel(page);

  const fragment = document.createDocumentFragment();
  fragment["id"] = panelId;

  return { page, fragment };
};


// adds "Facebook Container" to top of all panels
const addHeader = (wrapper) => {
  const el = document.createElement("h1");
  el["id"] = "facebookContainer";
  setClassAndAppend(wrapper, el);
  return el;
};


// adds "uiMessage" class to element and appends.
const setClassAndAppend = (wrapper, el) => {
  el.classList.add("uiMessage");
  wrapper.appendChild(el);
};


// add "uiMessage" class to element and appends.
const addSubhead = (wrapper, panelId) => {
  const elemId = `${panelId}-subhead`;
  const el = document.createElement("h2");
  el["id"] = elemId;
  setClassAndAppend(wrapper, el);
  el.classList.add(elemId);
  return el;
};


// makes lighter weight sub-heads for sites allowed and sites included lists
const addLightSubhead = (wrapper, stringId) => {
  const el = document.createElement("h3");
  el["id"] = stringId;
  setClassAndAppend(wrapper, el);
  return el;
};


// adds a block of text to wrapper
const addParagraph = (wrapper, stringId) => {
  const el = document.createElement("p");
  el["id"] = stringId;
  setClassAndAppend(wrapper, el);
};


// create and append div to panel wrapper
const addDiv = (wrapper, className) => {
  const el = document.createElement("div");
  el.classList.add(className);
  wrapper.appendChild(el);
  return el;
};


// creates grey Facebook text. Grey fence icon is set in CSS.
const addGreyFacebookAndFence = () => {
  // create grey facebook text with grey fence
  const el = document.createElement("p");
  el.classList.add("Facebook-text");
  el.innerText = "Facebook";
  return el;
};

const addFullWidthButton = (fragment, listenerClass) => {
  const button = document.createElement("button");
  button.classList.add("highlight-on-hover", listenerClass);

  let contentWrapper = addDiv(fragment, "fw-bottom-btn");
  contentWrapper.appendChild(button);
  return button;
};


const addSpan = (wrapper, stringId) => {
  const span = document.createElement("span");
  span["id"] = stringId;
  setClassAndAppend(wrapper, span);
};


const addLearnHowFBCWorksButton = async (fragment) => {
  let button = addFullWidthButton (fragment, "open-onboarding");
  addSpan(button, "how-fbc-works");

  button = addFullWidthButton(fragment, "open-allowed-sites");
  addSpan(button, "sites-added-subhead");
};


// adds bottom navigation buttons to onboarding panels
const setNavButtons = (wrapper, button1Id, button2Id, panelId) => {
  const buttonWrapper = addDiv(wrapper, "bottom-btns");
  buttonWrapper.classList.add(panelId);

  [button1Id, button2Id].forEach(id => {
    const button = document.createElement("button");
    button.classList.add("uiMessage", "bottom-btn");
    button["id"] = id;
    buttonWrapper.appendChild(button);
  });
};


// attaches click listeners to all ".open-onboarding" elements.
const addOnboardingListeners = (res) => {
  document.querySelectorAll(".bottom-btn, .btn-return").forEach(btn => {
    btn.addEventListener("click", (e) => {
      handleOnboardingClicks(e, res);
    });
  });
};


// attaches click listeners to all ".site-added" elements.
const addDeleteSiteListeners = () => {
  document.querySelectorAll(".site-added").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      // TODO: refactor to remove the domain straight from browser.storage.local?
      await browser.runtime.sendMessage({removeDomain: e.dataset.domain});
    });
  });
};

const addLearnMoreLink = (fragment) => {
  const link = document.createElement("a");
  link["id"] = "learn-more";
  link.classList.add("open-sumo");
  link["rel"] = "noopener noreferrer";
  link["href"] = "https://support.mozilla.org/kb/facebook-container-prevent-facebook-tracking"; // need Facebook Container SUMO url. // need UTM params? // open in new or same window?
  setClassAndAppend(fragment, link);
  link.addEventListener("click", () => window.close());
};


// onboarding panel navigation
const handleOnboardingClicks = async(e, res) => {
  const el = e.target;
  const buttonId = el.id;

  if (buttonId === "btn-cancel") {
    window.close();
  }

  if (buttonId === "btn-done") {
    // send message to background.js that onboarding has been completed.
    window.close();
  }

  if (buttonId === "btn-next") {
    buildOnboardingPanel(res + 1);
  }

  if (buttonId === "btn-back") {
    buildOnboardingPanel(res - 1);
  }

  // go back to origin panel
  if (el.classList.contains("btn-return")) {
    let currentPanel = await browser.storage.local.get("CURRENT_PANEL");
    currentPanel = currentPanel["CURRENT_PANEL"];
    buildPanel(currentPanel);
  }
};


const appendFragmentAndSetHeight = (page, fragment) => {
  page.appendChild(fragment);
  page.style.minHeight = 0;
};


// Breaks strings with nested bold words out into separate spans
// and appends these to the wrapping paragraph element so that we
// don't have to use .innerHTML.

// Bold text must extend to the end of the string.
const formatText = (text, el) => {
  const textChunks = text.split("*SPANSTART");

  let span = document.createElement("span");
  span.textContent = textChunks[0];
  el.appendChild(span);

  let nestedBoldText = textChunks[1];
  nestedBoldText = nestedBoldText.replace("*SPANEND", "");

  span = document.createElement("span");
  span.textContent = nestedBoldText;
  span.classList.add("bold");
  el.appendChild(span);
};


const getLocalizedStrings = async() => {
  const {PANEL_SHOWN} = await browser.storage.local.get("PANEL_SHOWN");
  if (document.querySelector(".panel") !== null && !PANEL_SHOWN) {
    await browser.storage.local.set({PANEL_SHOWN: true});
    const tabs = await browser.tabs.query({});
    tabs.map(tab => {
      browser.browserAction.setBadgeText({tabId: tab.id, text: ""});
    });
  }

  const tabsQueryResult = await browser.tabs.query({currentWindow: true, active: true});
  const currentActiveTab = tabsQueryResult[0];
  const currentActiveURL = new URL(currentActiveTab.url);

  const uiMessages = document.querySelectorAll(".uiMessage");

  for (const el of uiMessages) {
    if (el.id.endsWith("Header") && currentActiveURL.hostname == "") {
      el.textContent = browser.i18n.getMessage("onUnknownSiteHeader");
      continue;
    }
    const text = browser.i18n.getMessage(el.id, currentActiveURL.hostname);
    if (text.includes("*SPAN")) {
      formatText(text, el);
    } else {
      el.textContent = text;
    }
  }
};


document.addEventListener("DOMContentLoaded", async () => {
  const storage = await browser.storage.local.get();
  const currentPanel = storage.CURRENT_PANEL;

  const onboarding = (currentPanel.includes("onboarding"));
  if (!onboarding) {
    return buildPanel(currentPanel);
  }
  buildOnboardingPanel(1);
});


// Build non-onboarding panel
const buildPanel = (panelId) => {
  const { page, fragment } = setUpPanel(panelId);

  addHeader(fragment);

  const contentWrapper = addDiv(fragment, "main-content-wrapper");
  addSubhead(contentWrapper, panelId);
  addParagraph(contentWrapper, `${panelId}-p1`);

  if (panelId === "trackers-detected") {
    const imgDiv = addDiv(contentWrapper, panelId);
    imgDiv.classList.add("img");
    addParagraph(contentWrapper, `${panelId}-p2`);
  }

  addLearnMoreLink(contentWrapper);

  if (panelId === "on-facebook") {
    const onFacebookImgDiv = addDiv(contentWrapper, "on-facebook-img");
    onFacebookImgDiv.classList.add("img");
  }

  addLearnHowFBCWorksButton(fragment);
  getLocalizedStrings();
  appendFragmentAndSetHeight(page, fragment);

  const onboardingLinks = document.querySelectorAll(".open-onboarding");
  const allowedSitesLink = document.querySelector(".open-allowed-sites");
  allowedSitesLink.addEventListener("click", () => buildAllowedSitesPanel("sites-allowed"));

  onboardingLinks.forEach(link => {
    link.addEventListener("click", () => buildOnboardingPanel(1));
  });
};


const buildOnboardingPanel = (panelId) => {
  const stringId = `onboarding${panelId}`;
  const { page, fragment } = setUpPanel(stringId);
  
  addHeaderWithBackArrow(fragment);

  const contentWrapper = addDiv(fragment, "main-content-wrapper");
  const h2 = addSubhead(contentWrapper, stringId);
  addParagraph(contentWrapper, `${stringId}-p1`);

  if (panelId === 1) {
    setNavButtons(fragment, "btn-cancel", "btn-next", stringId);
  }

  if (panelId === 2) {
    let el = addGreyFacebookAndFence();
    h2.parentNode.insertBefore(el, h2.nextSibling);
    setNavButtons(fragment, "btn-back", "btn-next", stringId);
  }

  if (panelId === 3) {
    const imgDiv = addDiv(contentWrapper, stringId);
    imgDiv.classList.add("img");
    setNavButtons(fragment, "btn-back", "btn-done", stringId);
  }

  addParagraph(contentWrapper, `${stringId}-p2`);

  getLocalizedStrings();

  appendFragmentAndSetHeight(page, fragment);
  addOnboardingListeners(panelId);
  addDeleteSiteListeners();
};


const addHeaderWithBackArrow = (fragment) => {
  let el = addHeader(fragment);
  el = document.createElement("button");
  el.classList.add("btn-return", "arrow-left");
  fragment.appendChild(el);
  return fragment;
};


const defaultAllowedSites = [
  "instagram.com",
  "facebook.com",
  "messenger.com",
];


const makeSiteList = async(fragment, siteList, sitesAllowed=false, addX=false) => {

  // if no sites have been added to the container, show "None"
  if (siteList.length === 0) {
    const allowedSiteWrapper = addDiv(fragment, "allowed-site-wrapper");
    addSpan(allowedSiteWrapper, "no-sites-added");
    return; 
  }

  for (const site of siteList) {
    const allowedSiteWrapper = addDiv(fragment, "allowed-site-wrapper");
    if (!addX) {
      allowedSiteWrapper.classList.add("default-allowed-site");
    }

    let iconDiv = addDiv(allowedSiteWrapper, "allowed-site-icon");
    if (sitesAllowed) {
      // should we repeatedly grab these images or download and save them?
      // need a different place to scoop them up, wondering where activity stream gets their favicons?
      iconDiv.style.backgroundImage = `url(https://${site}/favicon.ico`;
    }
    if (!sitesAllowed) {
      const domainClass = site.replace(".com", "");
      iconDiv.classList.add(`favi-${domainClass}`);
    }
    const siteSpan = document.createElement("span");
    siteSpan.classList.add("site-name");
    siteSpan.textContent = site;
    if (addX) {
      const button = document.createElement("button");
      button.dataset["sitename"] = site;
      button.classList.add("remove-site");
      allowedSiteWrapper.appendChild(button);
      // add aria labeling for button;
    }
    allowedSiteWrapper.appendChild(siteSpan);
  }
};


const buildAllowedSitesPanel = async(panelId) => {
  const { page, fragment } = setUpPanel(panelId);

  addHeaderWithBackArrow(fragment);

  const contentWrapper = addDiv(fragment, "main-content-wrapper");

  addSubhead(contentWrapper, "sites-added");
  addParagraph(contentWrapper, "sites-added-p1");

  const listsWrapper = addDiv(fragment, "site-lists-wrapper");
  addLightSubhead(listsWrapper, "sites-included");
  makeSiteList(listsWrapper, defaultAllowedSites);

  const siteList = await browser.runtime.sendMessage("what-sites-are-added");
  const sitesAllowedSubhead = addLightSubhead(listsWrapper, "sites-allowed");
  sitesAllowedSubhead.classList.add("sites-allowed");
  makeSiteList(listsWrapper, siteList, true, true); // (...sitesAllowed=true, addX=true)

  appendFragmentAndSetHeight(page, fragment);
  page.classList.add("remove-site-list");

  const removeSiteButtons = document.querySelectorAll(".remove-site");
  removeSiteButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const removeButton = e.target;
      buildRemoveSitePanel(removeButton.dataset.sitename);
    });
  });

  addOnboardingListeners(panelId);
  getLocalizedStrings();
};


const buildRemoveSitePanel = (siteName) => {
  const panelId = "remove-site";
  const { page, fragment } = setUpPanel(panelId);

  addHeaderWithBackArrow(fragment);

  const contentWrapper = addDiv(fragment, "main-content-wrapper");
  contentWrapper.classList.add("remove-site-panel");

  addSubhead(contentWrapper, "remove-site");
  makeSiteList(contentWrapper, [siteName], true, false); // (..., sitesAllowed=true, addX=false )
  addParagraph(contentWrapper, `${panelId}-p1`);
  addParagraph(contentWrapper, `${panelId}-p2`);
  let blueRemoveButton = document.createElement("button");
  blueRemoveButton.classList.add("uiMessage", "remove-btn");
  blueRemoveButton.id = "remove";
  blueRemoveButton.addEventListener("click", async() => {
    await browser.runtime.sendMessage( {removeDomain: siteName} );
  });
  fragment.appendChild(blueRemoveButton);

  getLocalizedStrings();

  appendFragmentAndSetHeight(page, fragment);
  addOnboardingListeners(siteName);
};
