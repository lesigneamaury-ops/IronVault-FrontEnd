import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./ProfilePage.css";
import { API_URL } from "../../config/config";

function ProfilePage() {
  const { currentUser, authenticateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    twitter: "",
  });

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

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError("");
    setSocialLinks(currentUser?.socialLinks || {});
    setProfileImageFile(null);
  };

  const handleSave = async () => {
    setSaveError("");
    const token = localStorage.getItem("authToken");
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
      setSaveError("Profile update failed. Please try again.");
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profileImageFile) return;

    setIsUploadingImage(true);
    setSaveError("");
    const token = localStorage.getItem("authToken");
    try {
      const formData = new FormData();
      formData.append("image", profileImageFile);

      const { data } = await axios.post(
        `${API_URL}/users/me/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfilePicture(data.profilePicture || "");
      setProfileImageFile(null);
      await authenticateUser();
    } catch (err) {
      setSaveError("Profile picture upload failed. Please try again.");
    } finally {
      setIsUploadingImage(false);
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
            <div className="profile-upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                className="profile-input"
              />
              <button
                className="btn-secondary"
                onClick={handleProfilePictureUpload}
                disabled={!profileImageFile || isUploadingImage}
              >
                {isUploadingImage ? "Uploading..." : "Upload picture"}
              </button>
            </div>
          )}

          <h2>{currentUser.userName}</h2>
          <p className="profile-email">{currentUser.email}</p>
          {currentUser.cohort && (
            <p className="profile-cohort">
              Cohort: {currentUser.cohort.displayName || currentUser.cohort.course || "N/A"}
            </p>
          )}
        </div>

        {saveError && <p className="profile-error">{saveError}</p>}

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
              <button className="btn-secondary" onClick={handleCancel}>
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
