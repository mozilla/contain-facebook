describe("Block SubResources", () => {
  let webExtension, background;

  beforeEach(async () => {
    webExtension = await loadWebExtension();
    background = webExtension.background;
  });

  describe("origin url is not facebook", () => {
    it("should block subresources", async () => {
      const promise = background.browser.webRequest.onBeforeRequest.addListener.secondCall.yield({
        url: "https://fbcdn.net",
        originUrl: "https://example.com"
      });

      expect(await promise).to.deep.equal({cancel: true});
    });

    it("should not block subresources if origin url is added to facebook container", async () => {
      background.browser.storage.local.set({
        domainsAddedToFacebookContainer: ["example.com"]
      });

      const promise = background.browser.webRequest.onBeforeRequest.addListener.secondCall.yield({
        url: "https://fbcdn.net",
        originUrl: "https://example.com"
      });

      expect(await promise).to.deep.equal({});
    });
  });

  describe("origin url is facebook", () => {
    it("should not block subresources", async () => {
      const promise = background.browser.webRequest.onBeforeRequest.addListener.secondCall.yield({
        url: "https://fbcdn.net",
        originUrl: "https://www.facebook.com"
      });

      expect(await promise).to.deep.equal({});
    });
  });

  describe("origin url undefined", () => {
    it("should not block subresources", async () => {
      const promise = background.browser.webRequest.onBeforeRequest.addListener.secondCall.yield({
        url: "https://fbcdn.net",
        originUrl: undefined
      });

      expect(await promise).to.deep.equal({});
    });
  });

  describe("request url is not facebook", () => {
    it("should not block subresources", async () => {
      const promise = background.browser.webRequest.onBeforeRequest.addListener.secondCall.yield({
        url: "https://www.example.com",
        originUrl: "https://www.example.com"
      });

      expect(await promise).to.deep.equal({});
    });
  });
});