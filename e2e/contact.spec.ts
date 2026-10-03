import { expect, test } from '@playwright/test';

const cases = [
  {
    path: '/contact',
    locale: 'tr-TR',
    title: 'Soru ya da önerin mi var?',
    topics: ['Öneri', 'Hata bildirimi', 'Soru'],
    name: 'Adın (isteğe bağlı)',
    message: 'Mesaj',
    send: 'Mesajı gönder',
    note: /tıbbi tavsiye isteme/,
    back: '← Ana sayfaya dön',
    home: /localhost:3000\/$/,
  },
  {
    path: '/en/contact',
    locale: 'en-US',
    title: 'Questions or feedback?',
    topics: ['Feedback', 'Bug report', 'Question'],
    name: 'Your name (optional)',
    message: 'Message',
    send: 'Send message',
    note: /ask for medical advice/,
    back: '← Back to home',
    home: /\/en$/,
  },
];

// The form hands the message to the visitor's mail app. Record the URL it
// opens instead of letting the browser follow a mailto: link.
async function recordOpenedUrls(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    (window as unknown as { opened: string[] }).opened = [];
    window.open = (url?: string | URL) => {
      (window as unknown as { opened: string[] }).opened.push(String(url));
      return null;
    };
  });
}

const opened = (page: import('@playwright/test').Page) =>
  page.evaluate(() => (window as unknown as { opened: string[] }).opened);

for (const c of cases) {
  test.describe(c.path, () => {
    test.use({ locale: c.locale });

    test('shows the heading, contact details and medical note', async ({ page }) => {
      await page.goto(c.path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(c.title);
      await expect(page.getByRole('main').getByRole('link', { name: 'canbulgay@outlook.com' })).toHaveAttribute(
        'href',
        'mailto:canbulgay@outlook.com',
      );
      await expect(page.getByRole('main').getByRole('link', { name: 'canbulgay.com', exact: true })).toHaveAttribute(
        'href',
        'https://canbulgay.com',
      );
      await expect(page.getByText(c.note)).toBeVisible();
    });

    test('first topic is selected by default and another can be picked', async ({ page }) => {
      await page.goto(c.path);
      const radios = page.getByRole('radio');
      await expect(radios).toHaveCount(3);
      await expect(page.getByRole('radio', { name: c.topics[0] })).toBeChecked();
      await page.getByText(c.topics[1], { exact: true }).click();
      await expect(page.getByRole('radio', { name: c.topics[1] })).toBeChecked();
      await expect(page.getByRole('radio', { name: c.topics[0] })).not.toBeChecked();
    });

    test('sending opens the mail app with topic, message and name', async ({ page }) => {
      await recordOpenedUrls(page);
      await page.goto(c.path);
      await page.getByText(c.topics[2], { exact: true }).click();
      await page.getByLabel(c.name).fill('  Ayşe  ');
      await page.getByLabel(c.message, { exact: true }).fill('Satır bir\nSatır iki & üç?');
      await page.getByRole('button', { name: c.send }).click();

      const urls = await opened(page);
      expect(urls).toHaveLength(1);
      const url = new URL(urls[0]);
      expect(url.protocol).toBe('mailto:');
      expect(url.pathname).toBe('canbulgay@outlook.com');
      expect(url.searchParams.get('subject')).toBe(`Romi – ${c.topics[2]}`);
      expect(url.searchParams.get('body')).toBe('Satır bir\nSatır iki & üç?\n\n— Ayşe');
    });

    test('name is optional: the body is just the message', async ({ page }) => {
      await recordOpenedUrls(page);
      await page.goto(c.path);
      await page.getByLabel(c.message, { exact: true }).fill('Merhaba');
      await page.getByRole('button', { name: c.send }).click();
      const url = new URL((await opened(page))[0]);
      expect(url.searchParams.get('subject')).toBe(`Romi – ${c.topics[0]}`);
      expect(url.searchParams.get('body')).toBe('Merhaba');
    });

    test('an empty message is not sent', async ({ page }) => {
      await recordOpenedUrls(page);
      await page.goto(c.path);
      await page.getByRole('button', { name: c.send }).click();
      expect(await opened(page)).toHaveLength(0);
    });

    test('back link returns to the landing page', async ({ page }) => {
      await page.goto(c.path);
      await page.getByRole('link', { name: c.back }).click();
      await expect(page).toHaveURL(c.home);
    });
  });
}

test('footer contact link follows the active locale', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('contentinfo').getByRole('link', { name: 'İletişim' }).click();
  await expect(page).toHaveURL(/localhost:3000\/contact$/);

  await page.goto('/en');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Contact' }).click();
  await expect(page).toHaveURL(/\/en\/contact$/);
});

test('language switch keeps the visitor on the contact page', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('navigation', { name: 'Language' }).getByRole('link', { name: 'EN' }).click();
  await expect(page).toHaveURL(/\/en\/contact$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questions or feedback?');
});

test.describe('narrow screen', () => {
  test.use({ viewport: { width: 320, height: 700 } });

  for (const path of ['/contact', '/en/contact']) {
    test(`${path} has no horizontal overflow at 320px`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
