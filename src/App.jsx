// Main App component - defines all routes and route guards
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Auth pages (public only)
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// User pages (protected)
import HomePage from "./pages/user/HomePage";
import ProfilePage from "./pages/user/ProfilePage";
import ReactedPage from "./pages/user/ReactedPage";
import CohortPage from "./pages/user/CohortPage";

// Admin pages (admin only)
import AdminDashboard from "./pages/admin/AdminDashboard";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import { useAuth } from "./context/AuthContext";

// Loading screen shown while auth state is being verified
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
    </div>
  );
}

// PublicOnlyRoute - Only accessible when NOT logged in
// Redirects to home if user is already authenticated
function PublicOnlyRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (isLoggedIn) return <Navigate to="/" replace />;

  return <Outlet />;
}

// ProtectedRoute - Only accessible when logged in
// Redirects to login if user is not authenticated
function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return <Outlet />;
}

// AdminRoute - Only accessible when logged in AND user has ADMIN role
// Redirects to login if not authenticated, or to home if not admin
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
      {/* Public routes - only accessible when NOT logged in */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Route>

      {/* Protected routes - only accessible when logged in */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cohort" element={<CohortPage />} />
          <Route path="/reacted" element={<ReactedPage />} />
        </Route>
      </Route>

      {/* Admin routes - only accessible for ADMIN role */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Catch-all - redirect any unknown route to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
