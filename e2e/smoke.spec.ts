import { expect, test } from '@playwright/test';

test('page background uses the cream token', async ({ page }) => {
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(241, 232, 220)');
});
