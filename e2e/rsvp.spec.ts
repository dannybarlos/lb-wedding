import { test, expect } from "@playwright/test";

test.describe("RSVP page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/rsvp");
  });

  test("renders heading and deadline", async ({ page }) => {
    await expect(page.getByText(/will you join us/i)).toBeVisible();
    await expect(page.getByText(/June 1, 2027/i)).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.getByRole("button", { name: /send rsvp/i }).click();
    await expect(page.getByText(/at least 2 characters/i)).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.getByPlaceholder("Jane Smith").fill("Jane Smith");
    await page.getByPlaceholder("you@example.com").fill("not-an-email");
    await page.getByPlaceholder("you@example.com").blur();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test("successful submission shows success message (mock API)", async ({ page }) => {
    // Intercept the RSVP API call and return a successful response
    await page.route("/api/rsvp", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) })
    );

    await page.getByPlaceholder("Jane Smith").fill("Jane Smith");
    await page.getByPlaceholder("you@example.com").fill("jane@example.com");
    await page.getByRole("button", { name: /send rsvp/i }).click();

    await expect(page.getByText(/can't wait to celebrate/i)).toBeVisible({ timeout: 5000 });
  });

  test("shows error banner on API 500", async ({ page }) => {
    await page.route("/api/rsvp", (route) =>
      route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Server error" }) })
    );

    await page.getByPlaceholder("Jane Smith").fill("Jane Smith");
    await page.getByPlaceholder("you@example.com").fill("jane@example.com");
    await page.getByRole("button", { name: /send rsvp/i }).click();

    await expect(page.getByText(/something went wrong/i)).toBeVisible({ timeout: 5000 });
  });

  test("shows RSVP closed message on 423 response", async ({ page }) => {
    await page.route("/api/rsvp", (route) =>
      route.fulfill({ status: 423, contentType: "application/json", body: JSON.stringify({ error: "RSVP is closed" }) })
    );

    await page.getByPlaceholder("Jane Smith").fill("Jane Smith");
    await page.getByPlaceholder("you@example.com").fill("jane@example.com");
    await page.getByRole("button", { name: /send rsvp/i }).click();

    await expect(page.getByText(/rsvp is now closed/i)).toBeVisible({ timeout: 5000 });
  });

  test("hides guest count and meal preference when declining", async ({ page }) => {
    await page.getByLabel(/regretfully declines/i).click();
    await expect(page.getByText(/number of guests/i)).not.toBeVisible();
    await expect(page.getByText(/meal preference/i)).not.toBeVisible();
  });
});
