import { getTranslations } from 'next-intl/server';
import { site } from '@/config/site';

export default async function AppStoreButton() {
  const t = await getTranslations('store');
  return (
    <a
      href={site.appStoreUrl}
      className="inline-flex min-h-[58px] flex-col justify-center rounded-[14px] bg-ink px-[22px] py-[10px] leading-[1.15] text-paper hover:bg-black hover:text-paper"
    >
      <span className="text-[12px] opacity-85">{t('small')}</span>{' '}
      <span className="text-[21px] font-semibold tracking-[-0.01em]">App Store</span>
    </a>
  );
}
