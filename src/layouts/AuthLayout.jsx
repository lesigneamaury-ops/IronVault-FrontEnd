// AuthLayout - Minimal layout for login/signup pages (no navbar, sidebar, or footer)
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div>
      {/* Outlet renders child routes (LoginPage, SignupPage) */}
      <Outlet />
    </div>
  );
}

export default AuthLayout;
