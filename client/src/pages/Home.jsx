import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from 'react-loading'

import axios from "../api/axios";
import Post from '../components/Post'
import PostDeleteModal from '../components/PostDeleteModal'

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState({ id: null, title: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/post");
        setPosts(response.data.posts);
        setError(null);
        setLoading(false);
      } catch (err) {
        if (err?.response) {
          setError(err?.response.data.message);
        } else {
          setError("Internal Server Error");
        }
        setLoading(false);
      }
    };
    setLoading(true);
    setError(null);
    fetchPosts();
  }, [showModal]);

  const handleDeleteClick = (post) => {
    setSelectedPost({ id: post._id, title: post.title });
    setShowModal(true);
  };

  const closeModal = (e) => {
    setShowModal(false);
  };

  return loading ? (
    <ReactLoading className="loading" type="bubbles" color="slategrey" height={'10%'} width={'10%'} />
  ) : error ? (
    <><h1 className="error">{error}</h1></>
  ) : (
    <>
      <div className="posts-container">
        {posts
          ? posts.map((post) => {
              return (
                <Post key={post._id} post={post} onDelete={handleDeleteClick} />
              );
            })
          : null}
      </div>
      {showModal ? (
        <PostDeleteModal
          closeModal={closeModal}
          setShowModal={setShowModal}
          postId={selectedPost.id}
          postTitle={selectedPost.title}
          onHome={true}
        />
      ) : null}
      <ToastContainer />
    </>
  );
};

export default Home;
