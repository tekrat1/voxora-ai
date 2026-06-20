"use client";

import type { CSSProperties } from "react";

const skillBars = [
    { label: "Communication", value: 82, color: "from-[#00D4FF] to-[#00FFA3]", text: "#00FFA3" },
    { label: "Technical Depth", value: 67, color: "from-[#A78BFA] to-[#00D4FF]", text: "#00FFA3" },
    { label: "Problem Solving", value: 55, color: "from-[#FFA040] to-[#FF6B35]", text: "#FFA040" },
];

const waveDelays = [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6];
const waveColors = [
    "#00D4FF", "#00D4FF", "#00FFA3", "#00FFA3", "#00D4FF", "#00D4FF",
    "#A78BFA", "#A78BFA", "#00D4FF", "#00D4FF", "#00FFA3", "#00FFA3",
];

const AISidePanel = () => {
    return (
        <div className="ai-panel relative flex w-full h-full flex-col items-center justify-center gap-5 overflow-hidden bg-[#0d1220] px-5 py-7">
            {/* scan line */}
            <div className="ai-scanline pointer-events-none absolute left-0 right-0 h-px" />

            {/* corner accents */}
            <div className="pointer-events-none absolute top-0 left-0 size-7 rounded-tl-2xl border-t-2 border-l-2 border-primary-200" />
            <div className="pointer-events-none absolute top-0 right-0 size-7 border-t-2 border-r-2" style={{ borderColor: "#00FFA3" }} />
            <div className="pointer-events-none absolute bottom-0 left-0 size-7 border-b-2 border-l-2" style={{ borderColor: "#00FFA3" }} />
            <div className="pointer-events-none absolute bottom-0 right-0 size-7 rounded-br-2xl border-b-2 border-r-2 border-primary-200" />

            {/* floating bg dots */}
            <div className="pointer-events-none absolute inset-0">
                <span className="ai-dot absolute" style={{ top: "15%", left: "10%", width: 3, height: 3, background: "#00D4FF", animationDelay: "0s", animationDuration: "2.5s" }} />
                <span className="ai-dot absolute" style={{ top: "70%", left: "85%", width: 2, height: 2, background: "#00FFA3", animationDelay: ".8s", animationDuration: "3s" }} />
                <span className="ai-dot absolute" style={{ top: "85%", left: "15%", width: 2, height: 2, background: "#A78BFA", animationDelay: "1.5s", animationDuration: "2s" }} />
                <span className="ai-dot absolute" style={{ top: "20%", left: "80%", width: 3, height: 3, background: "#00D4FF", animationDelay: ".3s", animationDuration: "3.5s" }} />
            </div>

            {/* center brain / logo */}
            <div className="ai-float relative flex h-[140px] w-[140px] items-center justify-center">
                <div className="absolute size-[140px] rounded-full border border-dashed border-primary-200/20" />
                <div className="absolute size-[110px] rounded-full border border-primary-200/10" />

                <span className="ai-orbit absolute size-2 rounded-full bg-primary-200" />
                <span className="ai-orbit2 absolute size-1.5 rounded-full" style={{ background: "#00FFA3" }} />
                <span className="ai-orbit3 absolute size-[5px] rounded-full" style={{ background: "#A78BFA" }} />

                <div className="relative z-[2] flex size-[72px] items-center justify-center rounded-full border-2 border-primary-200/40 bg-gradient-to-br from-[#00D4FF40] to-[#00FFA333]">
                    <div className="ai-pulse1 absolute size-[72px] rounded-full border-2 border-primary-200/30" />
                    <div className="ai-pulse2 absolute size-[90px] rounded-full border border-primary-200/15" />
                    <span className="text-[26px]">🤖</span>
                </div>
            </div>

            <div className="text-center">
                <p className="text-primary-200 text-[13px] font-bold uppercase tracking-[0.08em]">
                    AI Interview Coach
                </p>
                <p className="text-light-400 text-[11px] mt-1">
                    Real-time analysis · Instant feedback
                </p>
            </div>

            {/* voice wave bars */}
            <div className="flex h-9 items-center gap-[3px]">
                {waveDelays.map((d, i) => (
                    <span
                        key={i}
                        className="ai-wave w-[3px] rounded-sm"
                        style={{ background: waveColors[i], animationDelay: `${d}s` }}
                    />
                ))}
            </div>

            {/* skill bars */}
            <div className="flex w-full flex-col gap-2">
                <div className="mb-0.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#7fa8bf" }}>
            Live Skill Analysis
          </span>
                    <span className="text-primary-200 text-[10px] font-bold">AI Active</span>
                </div>

                {skillBars.map((bar) => (
                    <div key={bar.label}>
                        <div className="mb-1 flex justify-between">
                            <span className="text-light-100 text-[10px]">{bar.label}</span>
                            <span className="text-[10px] font-semibold" style={{ color: bar.text }}>
                {bar.value}%
              </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-white/[0.07]">
                            <div
                                className={`ai-grow h-full rounded-full bg-gradient-to-r ${bar.color}`}
                                style={{ "--w": `${bar.value}%` } as CSSProperties}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AISidePanel;