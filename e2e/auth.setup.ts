import { expect } from "@playwright/test";
import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

const email = process.env.ADMIN_EMAIL || "";
const password = process.env.ADMIN_PASSWORD || "";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "name@host.com" }).type(email);
  await page.getByRole("textbox", { name: "Password" }).type(password);
  await page.getByRole("button", { name: "submit" }).click();
  await expect(page).toHaveTitle("De Mol Poll");
  await page.context().storageState({ path: authFile });
});
