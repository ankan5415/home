import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";

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
        <link
          rel="preconnect"
          href="https://augmentic-client.augmentic.workers.dev"
        />
        <link
          rel="preload"
          href="https://augmentic-client.augmentic.workers.dev/client.js?site=ankur.com"
          as="script"
        />
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
        <script
          src="https://augmentic-client.augmentic.workers.dev/client.js?site=ankur.com"
          defer
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
