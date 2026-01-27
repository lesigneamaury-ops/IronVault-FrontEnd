import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./ProfilePage.css";

const API_URL = "http://localhost:5005/api";

function ProfilePage() {
  const { currentUser, authenticateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    twitter: "",
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (currentUser) {
      setProfilePicture(currentUser.profilePicture || "");
      setSocialLinks(currentUser.socialLinks || {});
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setSocialLinks({
      ...socialLinks,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `${API_URL}/users/me`,
        {
          profilePicture,
          socialLinks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await authenticateUser();
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={profilePicture || "/assets/defaultAvatar.png"}
            alt="Profile"
            className="profile-avatar"
          />

          {isEditing && (
            <input
              type="text"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              placeholder="Profile picture URL"
              className="profile-input"
            />
          )}

          <h2>{currentUser.userName}</h2>
          <p className="profile-email">{currentUser.email}</p>
          <p className="profile-cohort">Cohort: WDFT Nov 2025</p>
        </div>

        <div className="profile-section">
          <h3>Social Links</h3>

          {["github", "linkedin", "instagram", "twitter"].map((key) => (
            <div className="profile-row" key={key}>
              <span className="profile-label">{key}</span>

              {isEditing ? (
                <input
                  name={key}
                  value={socialLinks[key] || ""}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <span className="profile-value">{socialLinks[key] || "—"}</span>
              )}
            </div>
          ))}
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setIsEditing(true)}>
              Edit profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
