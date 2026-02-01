import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "코인 마켓 실험실 | QSPI Coin Labs",
  description:
    "오직 수익에만 집중하는 실험 공간. 공식 수치와는 다른 독자적인 로직을 적용하며, 섹터별 모멘텀과 4·14·54 점수를 실험합니다.",
  keywords:
    "코인 마켓, QSPI Labs, 암호화폐 실험실, 섹터 로드맵, 모멘텀, 반도체, 비트코인, 나스닥, 코인 분석",
  openGraph: {
    title: "코인 마켓 실험실 | QSPI Coin Labs",
    description:
      "오직 수익에만 집중하는 실험 공간. 공식 수치와는 다른 독자적인 로직을 적용합니다.",
    url: "https://qspicoin.com/labs",
    type: "website",
  },
  alternates: {
    canonical: "https://qspicoin.com/labs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "코인 마켓 실험실 | QSPI Coin Labs",
  description:
    "오직 수익에만 집중하는 실험 공간. 공식 수치와는 다른 독자적인 로직을 적용하며 섹터별 모멘텀을 실험합니다.",
  url: "https://qspicoin.com/labs",
  publisher: { "@type": "Organization", name: "QSPI Coin" },
};

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="labs-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
