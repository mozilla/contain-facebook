import { createRequire } from "module";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sinon from "sinon";
import { use, expect as chaiExpect } from "chai";
import sinonChai from "sinon-chai";
import { createBrowserMock } from "./setup/browser-mock.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

use(sinonChai);
global.sinon = sinon;
global.expect = chaiExpect;

const pslSrc = readFileSync(join(__dirname, "../src/psl.min.js"), "utf8");
const backgroundSrc = readFileSync(join(__dirname, "../src/background.js"), "utf8");

global.loadWebExtension = async (options = {}) => {
  const mock = createBrowserMock(sinon);

  global.browser = mock.browser;

  // psl sets a global `psl` variable — run it in this scope
  // eslint-disable-next-line no-eval
  (0, eval)(pslSrc);
  global.psl = psl; // eslint-disable-line no-undef

  // Always seed one tab so getActiveTab() in init doesn't get undefined
  await mock.browser.tabs._create({ url: "about:blank" });

  if (options.beforeParse) {
    await options.beforeParse({ browser: mock.browser });
  }

  // Run background.js — it uses the global `browser` and `psl`
  // eslint-disable-next-line no-eval
  (0, eval)(backgroundSrc);

  // Let the async init IIFE settle
  await new Promise(r => setTimeout(r, 0));

  mock.background = { browser: mock.browser };

  if (mock.browser.contextualIdentities.create.firstCall) {
    mock.facebookContainer = await mock.browser.contextualIdentities.create.firstCall.returnValue;
  }

  mock.browser.runtime.sendMessage.resetHistory();

  global.webExtension = mock;
  return mock;
};

afterEach(async () => {
  if (global.webExtension) {
    global.webExtension.destroy();
    global.webExtension = null;
  }
  delete global.browser;
  delete global.psl;
});
