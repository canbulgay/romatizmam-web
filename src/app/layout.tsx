import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Romi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body className="bg-cream text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
