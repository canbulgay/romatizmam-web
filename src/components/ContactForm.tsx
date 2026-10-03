'use client';

import { useState, type FormEvent } from 'react';

type Labels = {
  topicLabel: string;
  topics: string[];
  nameLabel: string;
  msgLabel: string;
  send: string;
  sendNote: string;
};

const field =
  'rounded-[12px] border border-line bg-[#FFFDF9] px-3.5 py-[13px] text-[16px] text-ink outline-accent';

export default function ContactForm({ email, labels }: { email: string; labels: Labels }) {
  const [topic, setTopic] = useState(0);

  // There is no backend: the message is handed to the visitor's own mail app.
  function sendMail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const message = String(data.get('message') ?? '');
    const subject = `Romi – ${labels.topics[topic]}`;
    const body = message + (name ? `\n\n— ${name}` : '');
    window.open(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_self',
    );
  }

  return (
    <form
      onSubmit={sendMail}
      className="flex min-w-0 max-w-[620px] flex-[1_1_380px] flex-col gap-5 rounded-[20px] border border-line bg-paper p-8"
    >
      <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 p-0 text-[14px] font-semibold">{labels.topicLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {labels.topics.map((label, i) => (
            <label
              key={label}
              className={`cursor-pointer rounded-full border px-4 py-[9px] text-[14px] font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                topic === i ? 'border-ink bg-ink text-paper' : 'border-line bg-transparent text-body'
              }`}
            >
              <input
                type="radio"
                name="topic"
                value={label}
                checked={topic === i}
                onChange={() => setTopic(i)}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2">
        <span className="text-[14px] font-semibold">{labels.nameLabel}</span>
        <input name="name" type="text" autoComplete="name" className={field} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[14px] font-semibold">{labels.msgLabel}</span>
        <textarea name="message" required rows={6} className={`${field} resize-y leading-[1.5]`} />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="cursor-pointer rounded-[14px] border-0 bg-ink px-[26px] py-[15px] text-[16px] font-semibold text-paper hover:bg-black"
        >
          {labels.send}
        </button>
        <span className="flex-[1_1_200px] text-[13px] text-muted">{labels.sendNote}</span>
      </div>
    </form>
  );
}
