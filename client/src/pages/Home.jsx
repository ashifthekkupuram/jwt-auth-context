import React, { useState, useEffect } from "react";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "../api/axios";
import Post from "../components/Post";
import PostDeleteModal from "../components/PostDeleteModal";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState({id: null,title: ''}) 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/post");
        setPosts(response.data.posts);
      } catch (err) {
        console.log(posts);
      }
    };
    fetchPosts();
  }, [showModal]);

  const handleDeleteClick = (post) => {
    setSelectedPost({id: post._id, title: post.title})
    setShowModal(true)
  }

  const closeModal = (e) => {
    setShowModal(false)
  }

  return (
    <>
      <div className="posts-container">
        {posts
          ? posts.map((post) => {
              return <Post key={post._id} post={post} onDelete={handleDeleteClick} />;
            })
          : null}
      </div>
      {showModal ? <PostDeleteModal closeModal={closeModal} setShowModal={setShowModal} postId={selectedPost.id} postTitle={selectedPost.title} onHome={true} /> : null}
      <ToastContainer />
    </>
  );
};

export default Home;
