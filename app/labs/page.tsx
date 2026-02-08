"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bitcoin,
  ChevronRight,
  CircleEllipsis,
  Cpu,
  FlaskConical,
  Moon,
  Sun,
  X,
  Settings,
  Construction,
  Flame,
  Route,
  Sigma,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLabsScore } from "@/lib/useLabsScore";

type Mode = "fast" | "normal" | "stable";
type RoadStatus = "고속도로" | "국도" | "공사중";
type Theme = "light" | "dark";
type Lang = "ko" | "en";
type Exchange = "upbit" | "binance" | "bithumb";

type Scores = { s4: number; s14: number; s54: number };
type Sector = {
  id: string;
  nameKo: string;
  nameEn: string;
  icon: React.ComponentType<{ className?: string }>;
  byMode: Record<Mode, { status: RoadStatus; scores: Scores }>;
};

const THEME_COLORS = {
  light: {
    bg: "rgb(248, 250, 252)",
    panel: "rgb(255, 255, 255)",
    primary1: "rgb(99, 102, 241)",
    primary2: "rgb(139, 92, 246)",
    primary1Muted: "rgba(99, 102, 241, 0.1)",
    primary2Muted: "rgba(139, 92, 246, 0.1)",
    text: "rgb(15, 23, 42)",
    textMuted: "rgb(100, 116, 139)",
    trackBg: "rgba(0, 0, 0, 0.06)",
    subtleBg: "rgba(0, 0, 0, 0.04)",
    controlBg: "rgba(0, 0, 0, 0.05)",
  },
  dark: {
    bg: "rgb(23, 23, 28)",
    panel: "rgb(32, 32, 38)",
    primary1: "rgb(139, 92, 246)",
    primary2: "rgb(167, 139, 250)",
    primary1Muted: "rgba(139, 92, 246, 0.12)",
    primary2Muted: "rgba(167, 139, 250, 0.08)",
    text: "rgb(250, 250, 250)",
    textMuted: "rgb(161, 161, 170)",
    trackBg: "rgba(255, 255, 255, 0.06)",
    subtleBg: "rgba(255, 255, 255, 0.06)",
    controlBg: "rgba(255, 255, 255, 0.08)",
  },
};

const MODE_LABEL: Record<Mode, { ko: string; en: string }> = {
  fast: { ko: "Fast", en: "Fast" },
  normal: { ko: "Normal", en: "Normal" },
  stable: { ko: "Stable", en: "Stable" },
};

const EXCHANGE_LABEL: Record<Exchange, { ko: string; en: string }> = {
  upbit: { ko: "Upbit", en: "Upbit" },
  binance: { ko: "Binance", en: "Binance" },
  bithumb: { ko: "Bithumb", en: "Bithumb" },
};

const STATUS_META: Record<
  RoadStatus,
  { labelKo: RoadStatus; labelEn: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  고속도로: { labelKo: "고속도로", labelEn: "Express", Icon: Route },
  국도: { labelKo: "국도", labelEn: "National", Icon: CircleEllipsis },
  공사중: { labelKo: "공사중", labelEn: "Construction", Icon: Construction },
};

const T = {
  ko: {
    title: "크립토 마켓 실험실",
    subtitle: "오직 수익에만 집중하는 실험 공간으로 공식 수치와는 다른 독자적인 로직을 적용하며 실험 성과에 따라 예고 없이 종료될 수 있습니다.",
    marketRoadmap: "마켓 로드맵",
    coinWeather: "코인 날씨",
    recentSurge: "최근 급등",
    currentStatus: "현재 상태",
    scoreLabel: "4 / 14 / 54 점수",
    realtime: "실시간",
    homeLink: "홈으로 이동",
    copyright: "Copyright © QSPI Coin. All rights reserved.",
    settings: "설정",
    theme: "테마",
    language: "언어",
    exchange: "거래소",
  },
  en: {
    title: "Crypto Market Lab",
    subtitle: "An experimental space focused solely on profits. We apply our own logic different from official figures and may discontinue without notice depending on experimental results.",
    marketRoadmap: "Market Roadmap",
    coinWeather: "Coin Weather",
    recentSurge: "Recent Surge",
    currentStatus: "Status",
    scoreLabel: "4 / 14 / 54 scores",
    realtime: "Live",
    homeLink: "Back to Home",
    copyright: "Copyright © QSPI Coin. All rights reserved.",
    settings: "Settings",
    theme: "Theme",
    language: "Language",
    exchange: "Exchange",
  },
};

type WeatherType = "clear" | "sunny" | "cloudy" | "overcast" | "storm";

const WEATHER_META: Record<
  WeatherType,
  { emoji: string; labelKo: string; labelEn: string; descKo: string; descEn: string }
> = {
  clear: { emoji: "☀️", labelKo: "쾌청 (매우 강함)", labelEn: "Clear (Very strong)", descKo: "완벽한 정배열 + 이격도 확대 + 모든 선 상향", descEn: "Perfect alignment + gap expansion + all lines up" },
  sunny: { emoji: "🌤️", labelKo: "맑음 (안정적)", labelEn: "Sunny (Stable)", descKo: "정배열 유지 중이며 단기 선이 지지를 받음", descEn: "Alignment maintained, short-term line supported" },
  cloudy: { emoji: "☁️", labelKo: "구름 (수렴 중)", labelEn: "Cloudy (Converging)", descKo: "배열은 유지하나 선들이 모이며 횡보 중", descEn: "Lines converging, sideways movement" },
  overcast: { emoji: "🌦️", labelKo: "흐림 (추세 약화)", labelEn: "Overcast (Trend weakening)", descKo: "단기 선이 중기 선을 하향 돌파하기 직전", descEn: "Short-term line about to break below mid-term" },
  storm: { emoji: "⛈️", labelKo: "폭풍 (역배열)", labelEn: "Storm (Inverted)", descKo: "완전한 역배열 상태 (하락 추세 강함)", descEn: "Full inversion (strong downtrend)" },
};

const COIN_WEATHER = [
  { coin: "비트코인", coinEn: "Bitcoin", weather: "clear" as WeatherType },
  { coin: "이더리움", coinEn: "Ethereum", weather: "sunny" as WeatherType },
  { coin: "리플", coinEn: "Ripple", weather: "cloudy" as WeatherType },
  { coin: "솔라나", coinEn: "Solana", weather: "overcast" as WeatherType },
  { coin: "도지", coinEn: "Dogecoin", weather: "storm" as WeatherType },
];

const SURGE_DATA = [
  { day: -7, label: "7일 전", coin: "비트코인", coinEn: "Bitcoin", pct: 2 },
  { day: -6, label: "6일 전", coin: "이더리움", coinEn: "Ethereum", pct: 9 },
  { day: -5, label: "5일 전", coin: "리플", coinEn: "Ripple", pct: 11 },
  { day: -4, label: "4일 전", coin: "솔라나", coinEn: "Solana", pct: 15 },
  { day: -3, label: "3일 전", coin: "도지", coinEn: "Dogecoin", pct: 5 },
  { day: -2, label: "2일 전", coin: "비트코인", coinEn: "Bitcoin", pct: 4 },
  { day: -1, label: "1일 전", coin: "이더리움", coinEn: "Ethereum", pct: 8 },
];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function scoreToPct(score: number) {
  return `${Math.round(clamp01(score / 100) * 100)}%`;
}

function weightedMomentum(scores: Scores) {
  return scores.s4 * 0.5 + scores.s14 * 0.33 + scores.s54 * 0.17;
}

const SECTORS: Sector[] = [
  { id: "bitcoin", nameKo: "비트코인", nameEn: "Bitcoin", icon: Bitcoin, byMode: { fast: { status: "고속도로", scores: { s4: 86, s14: 61, s54: 49 } }, normal: { status: "국도", scores: { s4: 68, s14: 64, s54: 56 } }, stable: { status: "공사중", scores: { s4: 44, s14: 57, s54: 64 } } } },
  { id: "semiconductor", nameKo: "반도체", nameEn: "Semiconductor", icon: Cpu, byMode: { fast: { status: "국도", scores: { s4: 62, s14: 72, s54: 67 } }, normal: { status: "고속도로", scores: { s4: 74, s14: 76, s54: 63 } }, stable: { status: "고속도로", scores: { s4: 58, s14: 70, s54: 78 } } } },
  { id: "ethereum", nameKo: "이더리움", nameEn: "Ethereum", icon: Sigma, byMode: { fast: { status: "국도", scores: { s4: 60, s14: 58, s54: 55 } }, normal: { status: "국도", scores: { s4: 56, s14: 63, s54: 61 } }, stable: { status: "고속도로", scores: { s4: 48, s14: 60, s54: 73 } } } },
];

function applyLabsScoreToSectors(sectors: Sector[], score: number | null): Sector[] {
  if (score == null) return sectors;
  const semi = sectors.find((s) => s.id === "semiconductor");
  if (!semi) return sectors;
  const clone = [...sectors];
  const idx = clone.findIndex((s) => s.id === "semiconductor");
  if (idx < 0) return sectors;
  const scores: Scores = { s4: score, s14: score, s54: score };
  const byMode = { fast: { status: "고속도로" as RoadStatus, scores }, normal: { status: "고속도로" as RoadStatus, scores }, stable: { status: "고속도로" as RoadStatus, scores } };
  clone[idx] = { ...semi, byMode };
  return clone;
}

function ScoreRow({ label, value, colors }: { label: string; value: number; colors: typeof THEME_COLORS.light }) {
  const pct = Math.round(clamp01(value / 100) * 100);
  return (
    <div className="grid grid-cols-[minmax(72px,auto)_minmax(0,1fr)_32px] items-center gap-2">
      <div className="text-[11px] tracking-wide whitespace-nowrap" style={{ color: colors.textMuted }}>{label}</div>
      <div className="relative h-2 overflow-hidden rounded-full" style={{ background: colors.trackBg }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${colors.primary1}, ${colors.primary2})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        />
      </div>
      <div className="text-right text-[11px] tabular-nums" style={{ color: colors.textMuted }}>{value}</div>
    </div>
  );
}


export default function LabsMarketRoadmapPage() {
  const [mode, setMode] = useState<Mode>("normal");
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("ko");
  const [exchange, setExchange] = useState<Exchange>("upbit");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { score: labsScore } = useLabsScore();

  useEffect(() => {
    const stored = localStorage.getItem("labs-theme") as Theme | null;
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("labs-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === "ko" ? "ko" : "en";
  }, [lang]);

  const sectors = useMemo(() => applyLabsScoreToSectors(SECTORS, labsScore), [labsScore]);

  const ordered = useMemo(() => {
    const statusRank: Record<RoadStatus, number> = { 고속도로: 3, 국도: 2, 공사중: 1 };
    return [...sectors].sort((a, b) => {
      const A = a.byMode[mode];
      const B = b.byMode[mode];
      const r1 = statusRank[B.status] - statusRank[A.status];
      if (r1 !== 0) return r1;
      return weightedMomentum(B.scores) - weightedMomentum(A.scores);
    });
  }, [mode, sectors]);

  const t = T[lang];
  const colors = THEME_COLORS[theme];

  const surgeMaxVal = Math.max(...SURGE_DATA.map((d) => d.pct), 0);
  const surgeYMax = surgeMaxVal + 5;
  const surgeYMin = 0;

  return (
    <div
      className="min-h-dvh transition-colors duration-300"
      style={{ background: colors.bg, color: colors.text }}
    >
      <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="flex items-center gap-2 text-balance text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: colors.text }}>
                <FlaskConical className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" style={{ color: colors.primary1 }} />
                {t.title}
              </h1>
              <p className="max-w-2xl text-sm leading-6" style={{ color: colors.textMuted }}>
                {t.subtitle}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:ml-0">
              <div
                className="relative grid grid-cols-3 rounded-2xl p-1"
                style={{ background: colors.controlBg || colors.subtleBg }}
              >
                <motion.div
                  className="absolute inset-y-1 w-1/3 rounded-xl"
                  style={{ background: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)" }}
                  initial={false}
                  animate={{ x: mode === "fast" ? "0%" : mode === "normal" ? "100%" : "200%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
                {(["fast", "normal", "stable"] as const).map((m) => {
                  const isSelected = mode === m;
                  const iconColor = theme === "dark" && isSelected ? "rgb(255,255,255)" : theme === "light" && isSelected ? "rgb(0,0,0)" : isSelected ? colors.primary1 : colors.textMuted;
                  const textColor = theme === "dark" && isSelected ? "rgb(255,255,255)" : theme === "light" && isSelected ? "rgb(0,0,0)" : isSelected ? colors.primary1 : colors.textMuted;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className="relative z-10 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors hover:opacity-90"
                      style={{ color: textColor }}
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: colors.subtleBg, color: iconColor }}>
                        {m === "fast" ? <Flame className="h-4 w-4" /> : m === "normal" ? <Route className="h-4 w-4" /> : <Construction className="h-4 w-4" />}
                      </span>
                      {MODE_LABEL[m][lang]}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl transition-opacity hover:opacity-80"
                style={{ background: colors.controlBg || colors.subtleBg, color: colors.primary1 }}
                aria-label={t.settings}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="mt-10 space-y-8">
          {/* 마켓 로드맵 */}
          <section>
            <Link href="/labs/market-roadmap" className="mb-4 flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
              <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
                {t.marketRoadmap}
              </h2>
              <ChevronRight className="h-5 w-5 shrink-0" style={{ color: colors.primary1 }} />
            </Link>
            <motion.div
              layout
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <AnimatePresence mode="popLayout">
                {ordered.map((sector) => {
                  const { scores } = sector.byMode[mode];
                  const Icon = sector.icon;
                  const sectorName = lang === "ko" ? sector.nameKo : sector.nameEn;

                  return (
                    <motion.section
                      key={`${mode}:${sector.id}`}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className="group relative overflow-hidden rounded-2xl p-5"
                      style={{ background: colors.panel, boxShadow: theme === "light" ? "0 4px 20px rgba(0,0,0,0.06)" : "0 4px 20px rgba(0,0,0,0.2)" }}
                    >
                      <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: colors.controlBg || colors.subtleBg, color: colors.primary1 }}>
                              <Icon className="h-5 w-5" />
                            </span>
                            <h2 className="truncate text-base font-semibold tracking-tight" style={{ color: colors.text }}>
                              {sectorName}
                            </h2>
                          </div>
                        </div>
                      <div className="relative mt-4 space-y-4">
                        <div className="rounded-xl p-3" style={{ background: colors.controlBg || colors.subtleBg }}>
                          <div className="flex items-center justify-evenly gap-2">
                            <div>
                              <div className="text-xs" style={{ color: colors.textMuted }}>{lang === "ko" ? "5일간" : "5d"}</div>
                              <div className="text-base font-bold tabular-nums" style={{ color: colors.primary1 }}>20%</div>
                            </div>
                            <div className="h-8 w-px" style={{ background: colors.textMuted, opacity: 0.3 }} />
                            <div>
                              <div className="text-xs" style={{ color: colors.textMuted }}>{lang === "ko" ? "20일간" : "20d"}</div>
                              <div className="text-base font-bold tabular-nums" style={{ color: colors.primary1 }}>24%</div>
                            </div>
                            <div className="h-8 w-px" style={{ background: colors.textMuted, opacity: 0.3 }} />
                            <div>
                              <div className="text-xs" style={{ color: colors.textMuted }}>{lang === "ko" ? "60일간" : "60d"}</div>
                              <div className="text-base font-bold tabular-nums" style={{ color: colors.primary1 }}>30%</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <ScoreRow label={lang === "ko" ? "추세 정렬" : "Trend"} value={78} colors={colors} />
                          <ScoreRow label={lang === "ko" ? "노이즈 프리" : "Noise-free"} value={65} colors={colors} />
                        </div>
                      </div>
                    </motion.section>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* 코인 날씨 | 최근 급등 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 코인 날씨 */}
            <section>
              <Link href="/labs/coin-weather" className="mb-4 flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
                <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
                  {t.coinWeather}
                </h2>
                <ChevronRight className="h-5 w-5 shrink-0" style={{ color: colors.primary1 }} />
              </Link>
              <div
                className="overflow-hidden rounded-2xl"
                style={{ background: colors.panel, boxShadow: theme === "light" ? "0 4px 20px rgba(0,0,0,0.06)" : "0 4px 20px rgba(0,0,0,0.2)" }}
              >
                <table className="w-full">
                  <tbody>
                    {COIN_WEATHER.map((row) => {
                      const meta = WEATHER_META[row.weather];
                      return (
                        <tr
                          key={row.coin}
                          className="border-b last:border-b-0"
                          style={{ borderColor: theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }}
                        >
                          <td className="w-1/2 pl-6 pr-3 py-3 text-left">
                            <span className="font-medium" style={{ color: colors.text }}>
                              {lang === "ko" ? row.coin : row.coinEn}
                            </span>
                          </td>
                          <td className="w-1/2 pl-3 pr-6 py-3 text-left">
                            <span className="text-lg" title={lang === "ko" ? meta.descKo : meta.descEn}>{meta.emoji}</span>
                            <span className="ml-1.5 text-sm" style={{ color: colors.textMuted }}>
                              {lang === "ko" ? meta.labelKo : meta.labelEn}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 최근 급등 */}
            <section>
              <Link href="/labs/recent-surge" className="mb-4 flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
                <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
                  {t.recentSurge}
                </h2>
                <ChevronRight className="h-5 w-5 shrink-0" style={{ color: colors.primary1 }} />
              </Link>
              <div
                className="overflow-hidden rounded-2xl p-5"
                style={{ background: colors.panel, boxShadow: theme === "light" ? "0 4px 20px rgba(0,0,0,0.06)" : "0 4px 20px rgba(0,0,0,0.2)" }}
              >
                <div className="flex h-[220px] items-end gap-2">
                  {SURGE_DATA.map((d, i) => {
                    const barHeightPx = surgeYMax > 0 ? (Math.max(d.pct, 0) / surgeYMax) * 160 : 0;
                    return (
                      <div key={d.day} className="flex flex-1 flex-col items-center">
                        <div className="relative flex w-full flex-1 min-h-[80px] flex-col justify-end">
                          <motion.div
                            className="flex w-full min-h-[24px] items-center justify-center rounded-t"
                            style={{
                              height: barHeightPx,
                              minHeight: d.pct > 0 ? 24 : 0,
                              background: `linear-gradient(180deg, ${colors.primary1}, ${colors.primary2})`,
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: barHeightPx }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                          >
                            {d.pct > 0 && (
                              <span className="text-sm font-semibold tabular-nums text-white drop-shadow-sm">
                                {d.pct}%
                              </span>
                            )}
                          </motion.div>
                        </div>
                        <span className="mt-2 truncate text-[10px]" style={{ color: colors.textMuted }}>
                          {lang === "ko" ? d.coin : d.coinEn}
                        </span>
                        <span className="text-[9px]" style={{ color: colors.textMuted }}>{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className="mt-16 border-t pt-8" style={{ borderColor: theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <a
              href="https://qspicoin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: colors.primary1 }}
            >
              {t.homeLink}
            </a>
            <p className="text-xs" style={{ color: colors.textMuted }}>{t.copyright}</p>
          </div>
        </footer>
      </div>

      {/* 설정 팝업 */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6"
              style={{ background: colors.panel, boxShadow: "0 24px 48px rgba(0,0,0,0.3)" }}
              initial={{ opacity: 0, scale: 0.95, y: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{t.settings}</h3>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-lg p-1 transition-opacity hover:opacity-70"
                  style={{ color: colors.textMuted }}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: colors.textMuted }}>{t.theme}</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${theme === "light" ? "" : "opacity-60"}`}
                      style={{ background: theme === "light" ? (colors.controlBg || colors.subtleBg) : "rgba(0,0,0,0.05)", color: theme === "light" ? colors.primary1 : colors.textMuted }}
                    >
                      <Sun className="h-4 w-4" /> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${theme === "dark" ? "" : "opacity-60"}`}
                      style={{ background: theme === "dark" ? (colors.controlBg || colors.subtleBg) : "rgba(0,0,0,0.05)", color: theme === "dark" ? colors.primary1 : colors.textMuted }}
                    >
                      <Moon className="h-4 w-4" /> Dark
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: colors.textMuted }}>{t.language}</label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                    className="w-full rounded-xl py-2.5 pl-4 pr-10 text-sm font-medium outline-none"
                    style={{ background: colors.controlBg || colors.subtleBg, color: colors.text }}
                  >
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: colors.textMuted }}>{t.exchange}</label>
                  <select
                    value={exchange}
                    onChange={(e) => setExchange(e.target.value as Exchange)}
                    className="w-full rounded-xl py-2.5 pl-4 pr-10 text-sm font-medium outline-none"
                    style={{ background: colors.controlBg || colors.subtleBg, color: colors.text }}
                  >
                    <option value="upbit">{EXCHANGE_LABEL.upbit[lang]}</option>
                    <option value="binance">{EXCHANGE_LABEL.binance[lang]}</option>
                    <option value="bithumb">{EXCHANGE_LABEL.bithumb[lang]}</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
