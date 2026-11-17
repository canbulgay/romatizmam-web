'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const order = ['en', 'tr'] as const;

export default function LocaleSwitcher() {
  const active = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Language"
      className="ml-auto flex gap-1 rounded-full bg-card p-1"
    >
      {order.map((locale) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            aria-current={isActive ? 'true' : undefined}
            className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${
              isActive
                ? 'bg-ink text-card hover:text-card'
                : 'bg-transparent text-ink-2 hover:text-ink'
            }`}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
