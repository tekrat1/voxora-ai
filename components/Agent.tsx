"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { toast } from "sonner";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
                 userName,
                 userId,
                 interviewId,
                 feedbackId,
                 type,
                 questions,
               }: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");
      setIsGeneratingFeedback(true);

      const { success, feedbackId: id, error } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      setIsGeneratingFeedback(false);

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback:", error);
        toast.error(
            error
                ? `Couldn't generate feedback: ${error}`
                : "Couldn't generate feedback for this interview."
        );
        router.push(`/interview/${interviewId}`);
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions.map((q) => `- ${q}`).join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    try {
      vapi.stop();
    } catch {
      // vapi/daily-js can throw a benign "Meeting has ended" error here
      // once the call is already winding down — safe to ignore.
    }
  };

  return (
      <>
        <div className="call-view">
          {/* AI Interviewer Card */}
          <div className="card-interviewer">
            <div className="avatar relative">
              <Image
                  src="/ai-avatar.png"
                  alt="AI Interviewer"
                  width={65}
                  height={54}
                  className="object-cover"
              />
              {isSpeaking && (
                  <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-primary-200 animate-ping opacity-75" />
              )}
            </div>
            <h3>AI Interviewer</h3>
          </div>

          {/* User Profile Card */}
          <div className="card-border">
            <div className="card-content">
              <Image
                  src="/user-avatar.png"
                  alt="User Profile"
                  width={539}
                  height={539}
                  className="rounded-full object-cover size-[120px]"
              />
              <h3>{userName}</h3>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
            <div className="transcript-border">
              <div className="transcript">
                <p
                    key={lastMessage}
                    className={cn(
                        "transition-opacity duration-500 opacity-0",
                        "animate-fadeIn opacity-100"
                    )}
                >
                  {lastMessage}
                </p>
              </div>
            </div>
        )}

        {isGeneratingFeedback && (
            <p className="text-center text-light-400 text-sm animate-pulse">
              Generating your feedback…
            </p>
        )}

        <div className="w-full flex justify-center">
          {callStatus !== "ACTIVE" ? (
              <button
                  className="relative btn-call"
                  onClick={handleCall}
                  disabled={isGeneratingFeedback}
              >
            <span
                className={cn(
                    "absolute animate-ping rounded-full opacity-75",
                    callStatus !== "CONNECTING" && "hidden"
                )}
            />
                <span className="relative">
              {isGeneratingFeedback
                  ? ". . ."
                  : callStatus === "INACTIVE" || callStatus === "FINISHED"
                      ? "Call"
                      : ". . ."}
            </span>
              </button>
          ) : (
              <button className="btn-disconnect" onClick={handleDisconnect}>
                End
              </button>
          )}
        </div>
      </>
  );
};

export default Agent;