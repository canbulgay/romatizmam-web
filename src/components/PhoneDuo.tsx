import Image from 'next/image';

const frame = 'absolute aspect-[680/1478] overflow-hidden rounded-[13%_/_6%]';
const shot = 'block h-full w-full scale-[1.022] object-cover';

export default function PhoneDuo() {
  return (
    <div
      data-testid="phone-duo"
      className="relative mb-2 aspect-[540/640] w-[min(100%,540px)] desk:mb-10"
    >
      <div
        className={`${frame} right-0 top-10 w-[46%] rotate-[5deg] shadow-[0_30px_60px_-20px_rgba(80,45,25,0.35)]`}
      >
        <Image
          src="/images/screen-body.png"
          alt=""
          width={680}
          height={1474}
          sizes="(min-width: 900px) 250px, 46vw"
          priority
          className={shot}
        />
      </div>
      <div
        className={`${frame} left-[4%] top-0 w-1/2 -rotate-3 shadow-[0_40px_80px_-24px_rgba(80,45,25,0.45)]`}
      >
        <Image
          src="/images/screen-today.png"
          alt=""
          width={680}
          height={1478}
          sizes="(min-width: 900px) 270px, 50vw"
          priority
          className={shot}
        />
      </div>
    </div>
  );
}
