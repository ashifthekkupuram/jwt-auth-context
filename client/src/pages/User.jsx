import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

import { authContext } from "../context/authProvider";
import Post from "../components/Post";
import axios from "../api/axios";

const User = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(authContext);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios(`/user/${userId}`);
        setProfile(response.data.user);
        setPosts(response.data.posts);
        setError(null)
        setLoading(false)
      } catch (err) {
        if (err?.response) {
          setError(err.response.data.message);
        } else {
          setError("Internal Server Error");
        }
        setLoading(false)
      }
    };
    setLoading(true)
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (user && (user._id === profile?._id)) {
      navigate("/profile");
    }
  }, [profile, user, navigate]);

  return loading ? (
    <ReactLoading
      className="loading"
      type="bubbles"
      color="slategrey"
      height={"10%"}
      width={"10%"}
    />
  ) : (
    <div className="container">
      {error ? (
        <h1 style={{color: "slategray"}}>{error}</h1>
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
              <Post key={post._id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default User;
