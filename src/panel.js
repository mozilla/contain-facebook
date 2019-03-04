var firstPanel = document.getElementById("#panel-1");
var secondPanel = document.getElementById("#panel-2");



function panel1(){
    secondPanel.display= "none";
}

function panel2() {
    secondPanel.show;
}

function showPanel() {
    browser.browserAction.onClicked(
        secondPanel
    )
}