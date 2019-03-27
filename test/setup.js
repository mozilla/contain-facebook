if (!process.listenerCount("unhandledRejection")) {
  // eslint-disable-next-line no-console
  process.on("unhandledRejection", r => console.log(r));
}

const path = require("path");
const sinonChai = require("sinon-chai");
const chai = require("chai");
global.sinon = require("sinon");
global.expect = chai.expect;
chai.use(sinonChai);

const webExtensionsJSDOM = require("webextensions-jsdom");
const manifestPath = path.resolve(path.join(__dirname, "../src/manifest.json"));

global.loadWebExtension = async (options = {}) => {
  const webExtension = await webExtensionsJSDOM.fromManifest(manifestPath, {
    apiFake: true,
    sinon: global.sinon,
    background: {
      jsdom: {
        beforeParse: window => {
          window.browser.tabs._create({});
          if (options.beforeParse) {
            options.beforeParse(window);
          }
        }
      }
    }
  });
  webExtension.background.browser.runtime.sendMessage.resetHistory();
  if (webExtension.background.browser.contextualIdentities.create.firstCall) {
    webExtension.facebookContainer =
      await webExtension.background.browser.contextualIdentities.create.firstCall.returnValue;
  }
  global.webExtension = webExtension;
  return webExtension;
};

global.afterEach(async () => {
  if (global.webExtension) {
    await global.webExtension.destroy();
  }
});