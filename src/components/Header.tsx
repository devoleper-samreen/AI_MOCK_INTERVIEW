import { cn } from "@/lib/utils";
import Container from "./Container";
import { LogoContainer } from "./LogoContainer";
import { MainRoutes } from "@/lib/helper";
import { NavLink } from "react-router-dom";
import { ProfileContainer } from "@/components/ProfileContainer";
import { ToggleContainer } from "@/components/ToggleContainer";
import { useAuth } from "@clerk/clerk-react";

const Header = () => {
  const { userId } = useAuth();

  return (
    <header
      className={cn("w-full border-b duration-150 transition-all ease-in-out")}
    >
      <Container>
        <div className="flex items-center gap-4">
          {/* logo section */}
          <LogoContainer />

          {/* nvigation section */}
          <nav className="hidden md:flex items-center gap-3">
            <ul className="flex items-center gap-6">
              {MainRoutes.map((route) => (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "text-base text-neutral-600",
                      isActive && "text-neutral-900 font-semibold"
                    )
                  }
                  key={route.href}
                  to={route.href}
                >
                  {route.label}
                </NavLink>
              ))}

              {userId && (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "text-base text-neutral-600",
                      isActive && "text-neutral-900 font-semibold"
                    )
                  }
                  to={"/generate"}
                >
                  Take an Interview
                </NavLink>
              )}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-6">
            <ProfileContainer />
            <ToggleContainer />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
