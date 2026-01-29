import "./LoginPage.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/config";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { authenticateUser } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("authToken", response.data.authToken);
      await authenticateUser();
      nav("/");
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errorMessage)
          setErrorMessage(err.response.data.errorMessage);
        else if (err.response.data.message)
          setErrorMessage(err.response.data.message);
        else setErrorMessage("Login failed");
      } else {
        setErrorMessage("Login failed");
      }
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

          <button type="submit">Login</button>
        </form>

        <p>
          You don't have an account yet? <Link to="/signup">Click here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
