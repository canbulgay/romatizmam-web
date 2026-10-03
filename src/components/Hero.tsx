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
          width={72}
          height={72}
          className="block h-[72px] w-[72px] flex-none rounded-[17px] shadow-[0_10px_24px_-10px_rgba(120,50,20,0.5)]"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-serif text-[30px] leading-none">Romi</span>
          <span className="text-[12px] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-muted">
            {t('eyebrow')}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-7 self-start [grid-area:text]">
        <h1 className="m-0 text-balance font-serif text-[clamp(48px,6.4vw,84px)] font-normal leading-none tracking-[-0.02em]">
          {t('h1a')}
          <br />
          <em className="italic text-accent">{t('h1b')}</em>
        </h1>
        <p className="m-0 max-w-[520px] text-pretty text-[19px] leading-[1.55] text-body">
          {t('sub')}
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <AppStoreButton />
          <span className="text-[14px] text-muted">{t('note')}</span>
        </div>
      </div>

      <div className="relative flex justify-center [grid-area:phones]">
        <PhoneDuo />
      </div>
    </section>
  );
}
