import Image from 'next/image';
import { getLocale } from 'next-intl/server';

// The screenshots are cream on a cream page, so a dark bezel sets them apart
// instead of a shadow (the design system keeps shadows off).
const frame = 'absolute aspect-[680/1478] rounded-[13%_/_6%] bg-ink p-[1.2%]';
const screen = 'h-full w-full overflow-hidden rounded-[11.5%_/_5.3%]';
const shot = 'block h-full w-full object-cover';

// The app's own screens in the page's language.
const shots: Record<string, { today: string; body: string }> = {
  tr: { today: '/images/screen-today-tr.png', body: '/images/screen-body-tr.png' },
  en: { today: '/images/screen-today-en.png', body: '/images/screen-body-en.png' },
};

export default async function PhoneDuo() {
  const locale = await getLocale();
  const { today, body } = shots[locale] ?? shots.en;
  return (
    // Sized by the parent size container: as large as fits its width and height.
    <div
      data-testid="phone-duo"
      className="relative aspect-[540/640] w-[min(100cqw,calc(100cqh*540/640),540px)]"
    >
      <div className={`${frame} right-0 top-[6%] w-[46%] rotate-[5deg]`}>
        <div className={screen}>
          <Image
            src={body}
            alt=""
            width={680}
            height={1478}
            sizes="(min-width: 900px) 250px, 46vw"
            loading="eager"
            className={shot}
          />
        </div>
      </div>
      <div className={`${frame} left-[4%] top-0 w-1/2 -rotate-3`}>
        <div className={screen}>
          <Image
            src={today}
            alt=""
            width={680}
            height={1478}
            sizes="(min-width: 900px) 270px, 50vw"
            preload
            className={shot}
          />
        </div>
      </div>
    </div>
  );
}
