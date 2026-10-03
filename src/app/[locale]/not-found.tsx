import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations();
  return (
    <main className="mx-auto flex max-w-[1180px] flex-col gap-6 px-6 py-24">
      <h1 className="m-0 font-serif text-[clamp(44px,5.6vw,72px)] font-normal leading-none tracking-[-0.02em]">
        {t('notFound.title')}
      </h1>
      <Link href="/" className="text-[14px] font-semibold">
        {t('privacy.back')}
      </Link>
    </main>
  );
}
