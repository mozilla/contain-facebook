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
  let el = document.createElement("H1");
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
  let el = document.createElement("H2");
  el["id"] = elemId;
  setClassAndAppend(wrapper, el);
  el.classList.add(elemId);
  return el;
};


// adds a block of text to wrapper
const addParagraph = (wrapper, stringId) => {
  let el = document.createElement("P");
  el["id"] = stringId;
  setClassAndAppend(wrapper, el);
};


// create and append div to panel wrapper
const addDiv = (wrapper, className) => {
  let el = document.createElement("DIV");
  el.classList.add(className);
  wrapper.appendChild(el);
  return el;
};


// creates grey Facebook text. Grey fence icon is set in CSS.
const addGreyFacebookAndFence = () => {
  // create grey facebook text with grey fence
  let el = document.createElement("p");
  el.classList.add("Facebook-text");
  el.innerText = "Facebook";
  return el;
};


// adds bottom navigation buttons to onboarding panels
const setNavButtons = (wrapper, button1Id, button2Id, panelId) => {
  let buttonWrapper = addDiv(wrapper, "bottom-btns");
  buttonWrapper.classList.add(panelId);

  [button1Id, button2Id].forEach(id => {
    let button = document.createElement("BUTTON");
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

  let span = document.createElement("SPAN");
  span.textContent = textChunks[0];
  el.appendChild(span);

  let nestedBoldText = textChunks[1];
  nestedBoldText = nestedBoldText.replace("*SPANEND", "");

  span = document.createElement("SPAN");
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
    let text = browser.i18n.getMessage(el.id, currentActiveURL.hostname);
    if (text.includes("*SPAN")) {
      // text = formatText(text, el);
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
  console.log(`building ${panelId} panel...`);

  let pageWrapper = document.body;
  clearPanel(pageWrapper);

  //add header
  addHeader(pageWrapper);

  // add div.main-content-wrapper to wrap panel content
  let contentWrapper = addDiv(pageWrapper, "main-content-wrapper");

  // add subhead
  addSubhead(contentWrapper, panelId);

  // build first pargraph
  addParagraph(contentWrapper, `${panelId}-p1`);

  // add div.img if panelId === "trackers-detected"
  if (panelId === "trackers-detected") {
    let imgDiv = addDiv(contentWrapper, panelId);
    imgDiv.classList.add("img");
    addParagraph(contentWrapper, `${panelId}-p2`);
  }

  if (panelId !== "on-facebook") {
    let link = document.createElement("A");
    link["id"] = "learn-more";
    link.classList.add("open-sumo");
    link["href"] = "https://support.mozilla.org"; // need Facebook Container SUMO url. // need UTM params? // open in new or same window?
    setClassAndAppend(contentWrapper, link);
    link.addEventListener("click", () => window.close());
  }

  // add div.fw-bottom-btn (full-width button at the bottom of the panels).
  contentWrapper = addDiv(pageWrapper, "fw-bottom-btn");

  let button = document.createElement("BUTTON");
  button.classList.add("highlight-on-hover", "open-onboarding");
  contentWrapper.appendChild(button);

  contentWrapper = button;

  // add span#how-fbc-works and arrow icon
  let span = document.createElement("SPAN");
  span["id"] = "how-fbc-works";
  setClassAndAppend(contentWrapper, span);

  getLocalizedStrings();

  // add listeners to any link element (.open-onboarding) that should open the onboarding flow on click;
  const onboardingLinks = document.querySelectorAll(".open-onboarding");
  onboardingLinks.forEach(link => {
    link.addEventListener("click", () => buildOnboardingPanel(1));
  });
};


const buildOnboardingPanel = (panelId) => {
  console.log(`building onboarding panel no. ${panelId} `);
  let page = document.body;
  // let pageWrapper = document.body;
  let pageWrapper = document.createDocumentFragment();

  let stringId = `onboarding${panelId}`;

  // clear out existing panel elements (if there are any)
  clearPanel(page);

  let el = addHeader(pageWrapper);

  el = document.createElement("BUTTON");
  el.classList.add("btn-return", "arrow-left");
  pageWrapper.appendChild(el);

  // add div.main-content-wrapper to wrap text and image elements
  const contentWrapper = addDiv(pageWrapper, "main-content-wrapper");

  // create subhead, save in h2 for use later
  const h2 = addSubhead(contentWrapper, stringId);

  // create first paragraph
  addParagraph(contentWrapper, `${stringId}-p1`);


  if (panelId === 1) {
    setNavButtons(pageWrapper, "btn-cancel", "btn-next", stringId);
  }

  if (panelId === 2) {
    // create grey facebook text with grey fence
    el = addGreyFacebookAndFence();
    h2.parentNode.insertBefore(el, h2.nextSibling);
    setNavButtons(pageWrapper, "btn-back", "btn-next", stringId);
  }

  if (panelId === 3) {
    let imgDiv = addDiv(contentWrapper, stringId);
    imgDiv.classList.add("img");
    setNavButtons(pageWrapper, "btn-back", "btn-done", stringId);
  }

  // add second paragraph to all panels
  addParagraph(contentWrapper, `${stringId}-p2`);

  // get localized strings
  getLocalizedStrings();

  page.appendChild(pageWrapper);
  addOnboardingListeners(panelId);
};

document.addEventListener("click", (e) => console.log(e));
