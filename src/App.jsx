import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import HomePage from "./pages/user/HomePage";
import ProfilePage from "./pages/user/ProfilePage";
import ReactedPage from "./pages/user/ReactedPage";
import CohortPage from "./pages/user/CohortPage";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import { useAuth } from "./context/AuthContext";

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
    </div>
  );
}

function PublicOnlyRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (isLoggedIn) return <Navigate to="/" replace />;

  return <Outlet />;
}

function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return <Outlet />;
}

function AdminRoute() {
  const { isLoggedIn, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const isAdmin = user?.role === "ADMIN";
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cohort" element={<CohortPage />} />
          <Route path="/reacted" element={<ReactedPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
