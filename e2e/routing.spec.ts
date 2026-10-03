import { expect, test } from '@playwright/test';

test.describe('Turkish browser', () => {
  test.use({ locale: 'tr-TR' });

  test('/ serves Turkish without redirect', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ağrını tanı.');
  });

  test('/en stays English', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Know your pain.');
  });

  test('/tr redirects to /', async ({ page }) => {
    await page.goto('/tr');
    await expect(page).toHaveURL(/localhost:3000\/$/);
  });

  test('/tr/privacy redirects to /privacy', async ({ page }) => {
    await page.goto('/tr/privacy');
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page).not.toHaveURL(/\/tr\//);
  });
});

test.describe('English browser', () => {
  test.use({ locale: 'en-US' });

  test('/ redirects to /en', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('/privacy redirects to /en/privacy', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveURL(/\/en\/privacy$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy Policy');
  });
});

// Playwright's `locale` option overrides an Accept-Language set through
// extraHTTPHeaders, so these send the header on a raw request instead.
test('weighted Accept-Language prefers English', async ({ request }) => {
  const res = await request.get('/', {
    headers: { 'Accept-Language': 'en-GB,en;q=0.9,tr;q=0.8' },
    maxRedirects: 0,
  });
  expect(res.status()).toBe(307);
  expect(res.headers()['location']).toMatch(/\/en$/);
});

test('unsupported browser language falls back to Turkish at /', async ({ request }) => {
  const res = await request.get('/', {
    headers: { 'Accept-Language': 'de-DE,de;q=0.9' },
    maxRedirects: 0,
  });
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('<html lang="tr"');
});
