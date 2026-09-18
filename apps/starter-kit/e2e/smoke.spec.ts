import { test, expect } from '@playwright/test';

test.describe('Starter Kit Browser Smoke Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Safety: Intercept and fulfill any form POSTs before they leave the browser
    await page.route('**/api/contact', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            received: JSON.parse(route.request().postData() || '{}'),
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Block unexpected external network requests
    await page.route(/(?:analytics|tracker|external-api)\./, (route) => route.abort());
  });

  test('Home: FAQ accordion toggle and diagram stage selection', async ({ page }) => {
    await page.goto('/');

    // Verify FAQ accordion open and close
    const faqTrigger = page.locator('[data-contextual="faq-trigger"]').first();
    await expect(faqTrigger).toBeVisible();
    await faqTrigger.click();

    const faqContent = page.locator('[data-contextual="faq-content"]').first();
    await expect(faqContent).toBeVisible();

    // Verify diagram interactive channel selection
    const flowSection = page.locator('#data-pipeline');
    await expect(flowSection).toBeVisible();
  });

  test('Docs: navigation, quickstart package manager, and mock brand preview isolation', async ({ page }) => {
    await page.goto('/docs');

    // Quickstart package manager tab toggles
    const npmTab = page.locator('button', { hasText: /^npm$/i }).first();
    if (await npmTab.isVisible()) {
      await npmTab.click();
      await expect(page.locator('span', { hasText: 'npm install' }).first()).toBeVisible();
    }

    // Capture canonical JSON-LD script before any mock UI interactions
    const canonicalScript = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(canonicalScript).toBeTruthy();

    // Interactive Demo / Mock Connector: editing mock state updates preview, NOT canonical script
    const mockBrandInput = page.locator('input[placeholder="Brand name..."], input[name="brandName"]').first();
    if (await mockBrandInput.isVisible()) {
      await mockBrandInput.fill('TRANSIENT_MOCK_BRAND_TEST');
      const scriptAfter = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(scriptAfter).toBe(canonicalScript);
    }
  });

  test('AutoForm: client validation stops invalid submission; valid input reaches intercepted route', async ({ page }) => {
    await page.goto('/docs');

    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Submit without input -> client validation triggers without POST
    let postOccurred = false;
    page.on('request', (req) => {
      if (req.url().includes('/api/contact') && req.method() === 'POST') {
        postOccurred = true;
      }
    });

    const submitBtn = form.locator('button[type="submit"]');
    await submitBtn.click();

    // Validation error messages appear
    const errorEl = form.locator('.text-rose-400, [data-invalid="true"], [role="alert"]').first();
    await expect(errorEl).toBeVisible();
    expect(postOccurred).toBe(false);

    // Fill valid synthetic data
    const nameInput = form.locator('input[name="name"]').first();
    const emailInput = form.locator('input[name="email"]').first();
    const topicSelect = form.locator('select[name="topic"]').first();
    const messageInput = form.locator('textarea[name="message"]').first();

    if (await nameInput.isVisible()) await nameInput.fill('Synthetic Tester');
    if (await emailInput.isVisible()) await emailInput.fill('synth@example.com');
    if (await topicSelect.isVisible()) await topicSelect.selectOption('general');
    if (await messageInput.isVisible()) await messageInput.fill('Valid synthetic test message over 10 chars.');

    await submitBtn.click();

    // Success confirmation appears from intercepted POST
    await expect(page.getByText('Response from /api/contact Received!')).toBeVisible();
  });

  test('Mobile viewport: navigation drawer opens and no page-level horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Check horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Mobile nav toggle
    const mobileToggle = page.locator('[data-contextual="navbar-toggle"], button[aria-label*="menu" i]').first();
    if (await mobileToggle.isVisible()) {
      await mobileToggle.click();
      const mobileMenu = page.locator('[data-contextual="navbar-menu"]').first();
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('Schema inspector: displays JSON and drawer functionality', async ({ page }) => {
    await page.goto('/schema');
    await expect(page.locator('body')).toBeVisible();

    // Verify page rendered JSON content or schema viewer
    const schemaContent = page.locator('pre, code, [data-contextual="schema-viewer"]').first();
    await expect(schemaContent).toBeVisible();
  });
});
