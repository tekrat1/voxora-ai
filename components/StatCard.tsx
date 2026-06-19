import { ReactNode } from "react";

interface StatCardProps {
    label: string;
    value: string;
    sublabel?: string;
    icon?: ReactNode;
    accent?: "primary" | "success" | "destructive" | "neutral";
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
    primary: "text-primary-200",
    success: "text-success-100",
    destructive: "text-destructive-100",
    neutral: "text-white",
};

const StatCard = ({
                      label,
                      value,
                      sublabel,
                      icon,
                      accent = "neutral",
                  }: StatCardProps) => {
    return (
        <div className="card flex-1 min-w-[160px] p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-sm text-light-400">{label}</p>
                {icon}
            </div>
            <p className={`text-3xl font-bold ${accentClasses[accent]}`}>{value}</p>
            {sublabel && <p className="text-xs text-light-400">{sublabel}</p>}
        </div>
    );
};

export default StatCard;
