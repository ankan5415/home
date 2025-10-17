import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `Ankur Boyed`,
  description: "Ankur Boyed's personal website",
  authors: [{ name: "Ankur Boyed" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://ankurboyed.com/" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.style.opacity = '0';
              
              // Fallback timeout in case Augmentic fails to load or apply changes
              setTimeout(() => {
                if (document.documentElement.style.opacity === '0') {
                  console.warn('[Augmentic Fallback] Revealing page after timeout');
                  document.documentElement.style.opacity = '1';
                }
              }, 2000);
            `,
          }}
        />
        <Script src="https://worker.augmentic.workers.dev/script.js?site=b3a291ad-c6af-4d08-865c-61b35319c05d"></Script>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
