import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

const load = (locale: string) =>
  JSON.parse(readFileSync(join(process.cwd(), 'messages', `${locale}.json`), 'utf8'));

test('tr and en messages have identical keys', () => {
  expect(keyPaths(load('tr')).sort()).toEqual(keyPaths(load('en')).sort());
});

test('both locales have 11 privacy sections', () => {
  expect(load('tr').privacy.sections).toHaveLength(11);
  expect(load('en').privacy.sections).toHaveLength(11);
});
