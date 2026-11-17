import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import AppStoreButton from './AppStoreButton';
import PhoneDuo from './PhoneDuo';

// The hero fills the screen above the footer with no scrolling: the text keeps
// its size and the phones take whatever height is left (see .hero-grid).
export default async function Hero() {
  const t = await getTranslations('hero');
  return (
    <section className="hero-grid mx-auto h-full max-w-[1180px]">
      <div className="flex items-center gap-3 [grid-area:brand] desk:mb-7 desk:gap-4">
        <Image
          src="/images/app-icon.png"
          alt="Romi"
          width={64}
          height={64}
          className="block h-12 w-12 flex-none rounded-[22.5%] desk:h-16 desk:w-16"
        />
        <div className="flex min-w-0 flex-col gap-0.5 desk:gap-1">
          <span className="text-[22px] font-bold leading-7 tracking-[-0.01em] desk:text-[28px] desk:leading-[34px]">
            Romi
          </span>
          <span className="text-[13px] leading-[18px] text-ink-2 desk:text-[15px] desk:leading-5">
            {t('eyebrow')}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 [grid-area:text] desk:gap-6">
        <h1 className="m-0 text-balance text-[clamp(36px,min(5.2vw,9vh),64px)] font-bold leading-[1.05] tracking-[-0.025em]">
          {t('h1a')}
          {/* icon-orange is 3.6:1 on ground: fine at this size, never for small text. */}
          <span className="block text-icon-orange">{t('h1b')}</span>
        </h1>
        <p className="m-0 max-w-[520px] text-pretty text-[16px] leading-[22px] text-ink-2 desk:text-[20px] desk:leading-7">
          {t('sub')}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 desk:gap-x-5">
          <AppStoreButton />
          <span className="text-[13px] leading-[18px] text-ink-2 desk:text-[15px] desk:leading-5">
            {t('note')}
          </span>
        </div>
      </div>

      <div className="hero-phones relative flex min-h-0 items-center justify-center [grid-area:phones]">
        <PhoneDuo />
      </div>
    </section>
  );
}
