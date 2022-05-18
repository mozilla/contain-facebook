
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