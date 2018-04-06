const MAC_ADDON_ID = "@testpilot-containers";
let webExtension, background;
const helper = {
  async loadWebExtension(options = {}) {
    webExtension = await loadWebExtension({
      async beforeParse(window) {
        window.browser.management.get.resolves({
          enabled: options.macEnabled
        });

        if (options.macAssigned) {
          window.browser.runtime.sendMessage.resolves({
            userContextId: "1",
            neverAsk: false
          });
        }

        if (options.beforeParse) {
          await options.beforeParse(window);
        }
      }
    });
    background = webExtension.background;
    return webExtension;
  }
};

describe("Multi-Account Containers", () => {
  describe("Incoming requests to URLs that are MAC assigned", () => {
    beforeEach(async () => {
      await helper.loadWebExtension({
        macEnabled: true,
        macAssigned: true
      });
      return background.browser.tabs._create({
        url: "https://www.facebook.com"
      });
    });

    it("should not trigger containment", () => {
      expect(background.browser.tabs.create).to.not.have.been.called;
    });
  });

  describe("Incoming requests but not yet installed", () => {
    beforeEach(async () => {
      await helper.loadWebExtension({
        macEnabled: false
      });
      return background.browser.tabs._create({
        url: "https://www.facebook.com"
      });
    });

    it("should not ask for assignment", async () => {
      expect(background.browser.runtime.sendMessage).to.not.have.been.called;
    });

    describe("onInstalled", () => {
      beforeEach(() => {
        background.browser.management.onInstalled.addListener.yield({
          id: MAC_ADDON_ID
        });
        return background.browser.tabs._create({
          url: "https://www.facebook.com"
        });
      });

      it("should ask for assignment", async () => {
        expect(background.browser.runtime.sendMessage).to.have.been.called;
      });
    });
  });

  describe("Already installed MAC gets uninstalled", () => {
    beforeEach(async () => {
      await helper.loadWebExtension({
        macEnabled: true
      });
      background.browser.management.onUninstalled.addListener.yield({
        id: MAC_ADDON_ID
      });
      return background.browser.tabs._create({
        url: "https://www.facebook.com"
      });
    });

    it("should not ask for assignment anymore", async () => {
      expect(background.browser.runtime.sendMessage).to.not.have.been.called;
    });
  });

  describe("Already installed but disabled MAC gets enabled", () => {
    beforeEach(async () => {
      await helper.loadWebExtension({
        macEnabled: true
      });
      background.browser.management.onEnabled.addListener.yield({
        id: MAC_ADDON_ID
      });
      return background.browser.tabs._create({
        url: "https://www.facebook.com"
      });
    });

    it("should ask for assignment", async () => {
      expect(background.browser.runtime.sendMessage).to.have.been.called;
    });
  });

  describe("Already installed and enabled MAC gets disabled", () => {
    beforeEach(async () => {
      await helper.loadWebExtension({
        macEnabled: true
      });
      background.browser.management.onDisabled.addListener.yield({
        id: MAC_ADDON_ID
      });
      return background.browser.tabs._create({
        url: "https://www.facebook.com"
      });
    });

    it("should not ask for assignment anymore", async () => {
      expect(background.browser.runtime.sendMessage).to.not.have.been.called;
    });
  });

  describe("Add-on initializes with already open Tabs that are MAC assigned", () => {
    let facebookContainer;

    beforeEach(async () => {
      webExtension = await helper.loadWebExtension({
        macEnabled: true,
        macAssigned: true,
        async beforeParse(window) {
          facebookContainer = await window.browser.contextualIdentities._create({
            name: "Facebook"
          });
          await window.browser.tabs._create({
            url: "https://www.facebook.com"
          });
          await window.browser.tabs._create({
            url: "https://example.com",
            cookieStoreId: facebookContainer.cookieStoreId
          });
        }
      });
      background = webExtension.background;
    });

    it("should not reopen already open tabs", () => {
      expect(background.browser.tabs.create).to.not.have.been.called;
    });
  });
});