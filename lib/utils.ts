import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
      logoURLs.map(async ({ tech, url }) => ({
        tech,
        url: (await checkIconExists(url)) ? url : "/tech.svg",
      }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

export interface ProgressStats {
  totalCompleted: number;
  averageScore: number;
  bestScore: number;
  latestScore: number;
  scoreDelta: number; // latest vs previous attempt; null-safe via 0 when n<2
  trend: "up" | "down" | "flat" | "new";
  bestCategory: { name: string; avg: number } | null;
  weakestCategory: { name: string; avg: number } | null;
  categoryAverages: { name: string; avg: number }[];
  currentStreak: number; // consecutive interviews scoring >= previous one
}

/**
 * Reduces a chronological (oldest -> newest) feedback list into the
 * numbers the progress dashboard needs. Pure function so it's easy to
 * unit test and reuse between the server page and any client widgets.
 */
export function computeProgressStats(
    points: ProgressDataPoint[]
): ProgressStats {
  const totalCompleted = points.length;

  if (totalCompleted === 0) {
    return {
      totalCompleted: 0,
      averageScore: 0,
      bestScore: 0,
      latestScore: 0,
      scoreDelta: 0,
      trend: "new",
      bestCategory: null,
      weakestCategory: null,
      categoryAverages: [],
      currentStreak: 0,
    };
  }

  const scores = points.map((p) => p.totalScore);
  const averageScore = Math.round(
      scores.reduce((sum, s) => sum + s, 0) / totalCompleted
  );
  const bestScore = Math.max(...scores);
  const latestScore = scores[scores.length - 1];
  const previousScore = totalCompleted > 1 ? scores[scores.length - 2] : null;
  const scoreDelta = previousScore !== null ? latestScore - previousScore : 0;

  const trend: ProgressStats["trend"] =
      previousScore === null
          ? "new"
          : scoreDelta > 0
              ? "up"
              : scoreDelta < 0
                  ? "down"
                  : "flat";

  // Average every category across all attempts, in case the AI ever
  // returns categories in a different order or set in the future.
  const categoryTotals = new Map<string, { sum: number; count: number }>();
  for (const point of points) {
    for (const cat of point.categoryScores) {
      const entry = categoryTotals.get(cat.name) ?? { sum: 0, count: 0 };
      entry.sum += cat.score;
      entry.count += 1;
      categoryTotals.set(cat.name, entry);
    }
  }

  const categoryAverages = Array.from(categoryTotals.entries())
      .map(([name, { sum, count }]) => ({ name, avg: Math.round(sum / count) }))
      .sort((a, b) => b.avg - a.avg);

  const bestCategory = categoryAverages[0] ?? null;
  const weakestCategory =
      categoryAverages.length > 0
          ? categoryAverages[categoryAverages.length - 1]
          : null;

  // Streak = consecutive most-recent interviews that didn't score lower
  // than the one before them.
  let currentStreak = totalCompleted > 0 ? 1 : 0;
  for (let i = totalCompleted - 1; i > 0; i--) {
    if (scores[i] >= scores[i - 1]) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    totalCompleted,
    averageScore,
    bestScore,
    latestScore,
    scoreDelta,
    trend,
    bestCategory,
    weakestCategory,
    categoryAverages,
    currentStreak,
  };
}
