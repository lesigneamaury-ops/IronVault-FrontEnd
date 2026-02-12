// Sidebar - Left navigation sidebar with links to main pages
// Shows Admin link only for users with ADMIN role
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {/* NavLink automatically adds 'active' class to current route */}
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/reacted">Reacted</NavLink>

        <NavLink to="/cohort">Cohort</NavLink>

        <NavLink to="/profile">Profile</NavLink>

        {/* Admin link only visible for ADMIN role */}
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>
    </div>
  );
}

export default Sidebar;
