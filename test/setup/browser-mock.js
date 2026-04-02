export function createBrowserMock(sinon) {
  let nextContainerId = 2;
  let nextTabId = 1;
  let nextRequestId = 1;

  // Simulate a pre-existing Firefox container so clearFacebookCookies can find
  // cookies stored in "firefox-container-1" (as hardcoded in cookies.test.js)
  const containerStore = [
    { cookieStoreId: "firefox-container-1", name: "Personal", color: "blue", icon: "fingerprint" },
  ];
  const tabStore = [];
  const cookieStore = [];
  let storageData = {};

  const onBeforeRequestListeners = [];
  const onCompletedListeners = [];
  const onErrorOccurredListeners = [];

  function makeListener() {
    const stub = sinon.stub();
    stub.addListener = sinon.stub().callsFake((handler) => {
      stub.addListener._handlers = stub.addListener._handlers || [];
      stub.addListener._handlers.push(handler);
    });
    stub.removeListener = sinon.stub();
    stub.hasListener = sinon.stub().returns(false);
    return stub;
  }

  function makeYieldableListener() {
    const spy = sinon.stub();
    spy.addListener = sinon.stub().callsFake(function(handler) {
      // Store handler so tests can call addListener.firstCall.yield() etc.
      // sinon's yield() calls the first argument of the stub call
    });
    spy.addListener.yield = function(...args) {
      const handlers = [];
      for (let i = 0; i < spy.addListener.callCount; i++) {
        handlers.push(spy.addListener.getCall(i).args[0]);
      }
      const results = handlers.map(h => h(...args));
      return results;
    };
    spy.removeListener = sinon.stub();
    spy.hasListener = sinon.stub().returns(false);
    return spy;
  }

  async function contextualIdentitiesCreate(details) {
    const container = {
      cookieStoreId: `firefox-container-${nextContainerId++}`,
      name: details.name,
      color: details.color || "toolbar",
      icon: details.icon || "fence",
    };
    containerStore.push(container);
    return container;
  }

  const contextualIdentities = {
    _create: contextualIdentitiesCreate,
    create: sinon.stub().callsFake(contextualIdentitiesCreate),
    query: sinon.stub().callsFake(async ({ name } = {}) => {
      if (name) return containerStore.filter(c => c.name === name);
      return [...containerStore];
    }),
    update: sinon.stub().callsFake(async (cookieStoreId, details) => {
      const c = containerStore.find(c => c.cookieStoreId === cookieStoreId);
      if (c) Object.assign(c, details);
      return c;
    }),
  };

  const storageLocal = {
    _data: storageData,
    get: sinon.stub().callsFake(async () => ({ ...storageData })),
    set: sinon.stub().callsFake(async (data) => {
      Object.assign(storageData, data);
    }),
  };

  const cookies = {
    set: sinon.stub().callsFake(async ({ name, value, url, storeId = "firefox-default" }) => {
      const existing = cookieStore.findIndex(c => c.name === name && c.storeId === storeId);
      const cookie = { name, value, storeId, url };
      if (existing >= 0) cookieStore[existing] = cookie;
      else cookieStore.push(cookie);
    }),
    getAll: sinon.stub().callsFake(async ({ domain, storeId } = {}) => {
      return cookieStore.filter(c => {
        if (storeId && c.storeId !== storeId) return false;
        if (domain && c.url && !c.url.includes(domain)) return false;
        return true;
      });
    }),
    remove: sinon.stub().callsFake(async ({ name, storeId = "firefox-default" }) => {
      const idx = cookieStore.findIndex(c => c.name === name && c.storeId === storeId);
      if (idx >= 0) cookieStore.splice(idx, 1);
    }),
  };

  const tabsOnUpdated = makeYieldableListener();
  const tabsOnRemoved = makeYieldableListener();

  async function tabsCreate(details) {
    const tab = {
      id: nextTabId++,
      url: details.url || "about:blank",
      cookieStoreId: details.cookieStoreId || "firefox-default",
      status: "complete",
      active: true,
      index: tabStore.length,
      windowId: 1,
      ...details,
    };
    tabStore.push(tab);
    return tab;
  }

  const tabs = {
    create: sinon.stub().callsFake(tabsCreate),
    remove: sinon.stub().resolves(),
    get: sinon.stub().callsFake(async (id) => tabStore.find(t => t.id === id)),
    query: sinon.stub().callsFake(async (filter = {}) => {
      let result = [...tabStore];
      if (filter.active !== undefined) result = result.filter(t => t.active === filter.active);
      if (filter.currentWindow !== undefined) result = result.filter(t => t.windowId === 1);
      return result;
    }),
    sendMessage: sinon.stub().resolves(),
    onUpdated: tabsOnUpdated,
    onRemoved: tabsOnRemoved,

    _create: async (tabInfo, { responses, options } = {}) => {
      const tab = {
        id: tabInfo.id !== undefined ? tabInfo.id : nextTabId++,
        url: tabInfo.url || "about:blank",
        cookieStoreId: tabInfo.cookieStoreId || "firefox-default",
        status: tabInfo.status || "complete",
        active: true,
        index: tabStore.length,
        windowId: 1,
        ...tabInfo,
      };
      tabStore.push(tab);

      if (responses) responses.webRequest = { onBeforeRequest: [] };

      const redirectUrls = (options && options.webRequestRedirects) || [];
      const allUrls = [tab.url, ...redirectUrls.map(r => (typeof r === "object" ? r.url : r))];
      const dontYield = (options && options.webRequestDontYield) || [];
      const instantRedirects = options && options.instantRedirects;

      // Single-URL override (used by redirect-canceling tests to reuse a requestId)
      let requestId = (options && options.webRequest && options.webRequest.requestId !== undefined)
        ? options.webRequest.requestId
        : nextRequestId++;
      let lastRequest = null;

      for (let urlIdx = 0; urlIdx < allUrls.length; urlIdx++) {
        const url = allUrls[urlIdx];
        const redirectEntry = redirectUrls[urlIdx - 1];
        if (redirectEntry && typeof redirectEntry === "object" && redirectEntry.webRequest && redirectEntry.webRequest.requestId !== undefined) {
          requestId = redirectEntry.webRequest.requestId;
        }

        const requestDetails = {
          url,
          tabId: tab.id,
          requestId,
          type: "main_frame",
          frameAncestors: [],
        };
        lastRequest = requestDetails;

        const handlers = [];
        for (let i = 0; i < webRequest.onBeforeRequest.addListener.callCount; i++) {
          handlers.push(webRequest.onBeforeRequest.addListener.getCall(i).args[0]);
        }

        const handlerPromises = handlers.map(h => Promise.resolve(h(requestDetails)));
        if (responses) handlerPromises.forEach(p => responses.webRequest.onBeforeRequest.push(p));

        // Await all handlers so async side-effects (e.g. tabs.create calls) complete
        await Promise.all(handlerPromises);

        if (!instantRedirects) await Promise.resolve();
      }

      if (responses) responses.webRequest.request = lastRequest;

      if (!dontYield.includes("onCompleted")) {
        for (const handler of onCompletedListeners) {
          handler({ tabId: tab.id, requestId });
        }
      }
      if ((options && options.webRequestError) && !dontYield.includes("onErrorOccurred")) {
        for (const handler of onErrorOccurredListeners) {
          handler({ tabId: tab.id, requestId });
        }
      }

      return tab;
    },
  };

  const onBeforeRequestSpy = sinon.stub();
  onBeforeRequestSpy.addListener = sinon.stub().callsFake((handler) => {
    onBeforeRequestListeners.push(handler);
  });

  const webRequest = {
    onBeforeRequest: onBeforeRequestSpy,
    onCompleted: {
      addListener: sinon.stub().callsFake((handler) => {
        onCompletedListeners.push(handler);
      }),
    },
    onErrorOccurred: {
      addListener: sinon.stub().callsFake((handler) => {
        onErrorOccurredListeners.push(handler);
      }),
    },
  };

  const runtime = {
    sendMessage: sinon.stub().resolves(false),
    onMessage: { addListener: sinon.stub() },
    onMessageExternal: { addListener: sinon.stub() },
    getBrowserInfo: sinon.stub().resolves({ version: "120.0" }),
  };

  runtime.onMessage.addListener.yield = function(...args) {
    const results = [];
    for (let i = 0; i < runtime.onMessage.addListener.callCount; i++) {
      const handler = runtime.onMessage.addListener.getCall(i).args[0];
      results.push(handler(...args));
    }
    return results;
  };

  const management = {
    get: sinon.stub().resolves({ enabled: false }),
    onInstalled: { addListener: sinon.stub() },
    onEnabled: { addListener: sinon.stub() },
    onUninstalled: { addListener: sinon.stub() },
    onDisabled: { addListener: sinon.stub() },
  };

  for (const event of ["onInstalled", "onEnabled", "onUninstalled", "onDisabled"]) {
    management[event].addListener.yield = (function(evt) {
      return function(...args) {
        for (let i = 0; i < management[evt].addListener.callCount; i++) {
          management[evt].addListener.getCall(i).args[0](...args);
        }
      };
    })(event);
  }

  const browser = {
    contextualIdentities,
    storage: { local: storageLocal },
    cookies,
    tabs,
    webRequest,
    runtime,
    management,
    browsingData: { remove: sinon.stub().resolves() },
    browserAction: {
      setBadgeText: sinon.stub(),
      setBadgeBackgroundColor: sinon.stub(),
      setPopup: sinon.stub(),
    },
    windows: {
      WINDOW_ID_NONE: -1,
      onFocusChanged: { addListener: sinon.stub() },
    },
    i18n: { getUILanguage: sinon.stub().returns("en") },
    extension: { getURL: sinon.stub().returns("") },
  };

  return {
    browser,
    background: { browser },
    facebookContainer: null,
    destroy() {
      storageData = {};
      storageLocal._data = storageData;
      tabStore.length = 0;
      cookieStore.length = 0;
      containerStore.length = 0;
      onBeforeRequestListeners.length = 0;
      onCompletedListeners.length = 0;
      onErrorOccurredListeners.length = 0;
    },
  };
}
