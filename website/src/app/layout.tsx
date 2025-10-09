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
              setTimeout(() => {
                document.documentElement.style.opacity = '1';
              }, 500);
            `,
          }}
        />
        <Script
          src="https://augmentic-client.augmentic.workers.dev/client.js?site=ankur.com"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
