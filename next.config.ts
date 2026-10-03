import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  experimental: {
    // The root layout lives under [locale], so a regular not-found.tsx is
    // only rendered on the client. global-not-found.tsx is server-rendered.
    globalNotFound: true,
  },
};

export default createNextIntlPlugin()(nextConfig);
