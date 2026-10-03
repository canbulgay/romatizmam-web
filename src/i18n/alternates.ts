import { routing, type Locale } from './routing';

type Path = '' | '/privacy' | '/contact';

export function localizedPath(locale: Locale, path: Path): string {
  if (locale === routing.defaultLocale) return path || '/';
  return `/${locale}${path}`;
}

export function alternatesFor(locale: Locale, path: Path) {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      tr: localizedPath('tr', path),
      en: localizedPath('en', path),
      'x-default': localizedPath(routing.defaultLocale, path),
    },
  };
}
