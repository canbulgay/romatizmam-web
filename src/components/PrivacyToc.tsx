import { Link } from '@/i18n/navigation';

export default function PrivacyToc({
  back,
  sections,
}: {
  back: string;
  sections: { id: string; h: string }[];
}) {
  return (
    <aside className="flex desk:sticky desk:top-24 max-w-[260px] flex-[1_1_220px] flex-col gap-2.5 self-start">
      <Link href="/" className="mb-3 text-[14px] font-semibold">
        {back}
      </Link>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="text-[14px] leading-[1.4] text-muted hover:text-ink"
        >
          {s.h}
        </a>
      ))}
    </aside>
  );
}
