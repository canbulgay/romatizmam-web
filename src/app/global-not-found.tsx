import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { localizedPath } from '@/i18n/alternates';
import { routing } from '@/i18n/routing';
import './globals.css';

async function resolveLocale() {
  const locale = await getLocale();
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: await resolveLocale(), namespace: 'notFound' });
  return { title: `${t('title')} — Romi` };
}

export default async function GlobalNotFound() {
  const locale = await resolveLocale();
  const t = await getTranslations({ locale });

  return (
    <html lang={locale}>
      <body className="bg-ground text-ink font-sans antialiased">
        <main className="mx-auto flex max-w-[1180px] flex-col gap-6 px-6 py-24">
          <h1 className="m-0 text-[clamp(40px,5vw,64px)] font-bold leading-[1.05] tracking-[-0.025em]">
            {t('notFound.title')}
          </h1>
          <a href={localizedPath(locale, '')} className="text-[14px] font-semibold">
            {t('privacy.back')}
          </a>
        </main>
      </body>
    </html>
  );
}
