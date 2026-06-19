import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
      <>
        <div className="flex flex-row gap-4 justify-between">
          <div className="flex flex-row gap-4 items-center max-sm:flex-col">
            <div className="flex flex-row gap-4 items-center">
              <Image
                  src={getRandomInterviewCover()}
                  alt="cover-image"
                  width={40}
                  height={40}
                  className="rounded-full object-cover size-[40px]"
              />
              <h3 className="capitalize">{interview.role} Interview</h3>
            </div>

            <DisplayTechIcons techStack={interview.techstack} />
          </div>

          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
            {interview.type}
          </p>
        </div>

        {interview.source === "resume" &&
            interview.resumeHighlights &&
            interview.resumeHighlights.length > 0 && (
                <div className="card p-4 flex flex-col gap-2">
                  <p className="text-sm font-semibold text-primary-200">
                    Pulled from your resume
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {interview.resumeHighlights.map((point, i) => (
                        <li key={i} className="text-sm text-light-100 flex gap-2">
                          <span className="text-primary-200">•</span>
                          {point}
                        </li>
                    ))}
                  </ul>
                </div>
            )}

        <Agent
            userName={user.name}
            userId={user.id}
            interviewId={id}
            type="interview"
            questions={interview.questions}
            feedbackId={feedback?.id}
        />
      </>
  );
};

export default InterviewDetails;
