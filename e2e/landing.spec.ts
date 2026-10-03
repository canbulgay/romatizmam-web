import { expect, test } from '@playwright/test';

test('Turkish hero copy and App Store link', async ({ page }) => {
  await page.goto('/');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('Ağrını tanı.');
  await expect(h1.locator('em')).toHaveText('Doktoruna göster.');
  await expect(page.getByText('Romatizmal hastalıklarla yaşam için')).toBeVisible();
  await expect(page.getByText("iPhone'da kullanılabilir")).toBeVisible();
  const store = page.getByRole('link', { name: /App Store/ });
  await expect(store).toHaveAttribute('href', 'https://apps.apple.com/');
});

test('English hero copy', async ({ page }) => {
  await page.goto('/en');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('Know your pain.');
  await expect(h1.locator('em')).toHaveText('Show your doctor.');
  await expect(page.getByRole('link', { name: /Download on the\s*App Store/ })).toBeVisible();
});

test('all hero images load', async ({ page }) => {
  await page.goto('/');
  const images = page.locator('main img');
  await expect(images).toHaveCount(3);
  for (const img of await images.all()) {
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  }
});

test('italic headline line uses the accent colour', async ({ page }) => {
  await page.goto('/');
  const em = page.getByRole('heading', { level: 1 }).locator('em');
  await expect(em).toHaveCSS('color', 'rgb(198, 95, 61)');
  await expect(em).toHaveCSS('font-style', 'italic');
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('no horizontal overflow, phones above text', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const phones = await page.getByTestId('phone-duo').boundingBox();
    const h1 = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(phones!.y).toBeLessThan(h1!.y);
  });
});

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('text and phones sit side by side', async ({ page }) => {
    await page.goto('/');
    const phones = await page.getByTestId('phone-duo').boundingBox();
    const h1 = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(h1!.x + h1!.width).toBeLessThanOrEqual(phones!.x + 1);
  });
});
