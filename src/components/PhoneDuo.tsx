import Image from 'next/image';

// The screenshots are cream on a cream page, so a dark bezel sets them apart
// instead of a shadow (the design system keeps shadows off).
const frame = 'absolute aspect-[680/1478] rounded-[13%_/_6%] bg-ink p-[1.2%]';
const screen = 'h-full w-full overflow-hidden rounded-[11.5%_/_5.3%]';
const shot = 'block h-full w-full scale-[1.022] object-cover';

export default function PhoneDuo() {
  return (
    <div
      data-testid="phone-duo"
      className="relative mb-2 aspect-[540/640] w-[min(100%,540px)] desk:mb-10"
    >
      <div className={`${frame} right-0 top-10 w-[46%] rotate-[5deg]`}>
        <div className={screen}>
          <Image
            src="/images/screen-body.png"
            alt=""
            width={680}
            height={1474}
            sizes="(min-width: 900px) 250px, 46vw"
            loading="eager"
            className={shot}
          />
        </div>
      </div>
      <div className={`${frame} left-[4%] top-0 w-1/2 -rotate-3`}>
        <div className={screen}>
          <Image
            src="/images/screen-today.png"
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
