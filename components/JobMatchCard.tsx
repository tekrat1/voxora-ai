import { cn } from "@/lib/utils";

const scoreColor = (score: number) => {
    if (score >= 85) return "text-success-100";
    if (score >= 65) return "text-primary-200";
    if (score >= 40) return "text-yellow-400";
    return "text-destructive-100";
};

const JobMatchCard = ({
                          match,
                          isPro,
                      }: {
    match: JobMatchResult;
    isPro: boolean;
}) => {
    return (
        <div className="card p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-primary-100">{match.title}</h3>
                    <p className="text-sm text-light-400">
                        {match.company} · {match.location}
                        {match.remote ? " · Remote" : ""} · {match.type}
                    </p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <p className={cn("text-3xl font-bold", scoreColor(match.matchScore))}>
                        {match.matchScore}%
                    </p>
                    <p className="text-xs text-light-400">Match Score</p>
                </div>
            </div>

            {match.matchedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {match.matchedSkills.map((skill) => (
                        <span
                            key={skill}
                            className="text-xs font-semibold px-3 py-1 rounded-full bg-success-100/10 text-success-100 border border-success-100/30"
                        >
              ✓ {skill}
            </span>
                    ))}
                </div>
            )}

            {isPro && match.missingSkills.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-light-400">Missing</p>
                    <div className="flex flex-wrap gap-2">
                        {match.missingSkills.map((skill) => (
                            <span
                                key={skill}
                                className="text-xs font-semibold px-3 py-1 rounded-full bg-destructive-100/10 text-destructive-100 border border-destructive-100/30"
                            >
                {skill}
              </span>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-sm text-light-100">{match.reasoning}</p>

            <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm font-semibold text-primary-200">
                    {match.recommendation}
                </p>
                <a
                    href={match.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm"
                >
                    Apply Link
                </a>
            </div>
        </div>
    );
};

export default JobMatchCard;
