import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/config/firebase.config";
import LoaderPage from "@/routes/LoaderPage";
import type { Interview } from "@/types/index";
import { QuestionSection } from "@/containers/QuestionSection";

export const MockInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  useEffect(() => {
    if (interviewId) {
      const fetchInterview = async () => {
        setIsLoading(true);
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            setInterview({ ...interviewDoc.data() } as Interview);
          } else {
            navigate("/generate", { replace: true });
          }
        } catch (error) {
          console.log(error);
          toast("Error", {
            description: "Something went wrong. Please try again later..",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchInterview();
    }
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-2">
      {interview?.questions && interview?.questions.length > 0 && (
        <div className="w-full flex flex-col items-start gap-4">
          <QuestionSection questions={interview?.questions} />
        </div>
      )}
    </div>
  );
};
