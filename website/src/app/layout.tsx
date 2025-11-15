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
        <Script
          id="keak-script"
          src="https://zzontar2hsjaawcn.public.blob.vercel-storage.com/scripts/domain-450-httpsankurboyed.com.js"
          data-domain="450"
          strategy="afterInteractive"
        />
        <Script src="http://localhost:8787/script.js?site=34cc25ec-cd7b-43e6-b8f7-ea8cef7ae19c"></Script>
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
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
