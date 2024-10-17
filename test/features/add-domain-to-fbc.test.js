describe("Add domain to Facebook Container", () => {
  let webExtension, background;

  beforeEach(async () => {
    webExtension = await loadWebExtension();
    background = webExtension.background;
  });

  describe("runtime message add-domain-to-list", () => {
    beforeEach(async () => {
      await background.browser.runtime.onMessage.addListener.yield({
        message: "add-domain-to-list"
      }, {
        url: "https://example.com"
      });
    });

    describe("runtime message what-sites-are-added", () => {
      it("should return the added sites", async () => {
        const [promise] = await background.browser.runtime.onMessage.addListener.yield({message: "what-sites-are-added"});
        const sites = await promise;
        expect(sites.includes("example.com")).to.be.true;
      });
    });


    describe("runtime message removeDomain", () => {
      it("should have removed the domain", async () => {
        await background.browser.runtime.onMessage.addListener.yield({
          message: "remove-domain-from-list",
          removeDomain: "example.com"
        });

        await sleep();

        const [promise] = await background.browser.runtime.onMessage.addListener.yield({message: "what-sites-are-added"});
        const sites = await promise;
        expect(sites.includes("example.com")).to.be.false;
      });
    });
  });

});

async function sleep(ms = 100) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
