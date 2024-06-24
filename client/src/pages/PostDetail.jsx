import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import moment from "moment";

import axios from "../api/axios";
import { authContext } from "../context/authProvider";
import PostDeleteModal from "../components/PostDeleteModal";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const { user } = useContext(authContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${postId}`);
        setPost(response.data.post);
      } catch (err) {}
    };
    fetchPost();
  }, [postId]);

  return (
    <>
      <div className="post-container">
        {post ? (
          <>
            <img src={post.image} alt="image" />
            <h1>{post.title}</h1>
            <p>{post.description}</p>
            <div className="post-author">
              <small>by </small>
              <img src={post.author.profile} alt="profile" />
              <h6>{post.author.username}</h6>
              <small>
                at {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </small>
            </div>
            {user?._id === post.author._id ? (
              <div className="post-a">
                <Link style={{ backgroundColor: "green" }} to={`/update_post/${post._id}`}>
                  Edit
                </Link>
                <button onClick={(e) => setShowModal(true)} style={{ backgroundColor: "red" }} to="profile">
                  Delete
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <h1>No Post Found</h1>
        )}
      </div>
      {showModal ? <PostDeleteModal postId={post._id} postTitle={post.title} setShowModal={setShowModal} onHome={false} /> : null}
    </>
  );
};

export default PostDetail;
