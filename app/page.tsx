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
  Route,
  Sigma,
  Sprout,
} from "lucide-react";
import { useMemo, useState } from "react";

type Mode = "fast" | "normal" | "stable";
type RoadStatus = "고속도로" | "국도" | "공사중";

type Scores = { s4: number; s14: number; s54: number };
type Sector = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  byMode: Record<Mode, { status: RoadStatus; scores: Scores }>;
};

const MODE_LABEL: Record<Mode, string> = {
  fast: "Fast",
  normal: "Normal",
  stable: "Stable",
};

const STATUS_META: Record<
  RoadStatus,
  { label: RoadStatus; tone: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  고속도로: { label: "고속도로", tone: "indigo", Icon: Route },
  국도: { label: "국도", tone: "violet", Icon: CircleEllipsis },
  공사중: { label: "공사중", tone: "fuchsia", Icon: Construction },
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function scoreToPct(score: number) {
  return `${Math.round(clamp01(score / 100) * 100)}%`;
}

function weightedMomentum(scores: Scores) {
  // 빠른 반응(4) > 중기(14) > 장기(54)
  return scores.s4 * 0.5 + scores.s14 * 0.33 + scores.s54 * 0.17;
}

const SECTORS: Sector[] = [
  {
    id: "nasdaq",
    name: "나스닥",
    icon: ChartNoAxesCombined,
    byMode: {
      fast: { status: "고속도로", scores: { s4: 78, s14: 66, s54: 58 } },
      normal: { status: "국도", scores: { s4: 64, s14: 70, s54: 62 } },
      stable: { status: "고속도로", scores: { s4: 52, s14: 68, s54: 76 } },
    },
  },
  {
    id: "bitcoin",
    name: "비트코인",
    icon: Bitcoin,
    byMode: {
      fast: { status: "고속도로", scores: { s4: 86, s14: 61, s54: 49 } },
      normal: { status: "국도", scores: { s4: 68, s14: 64, s54: 56 } },
      stable: { status: "공사중", scores: { s4: 44, s14: 57, s54: 64 } },
    },
  },
  {
    id: "semiconductor",
    name: "반도체",
    icon: Cpu,
    byMode: {
      fast: { status: "국도", scores: { s4: 62, s14: 72, s54: 67 } },
      normal: { status: "고속도로", scores: { s4: 74, s14: 76, s54: 63 } },
      stable: { status: "고속도로", scores: { s4: 58, s14: 70, s54: 78 } },
    },
  },
  {
    id: "ethereum",
    name: "이더리움",
    icon: Sigma,
    byMode: {
      fast: { status: "국도", scores: { s4: 60, s14: 58, s54: 55 } },
      normal: { status: "국도", scores: { s4: 56, s14: 63, s54: 61 } },
      stable: { status: "고속도로", scores: { s4: 48, s14: 60, s54: 73 } },
    },
  },
  {
    id: "ai",
    name: "AI/클라우드",
    icon: Flame,
    byMode: {
      fast: { status: "고속도로", scores: { s4: 82, s14: 69, s54: 59 } },
      normal: { status: "국도", scores: { s4: 67, s14: 71, s54: 65 } },
      stable: { status: "국도", scores: { s4: 54, s14: 66, s54: 74 } },
    },
  },
  {
    id: "energy",
    name: "에너지",
    icon: Droplets,
    byMode: {
      fast: { status: "공사중", scores: { s4: 41, s14: 52, s54: 61 } },
      normal: { status: "국도", scores: { s4: 53, s14: 60, s54: 67 } },
      stable: { status: "고속도로", scores: { s4: 47, s14: 58, s54: 79 } },
    },
  },
  {
    id: "defense",
    name: "방산",
    icon: Factory,
    byMode: {
      fast: { status: "국도", scores: { s4: 58, s14: 66, s54: 70 } },
      normal: { status: "고속도로", scores: { s4: 69, s14: 73, s54: 71 } },
      stable: { status: "고속도로", scores: { s4: 55, s14: 68, s54: 82 } },
    },
  },
  {
    id: "finance",
    name: "금융",
    icon: Landmark,
    byMode: {
      fast: { status: "공사중", scores: { s4: 38, s14: 49, s54: 63 } },
      normal: { status: "국도", scores: { s4: 51, s14: 61, s54: 68 } },
      stable: { status: "고속도로", scores: { s4: 46, s14: 59, s54: 80 } },
    },
  },
  {
    id: "emerging",
    name: "신흥국",
    icon: Globe,
    byMode: {
      fast: { status: "국도", scores: { s4: 55, s14: 57, s54: 60 } },
      normal: { status: "국도", scores: { s4: 52, s14: 62, s54: 64 } },
      stable: { status: "고속도로", scores: { s4: 45, s14: 58, s54: 77 } },
    },
  },
  {
    id: "green",
    name: "친환경",
    icon: Sprout,
    byMode: {
      fast: { status: "공사중", scores: { s4: 36, s14: 50, s54: 66 } },
      normal: { status: "국도", scores: { s4: 49, s14: 59, s54: 70 } },
      stable: { status: "국도", scores: { s4: 43, s14: 56, s54: 78 } },
    },
  },
];

function ScoreRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "indigo" | "violet" | "fuchsia" | "lavender";
}) {
  const barColor =
    tone === "indigo"
      ? "from-indigo-500/55 to-indigo-300/30"
      : tone === "violet"
        ? "from-violet-500/55 to-violet-300/30"
        : tone === "fuchsia"
          ? "from-fuchsia-500/55 to-fuchsia-300/30"
          : "from-violet-400/45 to-fuchsia-300/25";

  return (
    <div className="grid grid-cols-[52px_1fr_42px] items-center gap-3">
      <div className="text-[11px] tracking-wide text-slate-400">{label}</div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: scoreToPct(value) }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,.18),transparent_55%)]" />
      </div>
      <div className="text-right text-[11px] tabular-nums text-slate-300">{value}</div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("normal");

  const ordered = useMemo(() => {
    const statusRank: Record<RoadStatus, number> = { 고속도로: 3, 국도: 2, 공사중: 1 };
    return [...SECTORS].sort((a, b) => {
      const A = a.byMode[mode];
      const B = b.byMode[mode];
      const r1 = statusRank[B.status] - statusRank[A.status];
      if (r1 !== 0) return r1;
      return weightedMomentum(B.scores) - weightedMomentum(A.scores);
    });
  }, [mode]);

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400/80" />
              마켓 로드맵 실험실
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              모드에 따라 섹터 로드맵을 재정렬합니다
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              상태(고속도로/국도/공사중)와 4·14·54 점수의 조합으로 정렬되며, 모드 변경 시 카드가 부드럽게
              재배치됩니다.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <div className="relative grid grid-cols-3 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur">
              <motion.div
                className="absolute inset-y-1 w-1/3 rounded-xl bg-white/10 ring-1 ring-white/10"
                initial={false}
                animate={{
                  x: mode === "fast" ? "0%" : mode === "normal" ? "100%" : "200%",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
              {(["fast", "normal", "stable"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={[
                    "relative z-10 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium",
                    "text-slate-300 transition-colors hover:text-slate-50",
                    mode === m ? "text-slate-50" : "",
                  ].join(" ")}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-black/20 ring-1 ring-white/10">
                    {m === "fast" ? (
                      <Flame className="h-4 w-4 text-fuchsia-200" />
                    ) : m === "normal" ? (
                      <Route className="h-4 w-4 text-slate-200" />
                    ) : (
                      <Construction className="h-4 w-4 text-violet-200" />
                    )}
                  </span>
                  {MODE_LABEL[m]}
                </button>
              ))}
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

                return (
                  <motion.section
                    key={`${mode}:${sector.id}`}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className="group relative overflow-hidden rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur"
                  >
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/20 ring-1 ring-white/10">
                            <Icon className="h-5 w-5 text-slate-100" />
                          </span>
                          <h2 className="truncate text-base font-semibold tracking-tight text-slate-50">
                            {sector.name}
                          </h2>
                        </div>

                        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-black/20 px-2.5 py-1 text-xs text-slate-200 ring-1 ring-white/10">
                          <StatusIcon
                            className={[
                              "h-3.5 w-3.5",
                              meta.tone === "indigo"
                                ? "text-indigo-300"
                                : meta.tone === "violet"
                                  ? "text-violet-300"
                                  : "text-fuchsia-300",
                            ].join(" ")}
                          />
                          <span className="text-slate-300">현재 상태</span>
                          <span className="font-medium text-slate-50">{meta.label}</span>
                        </div>
                      </div>

                      <div className="hidden shrink-0 sm:flex">
                        <div className="rounded-xl bg-black/20 px-3 py-2 text-right ring-1 ring-white/10">
                          <div className="text-[10px] uppercase tracking-wider text-slate-400">Momentum</div>
                          <div className="mt-0.5 text-sm font-semibold tabular-nums text-slate-50">
                            {Math.round(weightedMomentum(scores))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-slate-300">4 / 14 / 54 점수</div>
                        <div className="text-[11px] text-slate-500">0–100</div>
                      </div>

                      <ScoreRow
                        label="4"
                        value={scores.s4}
                        tone={meta.tone === "indigo" ? "indigo" : meta.tone === "violet" ? "lavender" : "fuchsia"}
                      />
                      <ScoreRow label="14" value={scores.s14} tone="violet" />
                      <ScoreRow label="54" value={scores.s54} tone="lavender" />
                    </div>
                  </motion.section>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <div className="mt-8 rounded-2xl bg-white/5 p-5 text-sm text-slate-400 ring-1 ring-white/10">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black/20 ring-1 ring-white/10">
                <CircleEllipsis className="h-4 w-4 text-slate-300" />
              </div>
              <div className="space-y-1">
                <div className="font-medium text-slate-200">정렬 규칙</div>
                <div className="leading-6">
                  상태 우선(고속도로 &gt; 국도 &gt; 공사중), 다음으로 4·14·54 가중 합산 모멘텀 순으로 정렬됩니다.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
