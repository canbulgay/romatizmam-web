# Romi web — landing and privacy policy (iteration 1)

Date: 2026-10-03
Status: design approved in chat, awaiting spec review

## Purpose

Romi is an iPhone app: a daily journal for people with rheumatic conditions.
It needs a public website in Turkish and English. The first iteration ships
two pages: a landing page that sends visitors to the App Store, and a privacy
policy page whose URL can be submitted to App Store Connect.

Success means:

- Both pages match the `Romi Minimal.dc.html` design in the claude.ai design
  project `447e8b1a-fda0-486a-ae8a-52147c8d7945`.
- Every page exists in Turkish and English at a stable, indexable URL.
- Turkish is the default language.
- Adding a page or a language later needs no routing changes.

## Scope

In scope:

- Landing page: the hero section only, in the two-phone variant.
- Privacy policy page.
- Shared footer with the language switcher.
- Localized 404 page.
- Metadata, `hreflang`, sitemap and robots.

Out of scope:

- The other landing sections whose copy exists in the design file (features,
  screenshots, report, how it works, FAQ, disclaimer, contact).
- The single-phone hero variant.
- Analytics, contact form, cookie banner.
- Deployment. The site must build cleanly for Vercel, but deploying is not
  part of this iteration.

## Stack

- Next.js, latest stable, App Router, TypeScript, `src/` directory.
- pnpm.
- Tailwind CSS v4.
- `next-intl` for routing, messages and locale-aware navigation.
- Playwright for tests.

## Routing and language

Locales are `tr` (default) and `en`. `next-intl` runs with
`localePrefix: 'as-needed'`, so the default locale has no prefix.

| Page    | Turkish    | English       |
|---------|------------|---------------|
| Landing | `/`        | `/en`         |
| Privacy | `/privacy` | `/en/privacy` |

`/tr` and `/tr/...` redirect to the unprefixed URL.

Language detection:

- The `next-intl` middleware runs on every page request. Static assets,
  `sitemap.xml` and `robots.txt` are excluded by the matcher.
- On an unprefixed URL with no locale cookie, the middleware negotiates
  against `Accept-Language`. An English-preferring browser is redirected to
  the `/en` equivalent. Any other browser gets Turkish.
- A `/en` URL always serves English, whatever the browser or cookie says.
- Using the language switcher stores the choice in the `next-intl` locale
  cookie with a one-year lifetime. On later visits the cookie wins over
  `Accept-Language`.

The middleware file follows the convention of the installed Next.js version:
`src/proxy.ts` on Next.js 16 or later. The implementation plan confirms this
against the installed version's documentation.

## Structure

```
messages/tr.json
messages/en.json
src/i18n/routing.ts              locales, default locale, prefix mode, cookie
src/i18n/request.ts              per-request message loading
src/i18n/navigation.ts           locale-aware Link, useRouter, usePathname
src/proxy.ts                     next-intl middleware
src/config/site.ts               appStoreUrl, siteUrl
src/app/[locale]/layout.tsx      <html lang>, fonts, footer, base metadata
src/app/[locale]/page.tsx        landing
src/app/[locale]/privacy/page.tsx
src/app/[locale]/not-found.tsx
src/app/sitemap.ts
src/app/robots.ts
src/app/globals.css              Tailwind import and theme tokens
src/components/Hero.tsx
src/components/PhoneDuo.tsx
src/components/AppStoreButton.tsx
src/components/Footer.tsx
src/components/LocaleSwitcher.tsx
src/components/PrivacyToc.tsx
public/images/app-icon.png
public/images/screen-today.png
public/images/screen-body.png
```

Component responsibilities:

- `Hero` lays out the brand block, text block and phones. It takes no props
  and reads the `hero` and `store` messages.
- `PhoneDuo` renders the two tilted phone screenshots. It has no text.
- `AppStoreButton` renders the dark two-line App Store link to
  `site.appStoreUrl`.
- `Footer` renders the copyright link, the privacy link and the switcher.
- `LocaleSwitcher` is the only client component. It renders the EN/TR pill
  and navigates to the current pathname in the other locale.
- `PrivacyToc` renders the sticky list of section titles.

Both pages are statically generated for both locales through
`generateStaticParams` and `setRequestLocale`.

## Content

`messages/tr.json` and `messages/en.json` hold only the copy this iteration
renders. The text is copied verbatim from the `I18N` object in the design
file:

- `nav.privacy`
- `store.small`
- `hero.eyebrow`, `hero.h1a`, `hero.h1b`, `hero.sub`, `hero.note`
- `privacy.back`, `privacy.title`, `privacy.updated`, `privacy.intro`,
  `privacy.sections` (11 items, each with `h` and `p`)

New keys that the design does not supply:

| Key                    | tr                                         | en                                      |
|------------------------|--------------------------------------------|-----------------------------------------|
| `meta.title`           | Romi — Romatizmal hastalıklarla yaşam için | Romi — For life with rheumatic disease  |
| `meta.description`     | the value of `hero.sub`                    | the value of `hero.sub`                 |
| `meta.privacyTitle`    | Gizlilik Politikası — Romi                 | Privacy Policy — Romi                   |
| `notFound.title`       | Sayfa bulunamadı                           | Page not found                          |

The 404 page reuses `privacy.back` for its link home.

Section bodies in the privacy policy contain line breaks. They render with
`white-space: pre-line`, as in the design.

`src/config/site.ts` holds two placeholders, to be replaced before launch:

- `appStoreUrl`: `https://apps.apple.com/`
- `siteUrl`: `https://example.com`

## Visual design

The design file is the source of truth for every size, colour, radius,
shadow and rotation. The implementation copies those values.

Theme tokens in `globals.css`:

| Token        | Value     | Use                                   |
|--------------|-----------|---------------------------------------|
| cream        | `#F1E8DC` | page background                       |
| paper        | `#FAF5EC` | switcher background, button text      |
| ink          | `#2A211B` | text, App Store button                |
| body         | `#5E5045` | hero paragraph, footer privacy link   |
| prose        | `#4A3D33` | privacy body text                     |
| muted        | `#8A7A6B` | eyebrow, notes, side list             |
| line         | `#DDD0BE` | borders                               |
| accent       | `#C65F3D` | links, italic headline line           |
| accent-hover | `#A8442A` | link hover                            |
| blush        | `#E8D5C2` | reserved; unused in this iteration    |

Fonts: DM Sans (400, 500, 600, 700) for text and Newsreader (400, 500,
italic 400) for headings, loaded through `next/font/google` and exposed as
CSS variables. Both must include the `latin-ext` subset for Turkish
characters.

Changes from the design file, all deliberate:

- The mobile layout switches with a CSS breakpoint at 900px instead of a
  JavaScript resize listener. Below 900px the hero stacks as brand, phones,
  text.
- The privacy page is a real route instead of the `#privacy` hash.
- Language lives in the URL and a cookie instead of `localStorage`.
- The App Store button hover is CSS.
- The privacy side-list entries are anchor links to their sections. In the
  design they are plain text.
- Images use `next/image`. The two hero screenshots load with priority.

## SEO and metadata

- `<html lang>` is the active locale.
- Each page sets a localized title and description, a canonical URL, and
  `hreflang` alternates for `tr`, `en` and `x-default`. `x-default` points
  at the Turkish URL.
- `sitemap.xml` lists the four URLs with their alternates.
- `robots.txt` allows everything and points at the sitemap.
- The app icon is the favicon.

## Error handling

The site has no data fetching and no forms. The only failure paths are:

- An unknown path renders the localized 404 page.
- An unknown locale segment calls `notFound()`.

## Testing

Playwright runs against the production build (`next build` then
`next start`).

- `/` with `Accept-Language: tr` returns the Turkish landing page with
  `<html lang="tr">`.
- `/` with `Accept-Language: en` redirects to `/en`.
- `/privacy` with `Accept-Language: en` redirects to `/en/privacy`.
- `/en` with `Accept-Language: tr` stays English.
- Clicking TR on `/en/privacy` lands on `/privacy` in Turkish. Reloading `/`
  with `Accept-Language: en` then stays Turkish.
- The privacy page shows 11 sections in each language, and each side-list
  link targets an existing section id.
- The footer privacy link goes to the privacy page in the active locale.
- The App Store button links to `site.appStoreUrl`.
- Each page has `hreflang` links for `tr`, `en` and `x-default`.
- `tr.json` and `en.json` have identical key sets.
- At a 390px viewport the hero has no horizontal overflow.

`next build`, `eslint` and `tsc --noEmit` must pass.

## Risk

The design-project import caps file reads at 256 KB. A screenshot larger
than that cannot be fetched by the tool, and the owner will have to place
the PNG files in `public/images/` by hand.
