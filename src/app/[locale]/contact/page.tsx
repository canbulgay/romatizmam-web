import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactForm from '@/components/ContactForm';
import { site } from '@/config/site';
import { alternatesFor } from '@/i18n/alternates';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

const label = 'text-[12px] font-semibold uppercase tracking-[0.08em] text-muted';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('meta.contactTitle'),
    description: t('meta.description'),
    alternates: alternatesFor(locale as Locale, '/contact'),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="mx-auto flex max-w-[1180px] flex-col gap-12 px-6 pb-[104px] pt-16">
      <Link href="/" className="self-start text-[14px] font-semibold">
        {t('privacy.back')}
      </Link>
      <div className="flex flex-wrap items-start gap-x-[72px] gap-y-12">
        <div className="flex min-w-0 max-w-[460px] flex-[1_1_320px] flex-col gap-6">
          <h1 className="m-0 text-balance font-serif text-[clamp(44px,5.6vw,72px)] font-normal leading-none tracking-[-0.02em]">
            {t('contact.title')}
          </h1>
          <p className="m-0 text-pretty text-[18px] leading-[1.6] text-prose">{t('contact.body')}</p>
          <div className="flex flex-col gap-1.5 border-t border-line pt-6">
            <span className={label}>{t('contact.emailLabel')}</span>
            <a
              href={`mailto:${site.contactEmail}`}
              className="break-words font-serif text-[26px] leading-[1.2]"
            >
              {site.contactEmail}
            </a>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className={label}>{t('contact.webLabel')}</span>
            <a href={site.developerUrl} target="_blank" rel="noopener" className="text-[17px]">
              {site.developerUrl.replace('https://', '')}
            </a>
          </div>
          <p className="m-0 text-pretty text-[14px] leading-[1.6] text-muted">{t('contact.note')}</p>
        </div>
        <ContactForm
          email={site.contactEmail}
          labels={{
            topicLabel: t('contact.topicLabel'),
            topics: t.raw('contact.topics') as string[],
            nameLabel: t('contact.nameLabel'),
            msgLabel: t('contact.msgLabel'),
            send: t('contact.send'),
            sendNote: t('contact.sendNote'),
          }}
        />
      </div>
    </main>
  );
}
