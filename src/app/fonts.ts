import { DM_Sans, Newsreader } from 'next/font/google';

export const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});
