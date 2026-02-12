// SignupPage - Handles user registration with name, email, and password
import "./SignupPage.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/config";

function SignupPage() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const nav = useNavigate();
  const { authenticateUser } = useAuth(); // Re-fetch user data after signup

  // handleSubmit - Send signup data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Client-side password validation
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend signup endpoint
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      // Store JWT token in localStorage
      localStorage.setItem("authToken", response.data.authToken);
      setSuccessMessage("Account created!");
      // Fetch and store user data in AuthContext
      await authenticateUser();
      // Redirect to home page
      nav("/");
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errorMessage)
          setErrorMessage(err.response.data.errorMessage);
        else if (err.response.data.message)
          setErrorMessage(err.response.data.message);
        else setErrorMessage("Signup failed");
      } else {
        setErrorMessage("Signup failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-screen">
      <div className="signup-page">
        <h1>Enter the IronVault</h1>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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
            Password (min. 6 characters)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
