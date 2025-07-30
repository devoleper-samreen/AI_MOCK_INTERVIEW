import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import AuthHandler from "@/handlers/user_auth_handler";

const PublicLayout = () => {
  return (
    <div className="w-full">
      <AuthHandler />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
