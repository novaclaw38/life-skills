import { test, expect } from "@playwright/test";

test("signup -> age band -> view tutorial -> chat -> mark step complete", async ({ page }) => {
  const email = `test-${Date.now()}@example.com`;

  await page.goto("/signup");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password (min 8 characters)").fill("supersecret1");
  await page.getByRole("combobox").selectOption("AGE_12_15");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/tutorials/);

  await page.getByRole("link", { name: /Changing a Flat Tire/ }).click();
  await expect(page).toHaveURL(/\/tutorials\/changing-a-tire/);

  await page.getByPlaceholder("Ask a question…").fill("What tool do I need first?");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.locator("aside p").last()).not.toHaveText("", { timeout: 15_000 });

  await page
    .getByRole("button", { name: "Mark complete" })
    .first()
    .click();
  await expect(page.getByText("Completed").first()).toBeVisible();

  await page.reload();
  await expect(page.getByText("Completed").first()).toBeVisible();
});
