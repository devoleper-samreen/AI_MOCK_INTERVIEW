import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@clerk/clerk-react";
import LoaderPage from "@/routes/LoaderPage";
import { Headings } from "@/components/Headings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { db } from "@/config/firebase.config";
import type { UserAnswer } from "@/types/index";
import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface Interviews {
  id: string;
  position: string;
  description: string;
}

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interviews | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");
  const { userId } = useAuth();
  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  useEffect(() => {
    if (!interviewId) return;

    const fetchGivenInterview = async () => {
      setIsLoading(true);
      try {
        const givenInterviewQuery = query(
          collection(db, "givenInterviews"),
          where("mockIdRef", "==", interviewId),
          where("userId", "==", userId)
        );

        const givenInterviewSnap = await getDocs(givenInterviewQuery);

        if (!givenInterviewSnap.empty) {
          const docData = givenInterviewSnap.docs[0].data();
          console.log(docData);

          setInterview({
            position: docData.position,
            description: docData.description,
            id: interviewId,
          });

          setFeedbacks(docData.answers);
        } else {
          navigate("/generate", { replace: true });
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching feedback. Try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGivenInterview();
  }, [interviewId, navigate, userId]);

  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";

    const totalRatings = feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );

    return (totalRatings / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5 min-h-[90vh]">
      <Headings
        title="Congratulations !"
        description="Your personalized feedback is now available. Dive in to see your strengths, areas for improvement, and tips to help you ace your next interview."
      />

      <p className="text-base text-muted-foreground">
        Your overall interview ratings :{" "}
        <span className="text-emerald-500 font-semibold text-xl">
          {overAllRating} / 10
        </span>
      </p>

      <Headings title="Interview Feedback" isSubHeading />

      {feedbacks && (
        <Accordion type="single" collapsible className="space-y-6">
          {feedbacks.map((feed) => (
            <AccordionItem
              key={feed.id}
              value={feed.id}
              className="border rounded-lg shadow-md"
            >
              <AccordionTrigger
                onClick={() => setActiveFeed(feed.id)}
                className={cn(
                  "px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline",
                  activeFeed === feed.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50"
                    : "hover:bg-gray-50"
                )}
              >
                <span>{feed.question}</span>
              </AccordionTrigger>

              <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner">
                <div className="text-lg font-semibold to-gray-700">
                  <Star className="inline mr-2 text-yellow-400" />
                  Rating : {feed.rating}
                </div>

                <Card className="border-none space-y-3 p-4 bg-green-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center">
                    <CircleCheck className="mr-2 text-green-600" />
                    Expected Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.correct_ans}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-blue-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center">
                    <CircleCheck className="mr-2 text-blue-600" />
                    Your Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.user_ans}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-red-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center">
                    <CircleCheck className="mr-2 text-red-600" />
                    Feedback
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.feedback}
                  </CardDescription>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
