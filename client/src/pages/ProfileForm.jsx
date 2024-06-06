import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authContext } from "../context/authProvider";
import axios from "../api/axios";

const ProfileForm = () => {
  const navigate = useNavigate();
  const usernameField = useRef();
  const { user, setUser } = useContext(authContext);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "/user/update_username",
        { username },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUser({ ...user, username: response.data.updatedUsername });
      setLoading(false);
      navigate("/profile");
    } catch (err) {
      if (err?.response) {
        setError(err.response.data.message);
      } else {
        setError("Internal server error");
      }
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      usernameField.current.focus();
    }
  }, []);

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Update Username</h1>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <label htmlFor="username">Username : </label>
        <input
          ref={usernameField}
          value={username}
          autoComplete="off"
          type="text"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button disabled={!username || loading}>
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
