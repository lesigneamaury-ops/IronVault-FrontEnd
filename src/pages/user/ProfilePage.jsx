// ProfilePage - User profile page with edit mode for email, social links, profile picture, and password
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./ProfilePage.css";
import { API_URL } from "../../config/config";

function ProfilePage() {
  const { currentUser, authenticateUser } = useAuth();

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [email, setEmail] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    twitter: "",
  });

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false); // Toggle password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Initialize form fields with current user data
  useEffect(() => {
    if (currentUser) {
      setProfilePicture(currentUser.profilePicture || "");
      setEmail(currentUser.email || "");
      setSocialLinks(currentUser.socialLinks || {});
    }
  }, [currentUser]);

  // Handle social links input changes
  const handleChange = (e) => {
    setSocialLinks({
      ...socialLinks,
      [e.target.name]: e.target.value,
    });
  };

  // Cancel edit mode - reset all form fields to original values
  const handleCancel = () => {
    setIsEditing(false);
    setSaveError("");
    setEmail(currentUser?.email || "");
    setSocialLinks(currentUser?.socialLinks || {});
    setProfileImageFile(null);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  };

  // handleSave - Update email, social links, and profile picture
  const handleSave = async () => {
    setSaveError("");
    const token = localStorage.getItem("authToken");
    try {
      // Send updated profile data to backend
      await axios.patch(
        `${API_URL}/users/me`,
        {
          email,
          profilePicture,
          socialLinks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Refresh user data in AuthContext
      await authenticateUser();
      setIsEditing(false);
    } catch (err) {
      const msg =
        err.response?.data?.errorMessage || "Profile update failed. Please try again.";
      setSaveError(msg);
    }
  };

  // handlePasswordChange - Update user password (requires old password verification)
  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    // Client-side validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      // Call backend endpoint to verify old password and update to new password
      await axios.patch(
        `${API_URL}/users/me/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPasswordSuccess("Password updated successfully.");
      // Clear password fields after successful update
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg =
        err.response?.data?.errorMessage || "Password update failed. Please try again.";
      setPasswordError(msg);
    }
  };

  // handleProfilePictureUpload - Upload profile picture to Cloudinary via backend
  const handleProfilePictureUpload = async () => {
    if (!profileImageFile) return;

    setIsUploadingImage(true);
    setSaveError("");
    const token = localStorage.getItem("authToken");
    try {
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append("image", profileImageFile);

      // Upload to Cloudinary via backend
      const { data } = await axios.post(
        `${API_URL}/users/me/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update local state and refresh user data
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

          {isEditing ? (
            <div className="profile-row">
              <span className="profile-label">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="profile-input"
              />
            </div>
          ) : (
            <p className="profile-email">{currentUser.email}</p>
          )}

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

        {isEditing && (
          <div className="profile-section">
            <h3>Change Password</h3>

            {passwordError && <p className="profile-error">{passwordError}</p>}
            {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}

            <div className="profile-row">
              <span className="profile-label">Current password</span>
              <div className="password-input-wrapper">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="profile-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="profile-row">
              <span className="profile-label">New password</span>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="profile-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="profile-row">
              <span className="profile-label">Confirm password</span>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="profile-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button className="btn-secondary" onClick={handlePasswordChange}>
              Update Password
            </button>
          </div>
        )}

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
