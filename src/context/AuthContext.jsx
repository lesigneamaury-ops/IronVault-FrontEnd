// AuthContext - Global authentication state management
// Provides user info, login status, and auth methods to all components
import axios from "axios";
import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";

const AuthContext = createContext();

// AuthWrapper - Context provider component that wraps the entire app
const AuthWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Stores user data (name, email, role, etc.)
  const [isLoading, setIsLoading] = useState(true); // True while verifying auth token
  const [isLoggedIn, setIsLoggedIn] = useState(false); // True if user is authenticated
  const nav = useNavigate();

  // authenticateUser - Verifies JWT token from localStorage with backend
  // Called on app load and after login/signup to fetch user data
  async function authenticateUser() {
    const tokenInStorage = localStorage.getItem("authToken");
    // No token found - user is not logged in
    if (!tokenInStorage) {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      // Verify token with backend and fetch user data
      const { data } = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${tokenInStorage}` },
      });

      setCurrentUser(data.currentLoggedInUser);
      setIsLoggedIn(true);
    } catch (error) {
      // Token is invalid or expired - clear it and redirect to login
      console.log(error);
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      setIsLoggedIn(false);
      nav("/login");
    } finally {
      setIsLoading(false);
    }
  }

  // handleLogout - clears auth token and user data, redirects to login
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setIsLoggedIn(false);
    nav("/login");
  };

  // Verify authentication on initial app load
  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        setCurrentUser,
        isLoading,
        isLoggedIn,
        authenticateUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook - Easy access to auth context in any component
const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthWrapper, useAuth };
