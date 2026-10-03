import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { site } from '@/config/site';

// Apple's official badges, unmodified. Widths are each SVG's own viewBox
// width at its 40px height; the artwork differs per language.
const badges: Record<string, { src: string; width: number }> = {
  tr: { src: '/icons/app-store-tr.svg', width: 151.29 },
  en: { src: '/icons/app-store-en.svg', width: 119.66 },
};

export default async function AppStoreButton() {
  const locale = await getLocale();
  const t = await getTranslations('store');
  const badge = badges[locale] ?? badges.en;
  return (
    <a href={site.appStoreUrl} className="inline-flex">
      <Image
        src={badge.src}
        alt={t('badgeAlt')}
        width={badge.width}
        height={40}
        unoptimized
        className="block h-[58px] w-auto"
      />
    </a>
  );
}
