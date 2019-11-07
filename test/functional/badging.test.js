describe("Badging", () => {
  beforeEach(async () => {
    const badgesFixture = `moz-extension://${internalUUID}/fixtures/badges.html`;
    await geckodriver.get(badgesFixture);
  });

  it("should badge facebook elements", async () => {
    await geckodriver.wait(until.elementLocated(
      By.className("fbc-badge")
    ), 5000, "Should have badged the element");
  });
});