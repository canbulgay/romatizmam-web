import { getTranslations } from 'next-intl/server';
import { site } from '@/config/site';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';

export default async function Footer() {
  const t = await getTranslations('nav');
  return (
    <footer className="border-t border-separator">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 text-[13px] text-ink-2 desk:gap-x-7 desk:px-6 desk:py-5 desk:text-[15px]">
        <a
          href={site.developerUrl}
          target="_blank"
          rel="noopener"
          className="text-ink-2"
        >
          © 2026 canbulgay.com
        </a>
        <Link href="/privacy" className="text-ink">
          {t('privacy')}
        </Link>
        <Link href="/contact" className="text-ink">
          {t('contact')}
        </Link>
        <LocaleSwitcher />
      </div>
    </footer>
  );
}
