import { useEffect, useState } from "react";
import axios from "axios";
import ItemDetailsPage from "./ItemDetailsPage";
import "./LikedPage.css";
import { API_URL } from "../../config/config";

function ReactedPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchReactedItems = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const { data } = await axios.get(`${API_URL}/items/liked`, {
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
    fetchReactedItems();
  }, []);

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

  return (
    <div className="liked-page">
      <div className="liked-header">
        <h1 className="liked-title">Reacted</h1>
        <p className="liked-subtitle">Items with your reactions.</p>
      </div>

      {isLoading ? (
        <div className="liked-state">Loading...</div>
      ) : items.length === 0 ? (
        <div className="liked-empty">
          <div className="liked-empty-title">No reacted items yet</div>
          <div className="liked-empty-text">
            React to an image in the gallery, and it will show up here.
          </div>
        </div>
      ) : (
        <div className="liked-grid">
          {items.map((item) => (
            <article className="liked-card" key={item._id}>
              <img
                className="liked-image"
                src={item.imageUrl}
                alt={item.caption || "Item"}
                onClick={() => openDetails(item)}
              />

              <div className="liked-meta">
                <div className="liked-caption">{item.caption || "—"}</div>

                <div className="liked-row">
                  <span>Posted by</span>
                  <span>{item.postedBy?.userName || "Unknown"}</span>
                </div>

                <div className="liked-reactions">
                  {item.reactions && item.reactions.length > 0 ? (
                    item.reactions.map((r) => (
                      <div className="liked-reaction" key={r.emoji}>
                        <span className="emoji">{r.emoji}</span>
                        <span className="count">{r.users?.length || 0}</span>
                      </div>
                    ))
                  ) : (
                    <div className="liked-reaction-empty">-</div>
                  )}
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
          onDeleted={handleItemDeleted}
          onUpdated={handleItemUpdated}
        />
      )}
    </div>
  );
}

export default ReactedPage;
