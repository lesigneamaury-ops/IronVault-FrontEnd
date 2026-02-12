// AdminLayout - Layout for admin pages (admin dashboard)
// Includes navbar and admin-specific navigation (Dashboard, User View)
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Navbar />
      <div className="admin-nav">
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>
        {/* Link to switch back to user view */}
        <NavLink to="/">User View</NavLink>
      </div>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
