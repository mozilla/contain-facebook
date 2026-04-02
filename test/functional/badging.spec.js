import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.browser = {
      runtime: {
        sendMessage: (msg) => {
          if (msg && msg.message === "what-sites-are-added") return Promise.resolve([]);
          if (msg && msg.message === "get-root-domain") return Promise.resolve("localhost");
          return Promise.resolve(undefined);
        },
        onMessage: { addListener: () => {} },
        onMessageExternal: { addListener: () => {} },
        getURL: (path) => path,
      },
      storage: { local: { get: () => Promise.resolve({}) } },
      i18n: { getMessage: () => "" },
      tabs: { sendMessage: () => Promise.resolve() },
    };
  });
});

test("badges Facebook login elements", async ({ page }) => {
  await page.goto("/test/functional/fixtures/badges.html");
  await expect(page.locator(".fbc-badge").first()).toBeVisible({ timeout: 5000 });
});
