import { expect, test } from '@playwright/test';

test('footer privacy link follows the active locale', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Gizlilik Politikası' }).click();
  await expect(page).toHaveURL(/localhost:3000\/privacy$/);

  await page.goto('/en');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy Policy' }).click();
  await expect(page).toHaveURL(/\/en\/privacy$/);
});

test('footer links to canbulgay.com in a new tab', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: '© 2026 canbulgay.com' });
  await expect(link).toHaveAttribute('href', 'https://canbulgay.com');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
});

test('switcher marks the active language', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Language' });
  await expect(nav.getByRole('link', { name: 'TR' })).toHaveAttribute('aria-current', 'true');
  await expect(nav.getByRole('link', { name: 'EN' })).not.toHaveAttribute('aria-current', 'true');
  await expect(nav.getByRole('link', { name: 'TR' })).toHaveCSS('background-color', 'rgb(42, 33, 27)');
});

test.describe('English browser choosing Turkish', () => {
  test.use({ locale: 'en-US' });

  test('switch keeps the page and the choice persists', async ({ page, context }) => {
    await page.goto('/en/privacy');
    await page.getByRole('navigation', { name: 'Language' }).getByRole('link', { name: 'TR' }).click();
    await expect(page).toHaveURL(/localhost:3000\/privacy$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');

    await page.goto('/');
    await expect(page).toHaveURL(/localhost:3000\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');

    const cookie = (await context.cookies()).find((c) => c.name === 'NEXT_LOCALE');
    expect(cookie?.value).toBe('tr');
    const threeHundredDays = Date.now() / 1000 + 300 * 24 * 60 * 60;
    expect(cookie!.expires).toBeGreaterThan(threeHundredDays);
  });
});

test.describe('Turkish browser choosing English', () => {
  test.use({ locale: 'tr-TR' });

  test('stored English choice wins on the next visit to /', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Language' }).getByRole('link', { name: 'EN' }).click();
    await expect(page).toHaveURL(/\/en$/);

    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
