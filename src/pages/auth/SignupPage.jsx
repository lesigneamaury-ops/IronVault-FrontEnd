import "./SignupPage.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5005/api";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const nav = useNavigate();
  const { authenticateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await axios.post(`${API_URL}/auth/signup`, { name, email, password });

      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("authToken", loginRes.data.authToken);

      await authenticateUser();
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
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">Sign up</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
