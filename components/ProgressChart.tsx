"use client";

import dayjs from "dayjs";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Dot,
} from "recharts";

interface ChartPoint {
    label: string;
    fullDate: string;
    score: number;
    role: string;
}

const CustomTooltip = ({
                           active,
                           payload,
                       }: {
    active?: boolean;
    payload?: { payload: ChartPoint }[];
}) => {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0].payload;

    return (
        <div className="rounded-xl border border-white/10 bg-dark-200/95 px-4 py-3 shadow-lg backdrop-blur-sm">
            <p className="text-xs text-light-400">
                {dayjs(point.fullDate).format("MMM D, YYYY")}
            </p>
            <p className="capitalize text-sm font-semibold text-white mt-0.5">
                {point.role}
            </p>
            <p className="text-primary-200 font-bold text-lg mt-1">
                {point.score}
                <span className="text-light-400 text-xs font-normal">/100</span>
            </p>
        </div>
    );
};

const ActiveDot = (props: { cx?: number; cy?: number }) => {
    const { cx, cy } = props;
    if (cx == null || cy == null) return null;
    return (
        <Dot
            cx={cx}
            cy={cy}
            r={5}
            fill="#00FFA3"
            stroke="#050B14"
            strokeWidth={2}
        />
    );
};

const ProgressChart = ({ data }: { data: ChartPoint[] }) => {
    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                    <defs>
                        <linearGradient id="scoreLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#00D4FF" />
                            <stop offset="100%" stopColor="#00FFA3" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="label"
                        stroke="rgba(255,255,255,0.35)"
                        tick={{ fill: "#8AA6C1", fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        stroke="rgba(255,255,255,0.35)"
                        tick={{ fill: "#8AA6C1", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        width={32}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,212,255,0.25)" }} />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="url(#scoreLine)"
                        strokeWidth={3}
                        dot={<ActiveDot />}
                        activeDot={<ActiveDot />}
                        isAnimationActive={true}
                        animationDuration={600}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgressChart;
