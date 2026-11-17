import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import AppStoreButton from './AppStoreButton';
import PhoneDuo from './PhoneDuo';

export default async function Hero() {
  const t = await getTranslations('hero');
  return (
    <section className="hero-grid mx-auto max-w-[1180px]">
      <div className="flex items-center gap-4 self-end [grid-area:brand]">
        <Image
          src="/images/app-icon.png"
          alt="Romi"
          width={64}
          height={64}
          className="block h-16 w-16 flex-none rounded-[22.5%]"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[28px] font-bold leading-[34px] tracking-[-0.01em]">Romi</span>
          <span className="text-[15px] leading-5 text-ink-2">{t('eyebrow')}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 self-start [grid-area:text]">
        <h1 className="m-0 text-balance text-[clamp(44px,5.2vw,64px)] font-bold leading-[1.05] tracking-[-0.025em]">
          {t('h1a')}
          {/* icon-orange is 3.6:1 on ground: fine at this size, never for small text. */}
          <span className="block text-icon-orange">{t('h1b')}</span>
        </h1>
        <p className="m-0 max-w-[520px] text-pretty text-[20px] leading-7 text-ink-2">{t('sub')}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <AppStoreButton />
          <span className="text-[15px] leading-5 text-ink-2">{t('note')}</span>
        </div>
      </div>

      <div className="relative flex justify-center [grid-area:phones]">
        <PhoneDuo />
      </div>
    </section>
  );
}
