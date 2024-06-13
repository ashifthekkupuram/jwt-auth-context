import React, { useState, useEffect } from "react";

import axios from "../api/axios";
import Post from "../components/Post";

const Home = () => {
  const [posts, setPosts] = useState([]);

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

  return <div>{posts ? posts.map((post) => <Post post={post} />) : null}</div>;
};

export default Home;
