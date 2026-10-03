import { expect, test } from '@playwright/test';

const base = 'https://romatizmam.com';

const pages = [
  { path: '/', locale: 'tr-TR', title: 'Romi — Romatizmal hastalıklarla yaşam için', canonical: `${base}/`, tr: `${base}/`, en: `${base}/en` },
  { path: '/en', locale: 'en-US', title: 'Romi — For life with rheumatic disease', canonical: `${base}/en`, tr: `${base}/`, en: `${base}/en` },
  { path: '/privacy', locale: 'tr-TR', title: 'Gizlilik Politikası — Romi', canonical: `${base}/privacy`, tr: `${base}/privacy`, en: `${base}/en/privacy` },
  { path: '/en/privacy', locale: 'en-US', title: 'Privacy Policy — Romi', canonical: `${base}/en/privacy`, tr: `${base}/privacy`, en: `${base}/en/privacy` },
];

const strip = (url: string | null) => (url ?? '').replace(/\/$/, '');

for (const p of pages) {
  test.describe(p.path, () => {
    test.use({ locale: p.locale });

    test('title, description, canonical and hreflang', async ({ page }) => {
      await page.goto(p.path);
      await expect(page).toHaveTitle(p.title);
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toMatch(/Romi/);
      expect(strip(await page.locator('link[rel="canonical"]').getAttribute('href'))).toBe(strip(p.canonical));
      const alt = (lang: string) =>
        page.locator(`link[rel="alternate"][hreflang="${lang}"]`).getAttribute('href');
      expect(strip(await alt('tr'))).toBe(strip(p.tr));
      expect(strip(await alt('en'))).toBe(strip(p.en));
      expect(strip(await alt('x-default'))).toBe(strip(p.tr));
    });
  });
}

test('favicon is the app icon', async ({ page }) => {
  await page.goto('/');
  const icon = page.locator('link[rel="icon"]').first();
  await expect(icon).toHaveAttribute('href', /app-icon\.png/);
  const res = await page.request.get((await icon.getAttribute('href'))!);
  expect(res.status()).toBe(200);
  expect((await res.body()).byteLength).toBeLessThan(60_000);
});

test('sitemap lists the four URLs', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const loc of [`${base}/`, `${base}/en`, `${base}/privacy`, `${base}/en/privacy`]) {
    expect(xml).toMatch(new RegExp(`<loc>${loc.replace(/\/$/, '')}/?</loc>`));
  }
});

test('robots allows all and points at the sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const txt = await res.text();
  expect(txt).toMatch(/Allow: \//);
  expect(txt).toContain(`Sitemap: ${base}/sitemap.xml`);
});

test.describe('404', () => {
  test('unknown Turkish path', async ({ page }) => {
    const res = await page.goto('/nope');
    expect(res!.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sayfa bulunamadı');
    await page.getByRole('link', { name: '← Ana sayfaya dön' }).click();
    await expect(page).toHaveURL(/localhost:3000\/$/);
  });

  test('unknown English path', async ({ page }) => {
    const res = await page.goto('/en/nope');
    expect(res!.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  });
});

test.describe('404 without JavaScript', () => {
  for (const { path, accept, lang, heading } of [
    { path: '/nope', accept: 'tr', lang: 'tr', heading: 'Sayfa bulunamadı' },
    { path: '/en/nope', accept: 'tr', lang: 'en', heading: 'Page not found' },
    { path: '/nope.txt', accept: 'tr', lang: 'tr', heading: 'Sayfa bulunamadı' },
  ]) {
    test(`${path} is server-rendered in ${lang} with a title`, async ({ request }) => {
      const res = await request.get(path, { headers: { 'Accept-Language': accept } });
      expect(res.status()).toBe(404);
      const html = await res.text();
      expect(html).toContain(`<html lang="${lang}"`);
      expect(html).toMatch(new RegExp(`<h1[^>]*>${heading}</h1>`));
      expect(html).toMatch(new RegExp(`<title>${heading} — Romi</title>`));
    });
  }
});
