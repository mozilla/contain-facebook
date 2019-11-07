const path = require("path");
const expect = require("chai").expect;
const webExtensionsGeckoDriver = require("webextensions-geckodriver");
const {webdriver, firefox} = webExtensionsGeckoDriver;
const {until, By} = webdriver;
const fs = require("fs-extra");
const rootPath = path.join(__dirname, "..", "..");
const srcPath = path.join(rootPath, "src");
const buildPath = path.join(rootPath, "build");
const manifestPath = path.resolve(buildPath, "manifest.json");

global.buildPath = buildPath;
global.expect = expect;
global.until = until;
global.By = By;

global.before(async () => {
  await fs.copy(srcPath, buildPath);
  await fs.copy(path.join(__dirname, "fixtures"), path.join(buildPath, "fixtures"));
  const webExtension = await webExtensionsGeckoDriver(manifestPath);
  const {geckodriver} = webExtension;

  global.geckodriver = geckodriver;
  global.internalUUID = await webExtension.internalUUID();

  geckodriver.setContext(firefox.Context.CONTENT);

  // give the extension a chance to fully initialize
  await new Promise(r => setTimeout(r, 1500));
});

after(() => {
  if (process.env.NODE_ENV !== "development") {
    geckodriver.quit();
  }
});