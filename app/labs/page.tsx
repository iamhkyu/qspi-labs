"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bitcoin,
  ChartNoAxesCombined,
  CircleEllipsis,
  Construction,
  Cpu,
  Droplets,
  Factory,
  Flame,
  Globe,
  Landmark,
  Moon,
  Route,
  Sigma,
  Sprout,
  Sun,
} from "lucide-react";
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
  { labelKo: RoadStatus; labelEn: string; tone: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  고속도로: { labelKo: "고속도로", labelEn: "Express", tone: "indigo", Icon: Route },
  국도: { labelKo: "국도", labelEn: "National", tone: "violet", Icon: CircleEllipsis },
  공사중: { labelKo: "공사중", labelEn: "Construction", tone: "fuchsia", Icon: Construction },
};

const T = {
  ko: {
    title: "코인 마켓 실험실",
    subtitle:
      "오직 수익에만 집중하는 실험 공간으로 공식 수치와는 다른 독자적인 로직을 적용하며 실험 성과에 따라 예고 없이 종료될 수 있습니다.",
    currentStatus: "현재 상태",
    scoreLabel: "4 / 14 / 54 점수",
    sortRule: "정렬 규칙",
    sortRuleDesc:
      "상태 우선(고속도로 > 국도 > 공사중), 다음으로 4·14·54 가중 합산 모멘텀 순으로 정렬됩니다.",
    realtime: "실시간",
    homeLink: "홈으로 이동",
    copyright: "Copyright © QSPI Coin. All rights reserved.",
  },
  en: {
    title: "Coin Market Lab",
    subtitle:
      "An experimental space focused solely on profits. We apply our own logic different from official figures and may discontinue without notice depending on experimental results.",
    currentStatus: "Status",
    scoreLabel: "4 / 14 / 54 scores",
    sortRule: "Sort rules",
    sortRuleDesc:
      "Status first (Express > National > Construction), then by weighted 4·14·54 momentum.",
    realtime: "Live",
    homeLink: "Back to Home",
    copyright: "Copyright © QSPI Coin. All rights reserved.",
  },
};

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
  { id: "nasdaq", nameKo: "나스닥", nameEn: "Nasdaq", icon: ChartNoAxesCombined, byMode: { fast: { status: "고속도로", scores: { s4: 78, s14: 66, s54: 58 } }, normal: { status: "국도", scores: { s4: 64, s14: 70, s54: 62 } }, stable: { status: "고속도로", scores: { s4: 52, s14: 68, s54: 76 } } } },
  { id: "bitcoin", nameKo: "비트코인", nameEn: "Bitcoin", icon: Bitcoin, byMode: { fast: { status: "고속도로", scores: { s4: 86, s14: 61, s54: 49 } }, normal: { status: "국도", scores: { s4: 68, s14: 64, s54: 56 } }, stable: { status: "공사중", scores: { s4: 44, s14: 57, s54: 64 } } } },
  { id: "semiconductor", nameKo: "반도체", nameEn: "Semiconductor", icon: Cpu, byMode: { fast: { status: "국도", scores: { s4: 62, s14: 72, s54: 67 } }, normal: { status: "고속도로", scores: { s4: 74, s14: 76, s54: 63 } }, stable: { status: "고속도로", scores: { s4: 58, s14: 70, s54: 78 } } } },
  { id: "ethereum", nameKo: "이더리움", nameEn: "Ethereum", icon: Sigma, byMode: { fast: { status: "국도", scores: { s4: 60, s14: 58, s54: 55 } }, normal: { status: "국도", scores: { s4: 56, s14: 63, s54: 61 } }, stable: { status: "고속도로", scores: { s4: 48, s14: 60, s54: 73 } } } },
  { id: "ai", nameKo: "AI/클라우드", nameEn: "AI/Cloud", icon: Flame, byMode: { fast: { status: "고속도로", scores: { s4: 82, s14: 69, s54: 59 } }, normal: { status: "국도", scores: { s4: 67, s14: 71, s54: 65 } }, stable: { status: "국도", scores: { s4: 54, s14: 66, s54: 74 } } } },
  { id: "energy", nameKo: "에너지", nameEn: "Energy", icon: Droplets, byMode: { fast: { status: "공사중", scores: { s4: 41, s14: 52, s54: 61 } }, normal: { status: "국도", scores: { s4: 53, s14: 60, s54: 67 } }, stable: { status: "고속도로", scores: { s4: 47, s14: 58, s54: 79 } } } },
  { id: "defense", nameKo: "방산", nameEn: "Defense", icon: Factory, byMode: { fast: { status: "국도", scores: { s4: 58, s14: 66, s54: 70 } }, normal: { status: "고속도로", scores: { s4: 69, s14: 73, s54: 71 } }, stable: { status: "고속도로", scores: { s4: 55, s14: 68, s54: 82 } } } },
  { id: "finance", nameKo: "금융", nameEn: "Finance", icon: Landmark, byMode: { fast: { status: "공사중", scores: { s4: 38, s14: 49, s54: 63 } }, normal: { status: "국도", scores: { s4: 51, s14: 61, s54: 68 } }, stable: { status: "고속도로", scores: { s4: 46, s14: 59, s54: 80 } } } },
  { id: "emerging", nameKo: "신흥국", nameEn: "Emerging", icon: Globe, byMode: { fast: { status: "국도", scores: { s4: 55, s14: 57, s54: 60 } }, normal: { status: "국도", scores: { s4: 52, s14: 62, s54: 64 } }, stable: { status: "고속도로", scores: { s4: 45, s14: 58, s54: 77 } } } },
  { id: "green", nameKo: "친환경", nameEn: "Green", icon: Sprout, byMode: { fast: { status: "공사중", scores: { s4: 36, s14: 50, s54: 66 } }, normal: { status: "국도", scores: { s4: 49, s14: 59, s54: 70 } }, stable: { status: "국도", scores: { s4: 43, s14: 56, s54: 78 } } } },
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

function ScoreRow({
  label,
  value,
  tone,
  theme,
}: {
  label: string;
  value: number;
  tone: "indigo" | "violet" | "fuchsia" | "lavender";
  theme: Theme;
}) {
  const barColor =
    tone === "indigo" ? "from-indigo-500/55 to-indigo-300/30"
    : tone === "violet" ? "from-violet-500/55 to-violet-300/30"
    : tone === "fuchsia" ? "from-fuchsia-500/55 to-fuchsia-300/30"
    : "from-violet-400/45 to-fuchsia-300/25";

  const trackBg = theme === "dark" ? "bg-slate-800/80" : "bg-slate-200";
  const labelClr = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const valueClr = theme === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <div className="grid grid-cols-[52px_1fr_42px] items-center gap-3">
      <div className={`text-[11px] tracking-wide ${labelClr}`}>{label}</div>
      <div className={`relative h-2.5 overflow-hidden rounded-full ${trackBg} ring-1 ring-black/5`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: scoreToPct(value) }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        />
      </div>
      <div className={`text-right text-[11px] tabular-nums ${valueClr}`}>{value}</div>
    </div>
  );
}

export default function LabsMarketRoadmapPage() {
  const [mode, setMode] = useState<Mode>("normal");
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("ko");
  const [exchange, setExchange] = useState<Exchange>("upbit");
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
  const isDark = theme === "dark";

  const pageBg = isDark ? "bg-slate-950" : "bg-slate-50";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
  const cardBg = isDark ? "bg-white/5" : "bg-white";
  const cardRing = isDark ? "ring-white/10" : "ring-slate-200/80";
  const cardShadow = isDark ? "" : "shadow-lg shadow-slate-200/50";
  const controlBg = isDark ? "bg-white/5" : "bg-white/80";
  const controlRing = isDark ? "ring-white/10" : "ring-slate-200/80";

  return (
    <div className={`min-h-dvh ${pageBg} ${textPrimary} transition-colors duration-300`}>
      <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className={`text-balance text-2xl font-semibold tracking-tight sm:text-3xl ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                {t.title}
              </h1>
              <p className={`max-w-2xl text-sm leading-6 ${textSecondary}`}>
                {t.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-2">
              <div className="flex items-center gap-1 rounded-xl border border-slate-200/60 bg-white/90 p-1 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${theme === "light" ? "bg-slate-200/80 text-slate-800 dark:bg-white/10 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                  title="Light"
                  aria-label="Light theme"
                >
                  <Sun className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${theme === "dark" ? "bg-slate-700/80 text-white dark:bg-white/10 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                  title="Dark"
                  aria-label="Dark theme"
                >
                  <Moon className="h-4 w-4" />
                </button>
              </div>

              <div className={`rounded-xl ${controlBg} px-2 py-1 ring-1 ${controlRing} backdrop-blur`}>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Lang)}
                  className={`bg-transparent text-sm font-medium outline-none ${isDark ? "text-slate-200" : "text-slate-700"}`}
                  aria-label="Language"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className={`rounded-xl ${controlBg} px-3 py-2 ring-1 ${controlRing} backdrop-blur`}>
                <select
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value as Exchange)}
                  className={`bg-transparent text-sm font-medium outline-none ${isDark ? "text-slate-200" : "text-slate-700"}`}
                  aria-label="Exchange"
                >
                  <option value="upbit">{EXCHANGE_LABEL.upbit[lang]}</option>
                  <option value="binance">{EXCHANGE_LABEL.binance[lang]}</option>
                  <option value="bithumb">{EXCHANGE_LABEL.bithumb[lang]}</option>
                </select>
              </div>

              <div className={`relative grid grid-cols-3 rounded-2xl ${controlBg} p-1 ring-1 ${controlRing} backdrop-blur`}>
                <motion.div
                  className={`absolute inset-y-1 w-1/3 rounded-xl ${isDark ? "bg-white/10" : "bg-slate-200/80"} ring-1 ${isDark ? "ring-white/10" : "ring-slate-300/50"}`}
                  initial={false}
                  animate={{ x: mode === "fast" ? "0%" : mode === "normal" ? "100%" : "200%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
                {(["fast", "normal", "stable"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={[
                      "relative z-10 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors",
                      isDark ? "text-slate-300 hover:text-slate-50" : "text-slate-600 hover:text-slate-900",
                      mode === m ? (isDark ? "text-slate-50" : "text-slate-900") : "",
                    ].join(" ")}
                  >
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ring-1 ${isDark ? "bg-black/20 ring-white/10" : "bg-slate-100 ring-slate-200/60"}`}>
                      {m === "fast" ? <Flame className="h-4 w-4 text-fuchsia-500" /> : m === "normal" ? <Route className="h-4 w-4 text-slate-500" /> : <Construction className="h-4 w-4 text-violet-500" />}
                    </span>
                    {MODE_LABEL[m][lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="mt-10">
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <AnimatePresence mode="popLayout">
              {ordered.map((sector) => {
                const { status, scores } = sector.byMode[mode];
                const meta = STATUS_META[status];
                const Icon = sector.icon;
                const StatusIcon = meta.Icon;
                const sectorName = lang === "ko" ? sector.nameKo : sector.nameEn;
                const statusLabel = lang === "ko" ? meta.labelKo : meta.labelEn;

                return (
                  <motion.section
                    key={`${mode}:${sector.id}`}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className={`group relative overflow-hidden rounded-2xl p-5 ring-1 backdrop-blur ${cardBg} ${cardRing} ${cardShadow}`}
                  >
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${isDark ? "bg-black/20 ring-white/10" : "bg-slate-100 ring-slate-200/60"}`}>
                            <Icon className={`h-5 w-5 ${isDark ? "text-slate-100" : "text-slate-700"}`} />
                          </span>
                          <h2 className={`truncate text-base font-semibold tracking-tight ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            {sectorName}
                          </h2>
                          {sector.id === "semiconductor" && labsScore != null && (
                            <span className="inline-flex items-center rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-600 ring-1 ring-emerald-400/30 dark:text-emerald-300">
                              {t.realtime}
                            </span>
                          )}
                        </div>
                        <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ring-1 ${isDark ? "bg-black/20 text-slate-200 ring-white/10" : "bg-slate-100 text-slate-700 ring-slate-200/60"}`}>
                          <StatusIcon className={`h-3.5 w-3.5 ${meta.tone === "indigo" ? "text-indigo-400" : meta.tone === "violet" ? "text-violet-400" : "text-fuchsia-400"}`} />
                          <span className={textSecondary}>{t.currentStatus}</span>
                          <span className={`font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>{statusLabel}</span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 sm:flex">
                        <div className={`rounded-xl px-3 py-2 text-right ring-1 ${isDark ? "bg-black/20 ring-white/10" : "bg-slate-100 ring-slate-200/60"}`}>
                          <div className={`text-[10px] uppercase tracking-wider ${textSecondary}`}>Momentum</div>
                          <div className={`mt-0.5 text-sm font-semibold tabular-nums ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            {Math.round(weightedMomentum(scores))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`text-xs font-medium ${textSecondary}`}>{t.scoreLabel}</div>
                        <div className="text-[11px] text-slate-500">0–100</div>
                      </div>
                      <ScoreRow label="4" value={scores.s4} tone={meta.tone === "indigo" ? "indigo" : meta.tone === "violet" ? "lavender" : "fuchsia"} theme={theme} />
                      <ScoreRow label="14" value={scores.s14} tone="violet" theme={theme} />
                      <ScoreRow label="54" value={scores.s54} tone="lavender" theme={theme} />
                    </div>
                  </motion.section>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <div className={`mt-8 rounded-2xl p-5 text-sm ring-1 ${cardBg} ${cardRing} ${cardShadow}`}>
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${isDark ? "bg-black/20 ring-white/10" : "bg-slate-100 ring-slate-200/60"}`}>
                <CircleEllipsis className={`h-4 w-4 ${textSecondary}`} />
              </div>
              <div className="space-y-1">
                <div className={`font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>{t.sortRule}</div>
                <div className={`leading-6 ${textSecondary}`}>{t.sortRuleDesc}</div>
              </div>
            </div>
          </div>
        </main>

        <footer className={`mt-16 border-t pt-8 ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <a
              href="https://qspicoin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium transition-colors hover:underline ${isDark ? "text-slate-300 hover:text-slate-100" : "text-slate-600 hover:text-slate-900"}`}
            >
              {t.homeLink}
            </a>
            <p className={`text-xs ${textSecondary}`}>{t.copyright}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
