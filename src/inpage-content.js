
const url = window.location.href;

const action = parseQuery(url).action;

const loginItem = document.getElementById("fbc-login");
const emailItem = document.getElementById("fbc-email");

function parseQuery(queryString) {
  var query = {};

  var pairs = queryString.split("?")[1].split("&");
  for (var i = 0; i < pairs.length; i++) {
    var splt = pairs[i].split("=");
    query[splt[0]] = splt[1];
  }
  return query;
}

if (action === "login") {
  loginItem.classList.remove("is-hidden");
}

if (action === "email") {
  emailItem.classList.remove("is-hidden");
}

// Header String
const fbcTitle = document.querySelector(".fbc-title");
fbcTitle.textContent = browser.i18n.getMessage("facebookContainer");

// Login Strings
const fbcPromptSubtitleLogin = document.querySelector(".fbc-subtitle-login");
fbcPromptSubtitleLogin.textContent = browser.i18n.getMessage("inPageUI-tooltip-prompt-p1");

const fbcPromptBodyTextLogin = document.querySelector(".fbc-bodytext-login");
fbcPromptBodyTextLogin.textContent = browser.i18n.getMessage("inPageUI-tooltip-prompt-p2");

const fbcPromptAllow = document.querySelector(".fbc-badge-prompt-btn-allow");
const fbcPromptCancel = document.querySelector(".fbc-badge-prompt-btn-cancel");

fbcPromptAllow.textContent = browser.i18n.getMessage("btn-allow");
fbcPromptCancel.textContent = browser.i18n.getMessage("btn-cancel");

fbcPromptAllow.addEventListener("click", (e) => {
  if (!e.isTrusted) {
    // The click was not user generated so ignore
    e.preventDefault();
    return false;
  } 
  // allowClickSwitch = true; 
  browser.runtime.sendMessage({
    message: "add-domain-to-list"
  });

  // Launch facebook authentication
  parent.postMessage("allowTriggered", "*");

});

// Email Strings
const fbcEmailSubtitleLogin = document.querySelector(".fbc-subtitle-email");
fbcEmailSubtitleLogin.textContent = browser.i18n.getMessage("inPageUI-tooltip-email-prompt-p1");

const fbcEmailBodyTextLogin = document.querySelector(".fbc-bodytext-email");
fbcEmailBodyTextLogin.textContent = browser.i18n.getMessage("inPageUI-tooltip-email-prompt-p2");

const fbcEmailCheckbox = document.querySelector(".fbc-email-checkbox");
fbcEmailCheckbox.textContent = browser.i18n.getMessage("inPageUI-tooltip-prompt-checkbox");

const fbcEmailAllow = document.querySelector(".fbc-badge-email-btn-cta-fx-relay");
const fbcEmailCancel = document.querySelector(".fbc-badge-email-btn-dismiss");

fbcEmailAllow.textContent = browser.i18n.getMessage("btn-relay-try");
fbcEmailCancel.textContent = browser.i18n.getMessage("btn-relay-dismiss");

// Checkbox
const fbcCheckboxes = document.querySelectorAll(".settings-checkbox");

fbcCheckboxes.forEach(e => {
  e.addEventListener("change", () => {
    parent.postMessage("checkboxTicked", "*");
  });
});

// Launch Relay when Try Relay is clicked
fbcEmailAllow.addEventListener("click", (e) => {
  if (!e.isTrusted) {
    // The click was not user generated so ignore
    return false;
  } 
  window.open("https://relay.firefox.com/?utm_source=firefox&utm_medium=addon&utm_campaign=Facebook%20Container&utm_content=Try%20Firefox%20Relay");
});

// // Remove popup when cancel/dismiss is clicked
[fbcPromptCancel, fbcEmailCancel].forEach(e => {
  e.addEventListener("click", () => {
    parent.postMessage("closeTheInjectedIframe", "*");
  });
});





