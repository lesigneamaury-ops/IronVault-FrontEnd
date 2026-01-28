import { useEffect, useState } from "react";
import axios from "axios";
import ItemDetailsPage from "./ItemDetailsPage";
import "./LikedPage.css";
import { API_URL } from "../../config/config";

function LikedPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const token = localStorage.getItem("authToken");

  const fetchLikedItems = async () => {
    setIsLoading(true);
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
    fetchLikedItems();
  }, []);
  const openDetails = (item) => setSelectedItem(item);
  const closeDetails = () => setSelectedItem(null);

  return (
    <div className="liked-page">
      <div className="liked-header">
        <h1 className="liked-title">Liked</h1>
        <p className="liked-subtitle">All the images you liked.</p>
      </div>

      {isLoading ? (
        <div className="liked-state">Loading...</div>
      ) : items.length === 0 ? (
        <div className="liked-empty">
          <div className="liked-empty-title">No liked items yet</div>
          <div className="liked-empty-text">
            Like an image in the gallery, and it will show up here.
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

                <div className="liked-row">
                  <span>Likes</span>
                  <span>{item.likes?.length || 0}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedItem && (
        <ItemDetailsPage item={selectedItem} onClose={closeDetails} />
      )}
    </div>
  );
}

export default LikedPage;
