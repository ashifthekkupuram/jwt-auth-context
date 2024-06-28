import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "../api/axios";

const PostDeleteModal = ({
  setShowModal,
  postId,
  postTitle,
  onHome,
  closeModal,
}) => {
  const navigate = useNavigate();

  const onClose = (e) => setShowModal(false);

  const onDelete = async (e) => {
    try {
      await axios.delete(`post/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (onHome) {
        closeModal();
      }
      navigate("/");
      toast.success("Post Deleted");
    } catch (err) {
      if (err?.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Internal Server Error");
      }
    }
  };

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            X
          </button>
          <div className="modal-body">
            <p>Are you sure you want to delete this post?</p>
          </div>
          <div className="modal-footer">
            <button className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="modal-delete" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDeleteModal;
