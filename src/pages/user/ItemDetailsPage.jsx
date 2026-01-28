import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./ItemDetailsPage.css";
import { useAuth } from "../../context/AuthContext";
import { FEATURES } from "../../config/freatures";

const API_URL = "http://localhost:5005/api";

function ItemDetailsPage({ item, onClose, onDeleted, onUpdated }) {
  const { user } = useAuth();
  const token = localStorage.getItem("authToken");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const [actionError, setActionError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(item?.caption || "");
  const [editLoading, setEditLoading] = useState(false);

  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [commentActionLoading, setCommentActionLoading] = useState(false);

  const postedById =
    typeof item?.postedBy === "string" ? item?.postedBy : item?.postedBy?._id;

  const isAdmin = user?.role === "ADMIN";
  const isAuthor =
    user?._id && postedById && String(user._id) === String(postedById);
  const canManage = isAdmin || isAuthor;

  const likesCount = useMemo(() => item?.likes?.length || 0, [item]);

  const fetchComments = async () => {
    setCommentsLoading(true);
    setCommentError("");
    try {
      const { data } = await axios.get(
        `${API_URL}/comments/items/${item._id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setComments([]);
      setCommentError("Failed to load comments.");
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (item?._id) fetchComments();
  }, [item?._id]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    setCommentError("");

    const content = newComment.trim();
    if (!content) return;

    try {
      await axios.post(
        `${API_URL}/comments/items/${item._id}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setNewComment("");
      fetchComments();
    } catch (err) {
      setCommentError("Failed to post comment.");
    }
  };

  const handleDeleteItem = async () => {
    setActionError("");
    try {
      await axios.delete(`${API_URL}/items/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onClose) onClose();
      if (onDeleted) onDeleted(item._id);
    } catch (err) {
      setActionError("Delete failed.");
    }
  };

  const handleToggleLike = async () => {
    setActionError("");
    try {
      const { data } = await axios.patch(
        `${API_URL}/items/${item._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (onUpdated) onUpdated(data);
    } catch (err) {
      setActionError("Like failed.");
    }
  };

  const startEdit = () => {
    setActionError("");
    setIsEditing(true);
    setEditCaption(item?.caption || "");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditCaption(item?.caption || "");
  };

  const handleSaveEdit = async () => {
    setActionError("");
    const caption = editCaption.trim();

    setEditLoading(true);
    try {
      const { data } = await axios.patch(
        `${API_URL}/items/${item._id}`,
        { caption },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsEditing(false);
      if (onUpdated) onUpdated(data);
    } catch (err) {
      setActionError("Update failed.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const getCommentAuthorId = (c) =>
    c?.author?._id || c?.user?._id || c?.author || c?.user;

  const canManageComment = (c) => {
    const authorId = getCommentAuthorId(c);
    const isCommentAuthor =
      user?._id && authorId && String(user._id) === String(authorId);
    return isAdmin || isCommentAuthor;
  };

  const openCommentMenu = (commentId) => {
    setMenuOpenFor((prev) => (prev === commentId ? null : commentId));
  };

  const beginEditComment = (c) => {
    setMenuOpenFor(null);
    setEditingCommentId(c._id);
    setEditCommentValue(c.content || "");
    setCommentError("");
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentValue("");
  };

  const handleSaveComment = async (commentId) => {
    const content = editCommentValue.trim();
    if (!content) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    setCommentActionLoading(true);
    setCommentError("");
    try {
      const { data } = await axios.patch(
        `${API_URL}/comments/comments/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setComments((prev) => prev.map((c) => (c._id === commentId ? data : c)));
      cancelEditComment();
    } catch (err) {
      setCommentError("Failed to update comment.");
    } finally {
      setCommentActionLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setCommentActionLoading(true);
    setCommentError("");
    try {
      await axios.delete(`${API_URL}/comments/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setMenuOpenFor(null);
    } catch (err) {
      setCommentError("Failed to delete comment.");
    } finally {
      setCommentActionLoading(false);
    }
  };

  return (
    <div className="item-details-overlay" role="dialog" aria-modal="true">
      <button
        className="item-details-backdrop"
        type="button"
        onClick={handleClose}
        aria-label="Close"
      />

      <div className="item-details">
        <button
          className="item-details-close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="item-details-body">
          <div className="item-details-left">
            <img
              className="item-details-image"
              src={item.imageUrl}
              alt={item.caption || "Item"}
            />

            <div className="item-details-actions">
              <button
                type="button"
                className="item-details-btn"
                onClick={handleToggleLike}
              >
                Like ({likesCount})
              </button>

              {canManage && (
                <>
                  <button
                    type="button"
                    className="item-details-btn"
                    onClick={startEdit}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="item-details-btn danger"
                    onClick={handleDeleteItem}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {actionError && (
              <div className="item-details-error">{actionError}</div>
            )}
          </div>

          <div className="item-details-right">
            <div className="item-details-header">
              <div className="item-details-title">
                {item.postedBy?.userName || "Unknown"}
              </div>
              {FEATURES.TAGS && (
                <div className="item-details-subtitle">
                  {item.taggedUsers?.length
                    ? `Tagged: ${item.taggedUsers.map((u) => u.userName).join(", ")}`
                    : "Tagged: —"}
                </div>
              )}
            </div>

            <div className="item-details-caption">
              {!isEditing ? (
                <p className="item-details-caption-text">
                  {item.caption || "—"}
                </p>
              ) : (
                <div className="item-details-edit">
                  <textarea
                    className="item-details-textarea"
                    rows="3"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                  />

                  <div className="item-details-edit-actions">
                    <button
                      type="button"
                      className="item-details-btn"
                      onClick={cancelEdit}
                      disabled={editLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="item-details-btn primary"
                      onClick={handleSaveEdit}
                      disabled={editLoading}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="item-details-comments">
              <div className="item-details-comments-title">Comments</div>

              {commentsLoading ? (
                <div className="item-details-state">Loading...</div>
              ) : comments.length === 0 ? (
                <div className="item-details-empty">No comments yet.</div>
              ) : (
                <div className="item-details-comments-list">
                  {comments.map((c) => (
                    <div className="item-details-comment" key={c._id}>
                      <div className="item-details-comment-header">
                        <div className="item-details-comment-author">
                          {c.user?.userName || c.author?.userName || "User"}
                        </div>

                        {canManageComment(c) && (
                          <div className="comment-menu">
                            <button
                              type="button"
                              className="comment-menu-btn"
                              onClick={() => openCommentMenu(c._id)}
                              aria-label="Comment actions"
                              disabled={commentActionLoading}
                            >
                              ⋯
                            </button>

                            {menuOpenFor === c._id && (
                              <div className="comment-menu-dropdown">
                                <button
                                  type="button"
                                  className="comment-menu-item"
                                  onClick={() => beginEditComment(c)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="comment-menu-item danger"
                                  onClick={() => handleDeleteComment(c._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {editingCommentId === c._id ? (
                        <div className="comment-edit">
                          <textarea
                            className="item-details-textarea"
                            rows="3"
                            value={editCommentValue}
                            onChange={(e) =>
                              setEditCommentValue(e.target.value)
                            }
                            disabled={commentActionLoading}
                          />
                          <div className="comment-edit-actions">
                            <button
                              type="button"
                              className="item-details-btn"
                              onClick={cancelEditComment}
                              disabled={commentActionLoading}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="item-details-btn primary"
                              onClick={() => handleSaveComment(c._id)}
                              disabled={commentActionLoading}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="item-details-comment-content">
                          {c.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {commentError && (
                <div className="item-details-comment-error">{commentError}</div>
              )}

              <form
                className="item-details-comment-form"
                onSubmit={handleCreateComment}
              >
                <input
                  className="item-details-comment-input"
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className="item-details-btn primary"
                  type="submit"
                  disabled={commentActionLoading}
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsPage;
