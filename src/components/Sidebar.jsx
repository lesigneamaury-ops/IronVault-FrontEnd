import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";
import { FEATURES } from "../config/freatures";

function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/liked">Liked</NavLink>

        {FEATURES.TAGS && <NavLink to="/tagged">Tagged</NavLink>}

        <NavLink to="/profile">Profile</NavLink>

        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>
    </div>
  );
}

export default Sidebar;
