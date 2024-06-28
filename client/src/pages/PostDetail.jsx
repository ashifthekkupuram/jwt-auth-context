import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import ReactLoading from "react-loading";
import { ToastContainer } from "react-toastify";

import axios from "../api/axios";
import { authContext } from "../context/authProvider";
import PostDeleteModal from "../components/PostDeleteModal";
import CommentInputSection from "../components/CommentInputSection";
import CommentSection from "../components/CommentSection";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const { user } = useContext(authContext);
  const [showModal, setShowModal] = useState(false);
  const [commentUpdating, setCommentUpdating] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${postId}`);
        setPost(response.data.post);
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
    setLoading(true);
    fetchPost();
  }, [postId]);

  return loading ? (
    <ReactLoading
      className="loading"
      type="bubbles"
      color="slategrey"
      height={"10%"}
      width={"10%"}
    />
  ) : error ? (
    <h1 className="error">{error}</h1>
  ) : (
    <>
      <div className="post-container">
        <>
          <img src={post.image} alt="image" />
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <div className="post-author">
            <small>by </small>
            <img src={post.author?.profile} alt="profile" />
            <h6>{post.author?.username}</h6>
            <small>
              at {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              {moment(post.createdAt).valueOf() !==
              moment(post.updatedAt).valueOf()
                ? "(edited)"
                : null}
            </small>
          </div>
          {user?._id === post.author?._id ? (
            <div className="post-a">
              <Link
                style={{ backgroundColor: "green" }}
                to={`/update_post/${post._id}`}
              >
                Edit
              </Link>
              <button
                onClick={(e) => setShowModal(true)}
                style={{ backgroundColor: "red" }}
                to="profile"
              >
                Delete
              </button>
            </div>
          ) : null}
          {user ? (
            <CommentInputSection
              commentId={commentId}
              commentUpdating={commentUpdating}
              setCommentUpdating={setCommentUpdating}
              setCommentId={setCommentId}
              postId={postId}
            />
          ) : null}
          <CommentSection
            setCommentUpdating={setCommentUpdating}
            setCommentId={setCommentId}
            userId={post.author?._id}
            postId={postId}
          />
        </>
      </div>
      {showModal ? (
        <PostDeleteModal
          postId={post._id}
          postTitle={post.title}
          setShowModal={setShowModal}
          onHome={false}
        />
      ) : null}
      <ToastContainer />
    </>
  );
};

export default PostDetail;
