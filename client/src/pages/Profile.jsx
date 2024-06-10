import React, { useContext } from "react";

import { authContext } from "../context/authProvider";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(authContext);

  return (
    <div className="container">
      <div className="profile">
        <img src={user.profile} alt="profile" />
        <h1>@{user.username}</h1>
        <Link to='/profile_form'>Change Username</Link>
      </div>
      <div className="profile-contents">
        posts
      </div>
    </div>
  );
};

export default Profile;
