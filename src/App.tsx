import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/public_layout";
import HomePage from "./routes/HomePage";
import AuthLayout from "./layouts/auth_layout";
import Signin from "./routes/Signin";
import Signup from "./routes/Signup";
import ProtectedLayout from "./layouts/protected_layout";
import MainLayout from "./layouts/main_layout";
import { Generate } from "./components/Generate";
import { Dashboard } from "./routes/Dashboard";
import CreateEditPage from "./routes/CreateEditPage";
import { MockLoadPage } from "./routes/MockLoadPage";
import { MockInterviewPage } from "./routes/MockInterviewPage";
import { Feedback } from "./routes/Feedback";
import { InterviewHistory } from "./routes/InterviewHistory";
import { useEffect } from "react";
function App() {
  console.log("Firebase Key:", import.meta.env.VITE_FIREBASE_API_KEY);
  console.log("Gemini Key:", import.meta.env.VITE_GEMINI_API_KEY);

  useEffect(() => {
    console.log("Firebase Key:", import.meta.env.VITE_FIREBASE_API_KEY);
    console.log("Gemini Key:", import.meta.env.VITE_GEMINI_API_KEY);
  }, []);
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* AUTHENTICATION routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin/*" element={<Signin />} />
          <Route path="/signup/*" element={<Signup />} />
        </Route>

        {/*Private routes */}
        <Route
          element={
            <ProtectedLayout>
              <MainLayout />
            </ProtectedLayout>
          }
        >
          {/* all protected route here */}
          <Route path="/generate/*" element={<Generate />}>
            <Route index element={<Dashboard />} />
            <Route path=":interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route
              path="interview/:interviewId/start"
              element={<MockInterviewPage />}
            />
          </Route>
          <Route path="/interview-history" element={<InterviewHistory />} />
          <Route
            path="/interview-history/:interviewId/feedback"
            element={<Feedback />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
