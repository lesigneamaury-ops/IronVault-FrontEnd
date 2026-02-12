// CohortPage - Displays all students from the same cohort as the current user
import { useEffect, useState } from "react";
import axios from "axios";
import "./CohortPage.css";
import { API_URL } from "../../config/config";

// isSafeUrl - Validates URLs to prevent attacks
function isSafeUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function CohortPage() {
  const [students, setStudents] = useState([]); // Students from same cohort
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all students from current user's cohort on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      try {
        // Backend returns students from same cohort as current user
        const { data } = await axios.get(`${API_URL}/cohorts/me/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(Array.isArray(data) ? data : []);
      } catch (error) {
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // renderSocialLink - Render social link as clickable link or "-" if invalid/empty
  const renderSocialLink = (label, url) => {
    const safe = isSafeUrl(url);
    return (
      <div className="social-item">
        <span className="social-label">{label}:</span>
        {safe ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        ) : (
          <span className="no-link">-</span>
        )}
      </div>
    );
  };

  return (
    <div className="cohort-page">
      <div className="cohort-header">
        <h1 className="cohort-title">My Cohort</h1>
        <p className="cohort-subtitle">
          Students from the same cohort as your account.
        </p>
      </div>

      {isLoading ? (
        <div className="cohort-state">Loading...</div>
      ) : students.length === 0 ? (
        <div className="cohort-empty">
          <div className="cohort-empty-title">No students found</div>
          <div className="cohort-empty-text">
            Add cohort assignments to users to populate this page.
          </div>
        </div>
      ) : (
        <div className="cohort-grid">
          {students.map((student) => (
            <article className="cohort-card" key={student._id}>
              <img
                className="cohort-avatar"
                src={student.profilePicture || "/assets/defaultAvatar.png"}
                alt={student.userName}
              />
              <div className="cohort-user">{student.userName}</div>
              <div className="cohort-email">{student.email}</div>
              <div className="cohort-socials">
                {renderSocialLink("LinkedIn", student.socialLinks?.linkedin)}
                {renderSocialLink("GitHub", student.socialLinks?.github)}
                {renderSocialLink("Instagram", student.socialLinks?.instagram)}
                {renderSocialLink("Twitter", student.socialLinks?.twitter)}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default CohortPage;
