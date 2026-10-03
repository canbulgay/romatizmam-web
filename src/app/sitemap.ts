import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { localizedPath } from '@/i18n/alternates';
import { routing } from '@/i18n/routing';

const abs = (path: string) => `${site.siteUrl}${path === '/' ? '' : path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return (['', '/privacy', '/contact'] as const).flatMap((path) =>
    routing.locales.map((locale) => ({
      url: abs(localizedPath(locale, path)),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, abs(localizedPath(l, path))]),
        ),
      },
    })),
  );
}
