import axios from "axios";
import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const API_URL = "http://localhost:5005/api";

const AuthWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const nav = useNavigate();

  async function authenticateUser() {
    const tokenInStorage = localStorage.getItem("authToken");

    if (!tokenInStorage) {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${tokenInStorage}` },
      });

      setCurrentUser(data.currentLoggedInUser);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      setIsLoggedIn(false);
      nav("/login");
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setIsLoggedIn(false);
    nav("/login");
  };

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

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthWrapper, useAuth };
