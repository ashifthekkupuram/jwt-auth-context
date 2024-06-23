import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { authContext } from "../context/authProvider";

const Post = ({ post,onDelete }) => {
  const { user } = useContext(authContext);

  return (
    <div className="post">
      <div className="post-header">
        <Link to={`/profile/${post.author._id}`}><img src={post.author.profile} alt="" /></Link>
        <h6>@{post.author.username}</h6>
      </div>
      <hr />
      <div className="post-main">
        <h3>{post.title}</h3>
        <p>{post.description.slice(0, 25)}...</p>
        <img src={post.image} alt="" />
      </div>
      <hr />
      <div className="post-footer">
        <Link style={{ backgroundColor: "blue" }} to={`/${post._id}`} >
          View
        </Link>
        {user?.id === post.author._id ? (
          <>
            <Link style={{ backgroundColor: "green" }} to="profile">
              Edit
            </Link>
            <button style={{ backgroundColor: "red" }} onClick={() => onDelete(post)}>
              Delete
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Post;
