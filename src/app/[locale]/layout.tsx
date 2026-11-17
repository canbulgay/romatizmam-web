import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Footer from '@/components/Footer';
import { site } from '@/config/site';
import { routing } from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  icons: { icon: '/icons/app-icon.png', apple: '/icons/app-icon.png' },
};

// A first segment that is not a locale (e.g. /nope.txt, which skips the proxy)
// must not match this route, so it falls through to global-not-found.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className="bg-ground text-ink font-sans antialiased">
        <NextIntlClientProvider>
          {/* The page row is at least one screen minus the footer, and grows
              with longer pages. Its height is definite, so the home page can
              fill it exactly. svh: the screen with the browser bars shown. */}
          <div className="grid min-h-svh grid-rows-[1fr_auto]">
            <div className="min-w-0">{children}</div>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
