import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test/functional",
  use: {
    browserName: "firefox",
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "node test/functional/server.js",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
