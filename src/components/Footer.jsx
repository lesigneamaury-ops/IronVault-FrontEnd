import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <a href="https://github.com/lesigneamaury-ops" target="_blank" rel="noopener noreferrer">
          <img
            src="/assets/Githublogo.png"
            alt="GitHub"
            className="footer-icon"
          />
        </a>
      </div>

      <div className="footer-center">
        <span>© {new Date().getFullYear()} IronVault</span>
        <span className="footer-separator">•</span>
        <span>WDFT Nov 2025</span>
      </div>

      <div className="footer-right">
        <a href="mailto:support@ironvault.dev">Support</a>
      </div>
    </footer>
  );
}

export default Footer;
