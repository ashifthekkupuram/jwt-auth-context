import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { authContext } from "../context/authProvider";
import Post from "../components/Post";
import axios from "../api/axios";

const User = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(authContext);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios(`/user/${userId}`);
        setProfile(response.data.user);
        setPosts(response.data.posts);
      } catch (err) {
        if (err?.response) {
            setError(err.response.data.message);
        } else {
            setError('Internal Server Error');
        }
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div className="container">
      {error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <div className="profile">
            <img src={profile.profile} alt="profile" />
            <h1>@{profile.username}</h1>
            <Link to="/">Follow</Link>
          </div>
          <div className="profile-contents">posts</div>
          <div className="profile-posts-container">
            {posts.map((post) => (
              <Post post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default User;
