import { getTranslations, setRequestLocale } from 'next-intl/server';
import PrivacyToc from '@/components/PrivacyToc';

type Section = { h: string; p: string };

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');
  const sections = (t.raw('sections') as Section[]).map((s, i) => ({
    ...s,
    id: `section-${i + 1}`,
  }));

  return (
    <main className="mx-auto flex max-w-[1180px] flex-wrap gap-x-16 gap-y-12 px-6 pb-[104px] pt-16">
      <PrivacyToc back={t('back')} sections={sections} />
      <article className="flex min-w-0 max-w-[760px] flex-[999_1_480px] flex-col gap-9">
        <div className="flex flex-col gap-4">
          <h1 className="m-0 font-serif text-[clamp(44px,5.6vw,72px)] font-normal leading-none tracking-[-0.02em]">
            {t('title')}
          </h1>
          <div className="text-[14px] text-muted">{t('updated')}</div>
          <p className="mb-0 mt-2 text-pretty text-[18px] leading-[1.65] text-prose">
            {t('intro')}
          </p>
        </div>
        {sections.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="flex scroll-mt-6 flex-col gap-3 border-t border-line pt-7"
          >
            <h2 className="m-0 text-[21px] font-semibold tracking-[-0.01em]">{s.h}</h2>
            <p className="m-0 whitespace-pre-line text-pretty break-words text-[16px] leading-[1.7] text-prose">
              {s.p}
            </p>
          </section>
        ))}
      </article>
    </main>
  );
}
