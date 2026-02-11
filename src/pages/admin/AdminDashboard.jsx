import { useEffect, useState } from "react";
import axios from "axios";
import ItemDetailsPage from "../user/ItemDetailsPage";
import "./AdminDashboard.css";
import { API_URL } from "../../config/config";

function AdminDashboard() {
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohortId, setSelectedCohortId] = useState("");
  const [students, setStudents] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchCohorts = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      try {
        const { data } = await axios.get(`${API_URL}/admin/cohorts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cohortList = Array.isArray(data) ? data : [];
        setCohorts(cohortList);

        if (cohortList.length > 0) {
          setSelectedCohortId((prev) => prev || cohortList[0]._id);
        }
      } catch (error) {
        setCohorts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCohorts();
  }, []);

  useEffect(() => {
    if (!selectedCohortId) return;

    const fetchCohortData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      try {
        const [studentsRes, itemsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/cohorts/${selectedCohortId}/students`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/admin/cohorts/${selectedCohortId}/items`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
        setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
      } catch (error) {
        setStudents([]);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCohortData();
  }, [selectedCohortId]);

  const handleItemDeleted = (deletedId) => {
    setItems((prev) => prev.filter((it) => it._id !== deletedId));
    setSelectedItem(null);
  };

  const handleItemUpdated = (updatedItem) => {
    setItems((prev) =>
      prev.map((it) => (it._id === updatedItem._id ? updatedItem : it)),
    );
    setSelectedItem(updatedItem);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Admin Moderation</h1>
        <p className="admin-subtitle">
          Select a cohort, review all uploads, and moderate items/comments.
        </p>
      </div>

      <section className="admin-panel">
        <label className="admin-label" htmlFor="cohort-select">
          Cohort
        </label>
        <select
          id="cohort-select"
          className="admin-select"
          value={selectedCohortId}
          onChange={(e) => setSelectedCohortId(e.target.value)}
        >
          {cohorts.map((cohort) => (
            <option key={cohort._id} value={cohort._id}>
              {`${cohort.course}-${cohort.month}-${cohort.year}`}
            </option>
          ))}
        </select>
      </section>

      {isLoading ? (
        <div className="admin-state">Loading...</div>
      ) : (
        <div className="admin-grid">
          <section className="admin-block">
            <h2>Students ({students.length})</h2>
            {students.length === 0 ? (
              <div className="admin-empty">No students in this cohort.</div>
            ) : (
              <div className="admin-students">
                {students.map((student) => (
                  <article key={student._id} className="admin-student-card">
                    <img
                      src={student.profilePicture || "/assets/defaultAvatar.png"}
                      alt={student.userName}
                    />
                    <div className="admin-student-name">{student.userName}</div>
                    <div className="admin-student-email">{student.email}</div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="admin-block">
            <h2>Images ({items.length})</h2>
            {items.length === 0 ? (
              <div className="admin-empty">No images in this cohort.</div>
            ) : (
              <div className="admin-items">
                {items.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    className="admin-item-btn"
                    onClick={() => setSelectedItem(item)}
                    aria-label="Open item moderation"
                  >
                    <img src={item.imageUrl} alt={item.caption || "Cohort item"} />
                    <div className="admin-item-meta">
                      <span>{item.postedBy?.userName || "Unknown"}</span>
                      <span>{item.reactions?.length || 0} reactions</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {selectedItem && (
        <ItemDetailsPage
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdated={handleItemUpdated}
          onDeleted={handleItemDeleted}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
