import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders monogram from config", async ({ page }) => {
    await expect(page.getByRole("link", { name: "L & B" })).toBeVisible();
  });

  test("navbar is transparent at the top (data-scrolled=false)", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toHaveAttribute("data-scrolled", "false");
  });

  test("navbar gets backdrop-blur after scrolling 80px", async ({ page }) => {
    // Scroll past the 80px threshold
    await page.evaluate(() => window.scrollTo(0, 200));
    // Allow scroll event to propagate
    await page.waitForTimeout(100);
    const header = page.locator("header");
    await expect(header).toHaveAttribute("data-scrolled", "true");
  });

  test("scrolling back up removes backdrop-blur", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    const header = page.locator("header");
    await expect(header).toHaveAttribute("data-scrolled", "false");
  });

  test("RSVP button links to /rsvp", async ({ page }) => {
    const rsvpBtn = page.getByRole("link", { name: "RSVP" }).first();
    await expect(rsvpBtn).toHaveAttribute("href", "/rsvp");
  });

  test("nav links are present with correct hrefs", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Travel" })).toHaveAttribute("href", "/travel");
    await expect(page.getByRole("link", { name: "Registry" })).toHaveAttribute("href", "/registry");
    await expect(page.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
  });

  test("hamburger menu appears on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByRole("button", { name: "Toggle menu" })).toBeVisible();
  });

  test("hamburger opens mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await expect(page.getByRole("link", { name: "Travel" }).last()).toBeVisible();
  });
});
