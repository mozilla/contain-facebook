/* global browser */

// TODO 
// Send message to background.js the first time that onboarding "Done" button is clicked and onboarding has been completed.

// removes elements (if there are any) from the panel;
const clearPanel = (wrapper) => {
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
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


const addLearnHowFBCWorksButton = (fragment) => {
  const button = document.createElement("button");
  button.classList.add("highlight-on-hover", "open-onboarding");

  let contentWrapper = addDiv(fragment, "fw-bottom-btn");
  contentWrapper.appendChild(button);
  contentWrapper = button;

  // add span#how-fbc-works and arrow icon
  const span = document.createElement("span");
  span["id"] = "how-fbc-works";
  setClassAndAppend(contentWrapper, span);
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
  const page = document.body;
  clearPanel(page);

  const fragment = document.createDocumentFragment();

  addHeader(fragment);

  const contentWrapper = addDiv(fragment, "main-content-wrapper");

  addSubhead(contentWrapper, panelId);

  addParagraph(contentWrapper, `${panelId}-p1`);

  if (panelId === "trackers-detected") {
    const imgDiv = addDiv(contentWrapper, panelId);
    imgDiv.classList.add("img");
    addParagraph(contentWrapper, `${panelId}-p2`);
  }

  if (panelId !== "on-facebook") {
    addLearnMoreLink(contentWrapper);
  }

  addLearnHowFBCWorksButton(fragment);
  getLocalizedStrings();
  page.appendChild(fragment);

  const onboardingLinks = document.querySelectorAll(".open-onboarding");

  onboardingLinks.forEach(link => {
    link.addEventListener("click", () => buildOnboardingPanel(1));
  });
};


const buildOnboardingPanel = (panelId) => {
  const page = document.body;
  clearPanel(page);

  const fragment = document.createDocumentFragment();
  const stringId = `onboarding${panelId}`;

  let el = addHeader(fragment);

  el = document.createElement("button");
  el.classList.add("btn-return", "arrow-left");

  fragment.appendChild(el);

  const contentWrapper = addDiv(fragment, "main-content-wrapper");

  const h2 = addSubhead(contentWrapper, stringId);

  addParagraph(contentWrapper, `${stringId}-p1`);


  if (panelId === 1) {
    setNavButtons(fragment, "btn-cancel", "btn-next", stringId);
  }

  if (panelId === 2) {
    el = addGreyFacebookAndFence();
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
  page.appendChild(fragment);
  addOnboardingListeners(panelId);
};
