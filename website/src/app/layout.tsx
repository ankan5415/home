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

        {/* Preconnect and DNS-prefetch for the external domain */}
        <link rel="preconnect" href="https://d3niuqph2rteir.cloudfront.net" />
        <link rel="dns-prefetch" href="https://d3niuqph2rteir.cloudfront.net" />

        {/* Page Hide Style Script, put right at the top */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){var e="body {opacity: 0 !important;}",t=document.createElement("style");t.type="text/css",t.id="page-hide-style",t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e)),document.head.appendChild(t),window.rmo=function(){var e=document.getElementById("page-hide-style");e&&(e.parentNode.removeChild(e),document.body.style.opacity="")},setTimeout(window.rmo,3e3)}();`,
          }}
        />

        {/* Async Stellar analytics script */}
        <script
          async
          src="https://d3niuqph2rteir.cloudfront.net/client_js/stellar.js?apiKey=027473af6f480db2ea5768042adadec1:ba219cf119b257f3c4d3d8102cdd7ac1bb4fe00b15b33de58204331943810f48"
        />

        {/* Existing augmentic script */}
        <Script
          src="https://staging.worker.augmentic.app/script.js?site=6d1b227b-6ef5-4afd-b556-848b605d6c5c"
          strategy="beforeInteractive"
        ></Script>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
