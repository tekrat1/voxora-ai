// Curated pool of sample job listings used to power the AI Resume -> Job
// Match feature. This keeps the feature fully functional and demoable
// without needing a paid third-party job-board API key.
//
// Swap `getJobListings()` for a real provider later (e.g. Adzuna, Jooble,
// LinkedIn Jobs API, RapidAPI "JSearch") without touching the matching
// logic in `lib/actions/job.action.ts` — it only needs an array of
// `JobListing` objects.

export const jobListings: JobListing[] = [
    {
        id: "job-001",
        title: "Frontend Engineer",
        company: "Nimbus Labs",
        location: "Remote",
        remote: true,
        type: "Full-time",
        requiredSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        niceToHaveSkills: ["GraphQL", "Jest"],
        description:
            "Build customer-facing dashboards and marketing surfaces using React and Next.js. Close collaboration with design on a component library.",
        applyUrl: "https://example.com/jobs/nimbus-labs-frontend-engineer",
        postedAt: "2026-06-10",
    },
    {
        id: "job-002",
        title: "Software Engineer Intern",
        company: "Pivot Robotics",
        location: "Bengaluru, IN",
        remote: false,
        type: "Internship",
        requiredSkills: ["JavaScript", "React", "Git"],
        niceToHaveSkills: ["Firebase", "Node.js"],
        description:
            "6-month internship building internal tools for a robotics fleet-management product. Mentored by senior engineers, with a return-offer track.",
        applyUrl: "https://example.com/jobs/pivot-robotics-swe-intern",
        postedAt: "2026-06-14",
    },
    {
        id: "job-003",
        title: "Full Stack Developer",
        company: "Ledger & Co",
        location: "Remote",
        remote: true,
        type: "Full-time",
        requiredSkills: ["Node.js", "Express", "MongoDB", "React"],
        niceToHaveSkills: ["Docker", "AWS", "Redis"],
        description:
            "Own features end-to-end across a Node/Express API and a React client for a fintech reconciliation product.",
        applyUrl: "https://example.com/jobs/ledger-co-fullstack-developer",
        postedAt: "2026-06-08",
    },
    {
        id: "job-004",
        title: "Backend Engineer (Node.js)",
        company: "Hearthstone Systems",
        location: "Hyderabad, IN",
        remote: false,
        type: "Full-time",
        requiredSkills: ["Node.js", "PostgreSQL", "Docker", "AWS"],
        niceToHaveSkills: ["Kubernetes", "Redis"],
        description:
            "Design and scale backend services that process millions of events per day for a logistics platform.",
        applyUrl: "https://example.com/jobs/hearthstone-backend-engineer",
        postedAt: "2026-06-05",
    },
    {
        id: "job-005",
        title: "Junior Frontend Developer",
        company: "Brightleaf Studio",
        location: "Remote",
        remote: true,
        type: "Full-time",
        requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
        niceToHaveSkills: ["TypeScript", "Figma"],
        description:
            "Ship pixel-perfect marketing sites and landing pages for agency clients. Great first role for someone 0-2 years in.",
        applyUrl: "https://example.com/jobs/brightleaf-junior-frontend",
        postedAt: "2026-06-15",
    },
    {
        id: "job-006",
        title: "DevOps Engineer",
        company: "Cascade Cloud",
        location: "Remote",
        remote: true,
        type: "Full-time",
        requiredSkills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        niceToHaveSkills: ["Terraform", "Python"],
        description:
            "Own CI/CD pipelines and Kubernetes infrastructure for a multi-tenant SaaS platform serving 10k+ orgs.",
        applyUrl: "https://example.com/jobs/cascade-cloud-devops-engineer",
        postedAt: "2026-06-02",
    },
    {
        id: "job-007",
        title: "Mobile Engineer (React Native)",
        company: "Orbital Health",
        location: "Remote",
        remote: true,
        type: "Full-time",
        requiredSkills: ["React Native", "TypeScript", "Firebase"],
        niceToHaveSkills: ["iOS", "Android"],
        description:
            "Build the patient-facing app for a telehealth startup, working closely with clinicians on UX.",
        applyUrl: "https://example.com/jobs/orbital-health-mobile-engineer",
        postedAt: "2026-06-11",
    },
    {
        id: "job-008",
        title: "Data Engineer",
        company: "Quanta Analytics",
        location: "Pune, IN",
        remote: false,
        type: "Full-time",
        requiredSkills: ["Python", "SQL", "Airflow", "AWS"],
        niceToHaveSkills: ["Spark", "dbt"],
        description:
            "Build and maintain ELT pipelines feeding analytics dashboards used by 200+ internal stakeholders.",
        applyUrl: "https://example.com/jobs/quanta-analytics-data-engineer",
        postedAt: "2026-06-09",
    },
    {
        id: "job-009",
        title: "Machine Learning Engineer",
        company: "Northwind AI",
        location: "Remote",
        remote: true,
        type: "Full-time",
        requiredSkills: ["Python", "PyTorch", "Machine Learning"],
        niceToHaveSkills: ["NLP", "AWS", "Docker"],
        description:
            "Train and deploy ranking models for a recommendation engine serving millions of monthly users.",
        applyUrl: "https://example.com/jobs/northwind-ai-ml-engineer",
        postedAt: "2026-06-12",
    },
    {
        id: "job-010",
        title: "QA / Test Automation Engineer",
        company: "Vesper Software",
        location: "Remote",
        remote: true,
        type: "Full-time",
        requiredSkills: ["Cypress", "JavaScript", "CI/CD"],
        niceToHaveSkills: ["Selenium", "Jest"],
        description:
            "Build out an automated regression suite and own release-quality gates for a B2B SaaS product.",
        applyUrl: "https://example.com/jobs/vesper-software-qa-automation",
        postedAt: "2026-06-07",
    },
    {
        id: "job-011",
        title: "Product Engineer (Generalist)",
        company: "Meridian Apps",
        location: "Remote",
        remote: true,
        type: "Full-time",
        requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
        niceToHaveSkills: ["Next.js", "Tailwind CSS"],
        description:
            "Small, senior team building a project-management tool. You'll touch frontend, backend, and infra in the same week.",
        applyUrl: "https://example.com/jobs/meridian-apps-product-engineer",
        postedAt: "2026-06-13",
    },
    {
        id: "job-012",
        title: "Cloud Engineer Intern",
        company: "Solace Systems",
        location: "Gurugram, IN",
        remote: false,
        type: "Internship",
        requiredSkills: ["AWS", "Linux", "Python"],
        niceToHaveSkills: ["Docker", "Terraform"],
        description:
            "Summer internship supporting the cloud platform team with automation scripts and monitoring dashboards.",
        applyUrl: "https://example.com/jobs/solace-systems-cloud-intern",
        postedAt: "2026-06-16",
    },
];

export function getJobListings(): JobListing[] {
    return jobListings;
}
