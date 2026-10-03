import { expect, test } from '@playwright/test';

for (const { path, title, first, back, home } of [
  { path: '/privacy', title: 'Gizlilik Politikası', first: '1. Girdiğin veriler', back: '← Ana sayfaya dön', home: /localhost:3000\/$/ },
  { path: '/en/privacy', title: 'Privacy Policy', first: '1. Data you enter', back: '← Back to home', home: /\/en$/ },
]) {
  test.describe(path, () => {
    test.use({ locale: path.startsWith('/en') ? 'en-US' : 'tr-TR' });

    test('renders title, date, intro and 11 sections', async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      await expect(page.getByText(/2026/).first()).toBeVisible();
      const headings = page.locator('article').getByRole('heading', { level: 2 });
      await expect(headings).toHaveCount(11);
      await expect(headings.first()).toHaveText(first);
    });

    test('side list links target existing sections', async ({ page }) => {
      await page.goto(path);
      const links = page.locator('aside a[href^="#section-"]');
      await expect(links).toHaveCount(11);
      for (const href of await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')!))) {
        await expect(page.locator(href)).toHaveCount(1);
      }
      await links.nth(10).click();
      await expect(page.locator('#section-11')).toBeInViewport();
    });

    test('back link returns to the landing page', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('link', { name: back }).click();
      await expect(page).toHaveURL(home);
    });

    test('contact section keeps its line breaks', async ({ page }) => {
      await page.goto(path);
      const contact = page.locator('#section-11 p');
      await expect(contact).toHaveCSS('white-space', 'pre-line');
      await expect(contact).toContainText('canbulgay@outlook.com');
    });
  });
}

test.describe('narrow screen', () => {
  test.use({ viewport: { width: 320, height: 700 } });

  for (const path of ['/privacy', '/en/privacy']) {
    test(`${path} has no horizontal overflow at 320px`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('side list scrolls away instead of covering the article', async ({ page }) => {
    await page.goto('/privacy');
    await page.locator('#section-11').scrollIntoViewIfNeeded();
    await expect(page.locator('aside')).not.toBeInViewport();
  });
});

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('side list stays pinned while scrolling', async ({ page }) => {
    await page.goto('/privacy');
    await page.locator('#section-8').scrollIntoViewIfNeeded();
    await expect(page.locator('aside')).toBeInViewport();
  });
});
