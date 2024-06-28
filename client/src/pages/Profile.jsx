import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { authContext } from "../context/authProvider";
import Post from "../components/Post";
import axios from "../api/axios";

const Profile = () => {
  const profileInput = useRef();
  const { user, setUser } = useContext(authContext);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios(`/user/${user._id}`);
        setPosts(response.data.posts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const onChange = async (e) => {
    const formData = new FormData();
    formData.append("profile", e.target.files[0]);
    try {
      const response = await axios.post("/user/update_profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser({ ...user, profile: response.data.filename });
      setProfile("");
    } catch (err) {
      if (err?.response) {
        console.log(err.response.data.message);
      } else {
        console.log("Something went wrong");
      }
    }
  };

  const onClick = async (e) => {
    e.preventDefault();
    profileInput.current.click();
  };

  return (
    <div className="container">
      <div className="profile">
        <input
          className="hide"
          value={profile}
          type="file"
          name="profile"
          id="profile"
          ref={profileInput}
          onChange={onChange}
        />

        <img onClick={onClick} src={user.profile} alt="profile" />
        <h1>@{user.username}</h1>
        <Link to="/profile_form">Change Username</Link>
      </div>
      <div className="profile-contents">posts</div>
      <div className="profile-posts-container">
        {posts.map((post) => (
          <Post post={post} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
