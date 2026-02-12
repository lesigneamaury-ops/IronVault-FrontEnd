// LoginPage - Handles user login with email and password
import "./LoginPage.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/config";

function LoginPage() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { authenticateUser } = useAuth(); // Re-fetch user data after login
  const nav = useNavigate();

  // handleSubmit - Send login credentials to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      // Call backend login endpoint
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      // Store JWT token in localStorage for future requests
      localStorage.setItem("authToken", response.data.authToken);
      setSuccessMessage("Login successful!");
      // Fetch and store user data in AuthContext
      await authenticateUser();
      // Redirect to home page
      nav("/");
    } catch (err) {
      // Display error message from backend
      if (err.response && err.response.data) {
        if (err.response.data.errorMessage)
          setErrorMessage(err.response.data.errorMessage);
        else if (err.response.data.message)
          setErrorMessage(err.response.data.message);
        else setErrorMessage("Login failed");
      } else {
        setErrorMessage("Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-page">
        <h1>Behold the IronVault</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          You don't have an account yet? <Link to="/signup">Click here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
