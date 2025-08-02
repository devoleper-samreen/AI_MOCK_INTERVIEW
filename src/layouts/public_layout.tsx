import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import AuthHandler from "@/handlers/user_auth_handler";
import { useState } from "react";
import LoaderPage from "@/routes/LoaderPage";

const PublicLayout = () => {
  const [loading, setLoading] = useState<boolean>(true);

  if (loading) {
    return (
      <>
        <AuthHandler setLoading={setLoading} />
        <LoaderPage />
      </>
    );
  }

  return (
    <div className="w-full">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
