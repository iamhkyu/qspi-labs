import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "큐스피 코인 (QSPI) - 차원이 다른 AI 기반 코인 탐색기 및 실시간 급등 알림",
  description: "큐스피 코인(QSPI)는 AI 기반으로 급등 가능성 있는 코인을 예측하고, 초보자도 쉽게 시장 흐름을 파악하며, 개인 맞춤형 상승 알림을 제공하는 혁신적인 코인 탐색기입니다.",
  keywords: "큐스피, QSPI, 코인, 암호화폐, 가상자산, 코인 분석, 코인 예측, AI 코인, 급등 코인, 실시간 알림, 코인 투자, 코인 앱, 블록체인",
  authors: [{ name: "QSPI" }],
  openGraph: {
    title: "큐스피 코인 (QSPI) - 차원이 다른 AI 기반 코인 탐색기",
    description: "AI 기반으로 급등 가능성 있는 코인을 예측하고, 초보자도 쉽게 시장 흐름을 파악하며, 개인 맞춤형 상승 알림을 제공하는 혁신적인 코인 탐색기, 큐스피 코인을 경험해보세요.",
    url: "https://qspicoin.com",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  alternates: {
    canonical: "https://qspicoin.com",
    languages: {
      ko: "https://qspicoin.com",
      en: "https://qspicoin.com/en",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-11483991186"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11483991186');
            gtag('config', 'G-94QVN65PLY');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "QSPI",
              url: "https://qspicoin.com",
              logo: "https://qspicoin.com/favicon/apple-touch-icon.png",
            }),
          }}
        />
      </head>
      <body className={`${notoSansKR.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
