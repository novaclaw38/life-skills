import { test, expect } from "@playwright/test";

test("signup -> tutorials -> profile -> filter -> resume progress", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("supersecret1");
  await page.getByRole("button", { name: "12–15", exact: true }).click();
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/tutorials/);

  await page.getByRole("link", { name: /Changing a Flat Tire/ }).click();
  await expect(page).toHaveURL(/\/tutorials\/changing-a-tire/);

  await page.getByPlaceholder("Ask a question…").fill("What tool do I need first?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByRole("log", { name: "Conversation with your mentor" }).locator("p").nth(1)).toBeVisible({
    timeout: 15_000,
  });

  await page
    .getByRole("button", { name: "Mark complete" })
    .first()
    .click();
  await expect(page.getByText("Completed").first()).toBeVisible();

  await page.getByRole("link", { name: /Profile/ }).click();
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByText(/Changing a Flat Tire/)).toBeVisible();

  await page.getByRole("link", { name: /Tutorials/ }).click();
  await page.getByRole("button", { name: "Home Repairs", exact: true }).click();
  await expect(page).toHaveURL(/\/tutorials\?/);
  await expect(page.getByText(/Wiring a Plug|Unblocking a Sink Drain/)).toBeVisible();

  await page.getByLabel("Search tutorials").fill("wiring");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText(/Wiring a Plug/)).toBeVisible();
});
