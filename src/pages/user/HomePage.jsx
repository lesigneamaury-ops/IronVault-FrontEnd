import { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";
import ItemDetailsPage from "./ItemDetailsPage";

const API_URL = "http://localhost:5005/api";

function HomePage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [taggedUsersRaw, setTaggedUsersRaw] = useState("");
  const [formError, setFormError] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);

  const token = localStorage.getItem("authToken");

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setFormError("");
    setIsModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setCaption("");
    setTaggedUsersRaw("");
    setFormError("");
  };

  const openDetails = (item) => {
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  const handleItemDeleted = (deletedId) => {
    setItems((prev) => prev.filter((it) => it._id !== deletedId));
  };

  const handleItemUpdated = (updatedItem) => {
    setItems((prev) =>
      prev.map((it) => (it._id === updatedItem._id ? updatedItem : it)),
    );
    setSelectedItem(updatedItem);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!file) {
      setFormError("Please select an image.");
      return;
    }

    const taggedUsers = taggedUsersRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);
      formData.append("taggedUsers", JSON.stringify(taggedUsers));

      await axios.post(`${API_URL}/items/create-item`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      closeCreateModal();
      fetchItems();
    } catch (err) {
      setFormError("Upload failed. Please try again.");
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">Gallery</h1>
        <p className="home-subtitle">It's all about timing and creativity!</p>
      </div>

      {isLoading ? (
        <div className="home-state">Loading...</div>
      ) : items.length === 0 ? (
        <div className="home-empty">
          <div className="home-empty-title">No items yet</div>
          <div className="home-empty-text">
            Click the + button to add the first image.
          </div>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <article className="item-card" key={item._id}>
              <img
                className="item-image"
                src={item.imageUrl}
                alt={item.caption || "Item"}
                onClick={() => openDetails(item)}
              />

              <div className="item-meta">
                <div className="item-caption">{item.caption || "—"}</div>

                <div className="item-row">
                  <span>Posted by</span>
                  <span>{item.postedBy?.userName || "Unknown"}</span>
                </div>

                <div className="item-row">
                  <span>Likes</span>
                  <span>{item.likes?.length || 0}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <button className="additem-btn" type="button" onClick={openCreateModal}>
        <img
          src="/assets/addItemBtn.png"
          alt="Add Item"
          className="additem-icon"
        />
      </button>

      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Add a new image</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <input
                type="text"
                placeholder="Tagged users (optional)"
                value={taggedUsersRaw}
                onChange={(e) => setTaggedUsersRaw(e.target.value)}
              />

              <textarea
                placeholder="Description"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />

              {formError && <p className="form-error">{formError}</p>}

              <div className="modal-actions">
                <button type="button" onClick={closeCreateModal}>
                  Cancel
                </button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedItem && (
        <ItemDetailsPage
          item={selectedItem}
          onClose={closeDetails}
          onDeleted={handleItemDeleted}
          onUpdated={handleItemUpdated}
        />
      )}
    </div>
  );
}

export default HomePage;
