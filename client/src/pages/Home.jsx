import React, { useState, useEffect } from "react";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "../api/axios";
import Post from "../components/Post";
import PostDeleteModal from "../components/PostDeleteModal";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
  }, []);

  return (
    <>
      <div className="posts-container">
        {posts
          ? posts.map((post) => {
              return <Post key={post._id} post={post} />;
            })
          : null}
      </div>
      {showModal ? <PostDeleteModal setShowModal={setShowModal} /> : null}
      <ToastContainer />
    </>
  );
};

export default Home;
