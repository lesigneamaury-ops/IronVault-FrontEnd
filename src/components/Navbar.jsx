// Navbar - Top navigation bar with logo, user name, and logout button
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { handleLogout, user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-Title">IronVault</h1>
      </div>
      <div className="navbar-center">
        <img
          src="/assets/IronVaultLogo.png"
          className="navbar-logo"
          alt="IronVault Logo"
        />
      </div>
      <div className="navbar-right">
        {/* Display current user's name */}
        {user && <span className="navbar-user">{user.userName}</span>}
        {/* Logout button clears auth token and redirects to login */}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;
