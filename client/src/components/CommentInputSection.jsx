import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

const CommentInputSection = ({
  postId,
  setCommentUpdating,
  commentUpdating,
  commentId,
  setCommentId,
}) => {
  const [comment, setComment] = useState("");

  const onClick = async (e) => {
    e.preventDefault();
    try {
      if (commentUpdating) {
        await axios.put(
          `/comment/${commentId}`,
          { content: comment },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCommentId(null);
        setCommentUpdating(false);
        setComment("");
        toast.success("Comment updated");
      } else {
        await axios.post(
          `/comment/${postId}`,
          { content: comment },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setComment("");
        toast.success("Comment added");
      }
    } catch (err) {
      if (err?.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Internal Server Error");
      }
    }
  };

  useEffect(() => {
    const fetchComment = async (req, res, next) => {
      try {
        const response = await axios.get(`/comment/single/${commentId}`);
        setComment(response.data.comment.content);
      } catch (err) {
        setComment(null);
        setCommentUpdating(false);
        if (err?.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Internal Server Error");
        }
      }
    };
    if (commentUpdating) {
      fetchComment();
    }
  }, [commentUpdating]);

  return (
    <div className="comment-input-section">
      <textarea
        value={comment}
        type="text"
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button disabled={comment.trim().length < 1} onClick={onClick}>
        {commentUpdating ? "Update" : "Comment"}
      </button>
      {commentUpdating ? (
        <button
          style={{ backgroundColor: "red" }}
          onClick={(e) => {
            setCommentId(null);
            setComment("");
            setCommentUpdating(false);
          }}
        >
          Cancel
        </button>
      ) : null}
    </div>
  );
};

export default CommentInputSection;
