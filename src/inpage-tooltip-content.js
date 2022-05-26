const url = window.location.href;
// const action = url.split('?')[1].split('=')[1];

const action = parseQuery(url).action;

const loginItem = document.getElementById("fbc-login");
const emailItem = document.getElementById("fbc-email");

function parseQuery(queryString) {
    var query = {};

    var pairs = queryString.split('?')[1].split('&');
    for (var i = 0; i < pairs.length; i++) {
        var splt = pairs[i].split('=');
        query[splt[0]] = splt[1]
    }
    return query;
}

const tooltipString = document.querySelector(".fbc-badge-tooltip");

if (action === "login") {
    tooltipString.innerHTML = browser.i18n.getMessage("inPageUI-tooltip-button-login");
}

if (action === "share") {
    tooltipString.innerHTML = browser.i18n.getMessage("inPageUI-tooltip-button-share");
}

if (action === "share-passive") {
    tooltipString.innerHTML = browser.i18n.getMessage("inPageUI-tooltip-button-share-passive");
}

if (action === "email") {
    tooltipString.innerHTML = browser.i18n.getMessage("inPageUI-tooltip-button-email");
}

