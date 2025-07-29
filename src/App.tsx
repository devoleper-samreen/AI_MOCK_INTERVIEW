import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/public_layout";
import HomePage from "./routes/HomePage";
import AuthLayout from "./layouts/auth_layout";
import Signin from "./routes/Signin";
import Signup from "./routes/Signup";
import ProtectedLayout from "./layouts/protected_layout";
import MainLayout from "./layouts/main_layout";
function App() {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route element={<PublicLayout />}>
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
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
