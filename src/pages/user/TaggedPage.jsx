import { useEffect, useState } from "react";
import axios from "axios";
import ItemDetailsPage from "./ItemDetailsPage";
import "./TaggedPage.css";
import { API_URL } from "../../config/config";

function TaggedPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const token = localStorage.getItem("authToken");

  const fetchTaggedItems = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/items/tagged`, {
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
    fetchTaggedItems();
  }, []);

  const openDetails = (item) => setSelectedItem(item);
  const closeDetails = () => setSelectedItem(null);

  const handleUpdatedItem = (updatedItem) => {
    setItems((prev) =>
      prev.map((it) => (it._id === updatedItem._id ? updatedItem : it)),
    );

    setSelectedItem((prev) =>
      prev && prev._id === updatedItem._id ? updatedItem : prev,
    );
  };

  const handleDeletedItem = (deletedId) => {
    setItems((prev) => prev.filter((it) => it._id !== deletedId));
    setSelectedItem(null);
  };

  return (
    <div className="tagged-page">
      <div className="tagged-header">
        <h1 className="tagged-title">Tagged</h1>
        <p className="tagged-subtitle">All images where you are tagged.</p>
      </div>

      {isLoading ? (
        <div className="tagged-state">Loading...</div>
      ) : items.length === 0 ? (
        <div className="tagged-empty">
          <div className="tagged-empty-title">No tagged items yet</div>
          <div className="tagged-empty-text">
            When someone tags you on an image, it will appear here.
          </div>
        </div>
      ) : (
        <div className="tagged-grid">
          {items.map((item) => (
            <article className="tagged-card" key={item._id}>
              <button
                type="button"
                className="tagged-image-btn"
                onClick={() => openDetails(item)}
                aria-label="Open item details"
              >
                <img
                  className="tagged-image"
                  src={item.imageUrl}
                  alt={item.caption || "Item"}
                />
              </button>

              <div className="tagged-meta">
                <div className="tagged-caption">{item.caption || "—"}</div>

                <div className="tagged-row">
                  <span>Posted by</span>
                  <span>{item.postedBy?.userName}</span>
                </div>

                <div className="tagged-row">
                  <span>Likes</span>
                  <span>{item.likes?.length || 0}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedItem && (
        <ItemDetailsPage
          item={selectedItem}
          onClose={closeDetails}
          onUpdated={handleUpdatedItem}
          onDeleted={handleDeletedItem}
        />
      )}
    </div>
  );
}

export default TaggedPage;
