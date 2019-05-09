describe("Redirect Canceling", () => {
  let webExtension, background;

  beforeEach(async () => {
    webExtension = await loadWebExtension();
    background = webExtension.background;
  });

  describe("when other onBeforeRequestHandlers are faster and redirect with the same requestId", () => {
    it("should not open two tabs", async () => {
      const responses = {};
      await background.browser.tabs._create({
        url: "http://facebook.com"
      }, {
        options: {
          webRequestRedirects: ["https://www.facebook.com"],
          instantRedirects: true
        },
        responses
      });

      const result1 = await responses.webRequest.onBeforeRequest[0];
      const result2 = await responses.webRequest.onBeforeRequest[2];
      expect(result1).to.deep.equal({
        cancel: true
      });
      expect(result2).to.deep.equal({
        cancel: true
      });
      expect(background.browser.tabs.create).to.have.been.calledOnce;
    });
  });

  describe("when redirects change requestId midflight", () => {
    let tab;
    const responses = {};
    const redirectedRequest = async (options = {}) => {
      tab = await background.browser.tabs._create({
        url: "http://facebook.com"
      }, {
        options: Object.assign({
          webRequestRedirects: [
            "https://facebook.com",
            "https://www.facebook.com",
            {
              url: "https://www.facebook.com",
              webRequest: {
                requestId: 2
              }
            }
          ],
          instantRedirects: true
        }, options),
        responses
      });
    };

    it("should not open two tabs", async () => {
      await redirectedRequest();
      const result1 = await responses.webRequest.onBeforeRequest[0];
      const result2 = await responses.webRequest.onBeforeRequest[2];
      const result3 = await responses.webRequest.onBeforeRequest[4];
      const result4 = await responses.webRequest.onBeforeRequest[6];
      expect(result1).to.deep.equal({
        cancel: true
      });
      expect(result2).to.deep.equal({
        cancel: true
      });
      expect(result3).to.deep.equal({
        cancel: true
      });
      expect(result4).to.deep.equal({
        cancel: true
      });
      expect(background.browser.tabs.create).to.have.been.calledOnce;
    });

    it("should uncancel after onCompleted", async () => {
      await redirectedRequest();
      background.browser.tabs.create.resetHistory();
      // we create a tab with the same id and use the same request id to see if uncanceled
      await background.browser.tabs._create({
        id: tab.id,
        url: "https://www.facebook.com/foo"
      }, {
        options: {
          webRequest: {
            requestId: responses.webRequest.request.requestId
          }
        }
      });

      expect(background.browser.tabs.create).to.have.been.calledOnce;
    });

    it("should uncancel after onErrorOccurred", async () => {
      const webRequestDontYield = ["onCompleted"];
      await redirectedRequest({webRequestDontYield, webRequestError: true});
      background.browser.tabs.create.resetHistory();
      // we create a tab with the same id and use the same request id to see if uncanceled
      await background.browser.tabs._create({
        id: tab.id,
        url: "https://www.facebook.com/foo"
      }, {
        options: {
          webRequest: {
            requestId: responses.webRequest.request.requestId
          }
        }
      });

      expect(background.browser.tabs.create).to.have.been.calledOnce;
    });

    it("should uncancel after 2 seconds", async () => {
      const clock = sinon.useFakeTimers();
      const webRequestDontYield = ["onCompleted", "onErrorOccurred"];
      await redirectedRequest({webRequestDontYield});
      clock.tick(2000);
      background.browser.tabs.create.resetHistory();
      // we create a tab with the same id and use the same request id to see if uncanceled
      await background.browser.tabs._create({
        id: tab.id,
        url: "https://www.facebook.com/foo"
      }, {
        options: {
          webRequest: {
            requestId: responses.webRequest.request.requestId
          }
        }
      });

      expect(background.browser.tabs.create).to.have.been.calledOnce;
      clock.restore();
    });
  });
});
