
const url = window.location.href;
const action = url.split('?')[1].split('=')[1];

const loginItem = document.getElementById("fbc-login");
const emailItem = document.getElementById("fbc-email");


if (action === "login") {
    loginItem.classList.remove("is-hidden");
}

if (action === "email") {
    emailItem.classList.remove("is-hidden");
}

const fbcTitle = document.querySelector(".fbc-title");
fbcTitle.innerHTML = browser.i18n.getMessage("facebookContainer");

const fbcPromptSubtitleLogin = document.querySelector(".fbc-subtitle-login");
fbcPromptSubtitleLogin.innerHTML = browser.i18n.getMessage("inPageUI-tooltip-prompt-p1");

const fbcPromptBodyTextLogin = document.querySelector(".fbc-bodytext-login");
fbcPromptBodyTextLogin.innerHTML = browser.i18n.getMessage("inPageUI-tooltip-prompt-p2");

const fbcPromptSubtitleEmail =  browser.i18n.getMessage("inPageUI-tooltip-email-prompt-p1");
const fbcPromptBodyTextEmail = browser.i18n.getMessage("inPageUI-tooltip-email-prompt-p2");

const fbcPromptAllow = document.querySelector(".fbc-badge-prompt-btn-allow");
const fbcPromptCancel = document.querySelector(".fbc-badge-prompt-btn-cancel");

fbcPromptAllow.innerHTML = browser.i18n.getMessage("btn-allow");
fbcPromptCancel.innerHTML = browser.i18n.getMessage("btn-cancel");

fbcPromptCancel.addEventListener("click", function() {
    parent.postMessage("closeTheInjectedIframe", "*")
});

console.log(window.parent);