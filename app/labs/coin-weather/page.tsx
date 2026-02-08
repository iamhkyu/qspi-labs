"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_COLORS = {
  light: { bg: "rgb(248, 250, 252)", text: "rgb(15, 23, 42)", textMuted: "rgb(100, 116, 139)", primary1: "rgb(99, 102, 241)" },
  dark: { bg: "rgb(23, 23, 28)", text: "rgb(250, 250, 250)", textMuted: "rgb(161, 161, 170)", primary1: "rgb(139, 92, 246)" },
};

export default function CoinWeatherDetailPage() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("labs-theme") as Theme | null;
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const colors = THEME_COLORS[theme];

  return (
    <div className="min-h-dvh transition-colors duration-300" style={{ background: colors.bg, color: colors.text }}>
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
        <Link
          href="/labs"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: colors.primary1 }}
        >
          <ArrowLeft className="h-4 w-4" />
          실험실로 돌아가기
        </Link>
        <h1 className="mb-4 text-2xl font-bold" style={{ color: colors.text }}>
          코인 날씨 상세
        </h1>
        <p className="text-base" style={{ color: colors.textMuted }}>
          상세 페이지는 준비 중입니다. 추후 코인별 날씨 설명, 역사적 데이터, 추세 분석 등을 제공할 예정입니다.
        </p>
      </div>
    </div>
  );
}
