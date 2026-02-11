import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/reacted">Reacted</NavLink>

        <NavLink to="/cohort">Cohort</NavLink>

        <NavLink to="/profile">Profile</NavLink>

        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>
    </div>
  );
}

export default Sidebar;
