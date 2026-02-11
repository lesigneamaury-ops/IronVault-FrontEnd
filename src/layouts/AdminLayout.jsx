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
        <NavLink to="/">User View</NavLink>
      </div>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
