import { test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/admin");
  await page.getByLabel("Datum").type("25/12/2023");
});
