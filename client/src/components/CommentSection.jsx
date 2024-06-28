import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

import axios from "../api/axios";
import Loading from "react-loading";
import { authContext } from "../context/authProvider";

const CommentSection = ({
  userId,
  postId,
  setCommentId,
  setCommentUpdating,
}) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(authContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/comment/${postId}`);
        setComments(response.data.comments);
        setError(null);
        setLoading(false);
      } catch (err) {
        if (err?.response) {
          setError(err.response.data.message);
        } else {
          setError("Internal Server Error");
        }
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId, comments]);

  const onDelete = async (commentId) => {
    try {
      await axios.delete(`/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Comment Deleted");
    } catch (err) {
      if (err?.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Internal Server Error");
      }
    }
  };

  const onUpdate = async (commentId) => {
    setCommentId(commentId);
    setCommentUpdating(true);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <h1 className="comment-error">{error}</h1>
      ) : comments.length > 0 ? (
        <div className="comment-section">
          {comments.map((comment) => {
            return (
              <div key={comment._id} className="comment">
                <div className="comment-avatar">
                  <img src={comment.author.profile} alt="profile" />
                  <small>@{comment.author.username}</small>
                  {comment.author._id === userId ? (
                    <>
                      <small>(author)</small>
                    </>
                  ) : null}
                </div>
                <div className="comment-content">
                  <p>{comment.content}</p>
                  <small>
                    {moment(comment.createdAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                    {moment(comment.createdAt).valueOf() !==
                    moment(comment.updatedAt).valueOf()
                      ? "(edited)"
                      : null}
                    {comment.author._id === user?._id ||
                    comment.post.author === user?._id ? (
                      <MdDelete
                        className="icon"
                        onClick={(e) => onDelete(comment._id)}
                        color="red"
                      />
                    ) : null}
                    {comment.author._id === user?._id ? (
                      <MdEdit
                        onClick={(e) => onUpdate(comment._id)}
                        className="icon"
                      />
                    ) : null}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <h1 className="comment-error">No Comment were added</h1>
      )}
    </>
  );
};

export default CommentSection;
