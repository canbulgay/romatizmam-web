import { expect, test } from '@playwright/test';

const appStoreUrl = 'https://apps.apple.com/tr/app/romi-arthritis-pain-tracker/id6819439195';

test('Turkish hero copy and App Store link', async ({ page }) => {
  await page.goto('/');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('Ağrını tanı.');
  await expect(h1).toContainText('Doktoruna göster.');
  await expect(page.getByText('Romatizmal hastalıklarla yaşam için')).toBeVisible();
  await expect(page.getByText("iPhone'da kullanılabilir")).toBeVisible();
  const store = page.getByRole('link', { name: "App Store'dan İndirin" });
  await expect(store).toHaveAttribute('href', appStoreUrl);
  await expect(store.locator('img')).toHaveAttribute('src', /app-store-tr\.svg/);
});

test('English hero copy', async ({ page }) => {
  await page.goto('/en');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('Know your pain.');
  await expect(h1).toContainText('Show your doctor.');
  const store = page.getByRole('link', { name: 'Download on the App Store' });
  await expect(store).toHaveAttribute('href', appStoreUrl);
  await expect(store.locator('img')).toHaveAttribute('src', /app-store-en\.svg/);
});

test('all hero images and the store badge load', async ({ page }) => {
  await page.goto('/');
  const images = page.locator('main img');
  await expect(images).toHaveCount(4);
  for (const img of await images.all()) {
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  }
});

test('headline is upright system type, second line in the icon orange', async ({ page }) => {
  await page.goto('/');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1.locator('em')).toHaveCount(0);
  await expect(h1).toHaveCSS('font-family', /-apple-system/);
  await expect(h1).toHaveCSS('font-weight', '700');
  const second = h1.getByText('Doktoruna göster.');
  await expect(second).toHaveCSS('color', 'rgb(194, 91, 52)');
  await expect(second).toHaveCSS('font-style', 'normal');
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

test('store badge is Apple\'s artwork at the button height', async ({ page }) => {
  await page.goto('/');
  const box = await page.getByRole('link', { name: "App Store'dan İndirin" }).locator('img').boundingBox();
  expect(Math.round(box!.height)).toBe(58);
  expect(box!.width / box!.height).toBeCloseTo(151.29 / 40, 1);
});

// Phone heights are Safari's visible area with the browser bars shown.
const oneScreen = [
  { width: 1920, height: 1080, phones: true },
  { width: 1440, height: 900, phones: true },
  { width: 1280, height: 720, phones: true },
  { width: 1280, height: 640, phones: true },
  { width: 768, height: 1024, phones: true },
  { width: 390, height: 664, phones: true },
  { width: 375, height: 629, phones: true },
  // iPhone SE: too short for the phones, so they are dropped.
  { width: 375, height: 548, phones: false },
];

for (const { phones: showsPhones, ...viewport } of oneScreen) {
  test.describe(`one screen at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test('hero and footer fit without scrolling', async ({ page }) => {
      await page.goto('/');
      const scroll = await page.evaluate(() => ({
        height: document.documentElement.scrollHeight,
        viewport: window.innerHeight,
      }));
      expect(scroll.height).toBeLessThanOrEqual(scroll.viewport);
      const footer = await page.locator('footer').boundingBox();
      expect(footer!.y + footer!.height).toBeLessThanOrEqual(viewport.height + 0.5);
      const phones = page.getByTestId('phone-duo');
      if (showsPhones) {
        expect((await phones.boundingBox())!.height).toBeGreaterThanOrEqual(150);
      } else {
        await expect(phones).toBeHidden();
      }
    });
  });
}
