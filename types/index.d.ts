interface Feedback {
  id: string;
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
  source?: "form" | "resume";
  resumeHighlights?: string[];
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  type: string; // Full-time, Internship, Contract...
  requiredSkills: string[];
  niceToHaveSkills?: string[];
  description: string;
  applyUrl: string;
  postedAt: string;
}

interface JobMatchResult {
  jobId: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  type: string;
  applyUrl: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
  recommendation: string;
}

interface ResumeProfile {
  role: string;
  level: string;
  skills: string[];
  highlights: string[];
}

interface JobMatchResponse {
  profile: ResumeProfile;
  matches: JobMatchResult[];
  isPro: boolean;
  dailyLimit: number;
  matchesUsedToday: number;
  remainingToday: number;
}

interface ProgressDataPoint {
  feedbackId: string;
  interviewId: string;
  role: string;
  type: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  createdAt: string;
}
