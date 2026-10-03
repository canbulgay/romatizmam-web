import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('hero');
  return (
    <main>
      <h1>{t('h1a')}</h1>
    </main>
  );
}
