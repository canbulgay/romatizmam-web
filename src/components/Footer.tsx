import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';

export default async function Footer() {
  const t = await getTranslations('nav');
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-7 gap-y-4 px-6 py-5 text-[14px] text-muted">
        <a
          href="https://canbulgay.com"
          target="_blank"
          rel="noopener"
          className="text-muted"
        >
          © 2026 canbulgay.com
        </a>
        <Link href="/privacy" className="text-body">
          {t('privacy')}
        </Link>
        <LocaleSwitcher />
      </div>
    </footer>
  );
}
