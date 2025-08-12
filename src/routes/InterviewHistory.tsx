import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface InterviewData {
  id: string;
  title: string;
  description: string;
  finalScore: number;
  overallFeedback: string;
  createdAt?: { seconds: number; nanoseconds: number };
  mockIdRef: string;
}

export const InterviewHistory = () => {
  const { userId } = useAuth();
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const qSnap = await getDocs(
          query(
            collection(db, "givenInterviews"),
            where("userId", "==", userId)
            // orderBy("createdAt", "desc")
          )
        );

        const data: InterviewData[] = qSnap.docs.map((doc) => {
          const d = doc.data();
          console.log(d);

          return {
            id: doc.id,
            title: d.position || "No Position",
            description: d.description || "No description",
            finalScore: d.finalScore || 0,
            overallFeedback: d.overallFeedback || "",
            createdAt: d.createdAt,
            mockIdRef: d.mockIdRef,
          };
        });

        setInterviews(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {[...Array(5)].map((_, idx) => (
          <tr key={idx} className="border-t">
            <td className="p-10">
              <Skeleton className="h-8 w-28 bg-gray-200" />
            </td>
            <td className="p-4">
              <Skeleton className="h-8 w-40 bg-gray-200" />
            </td>
            <td className="p-4">
              <Skeleton className="h-8 w-10 bg-gray-200" />
            </td>
            <td className="p-4">
              <Skeleton className="h-8 w-32 bg-gray-200" />
            </td>
            <td className="p-4">
              <Skeleton className="h-8 w-6 bg-gray-200" />
            </td>
          </tr>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Interview History</h1>

      {interviews.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Position</th>
                <th className="p-3">Description</th>
                <th className="p-3">Score</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview.id} className="border-t">
                  <td className="p-3">{interview.title}</td>
                  <td className="p-3 truncate max-w-16">
                    {interview.description}
                  </td>
                  <td className="p-3">{interview.finalScore}/10</td>

                  <td className="p-3">
                    {interview.createdAt
                      ? format(
                          new Date(interview.createdAt.seconds * 1000),
                          "dd MMM yyyy, hh:mm a"
                        )
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <Link to={`feedback/${interview.mockIdRef}`}>
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
