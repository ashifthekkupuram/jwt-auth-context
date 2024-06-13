import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../api/axios";

const PostForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
  });

  const onChange = (e) => {
    if (e.target.id == "image") {
      setForm({ ...form, [e.target.id]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(null);
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('image', form.image)
      const response = await axios.post("/post", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,"Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      if (err?.response) {
        setError(err.response.data.message);
        console.log(err.response.data.error)
      } else {
        setError("Internal Server Error");
      }
    }
    setLoading(false);
  };

  console.log(form);

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Post Creation</h1>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <label htmlFor="title">Title : </label>
        <input
          value={form.title}
          autoComplete="off"
          type="text"
          id="title"
          onChange={onChange}
          required
        />
        <label htmlFor="description">Description : </label>
        <input
          value={form.description}
          autoComplete="off"
          type="text"
          id="description"
          onChange={onChange}
          required
        />
        <label htmlFor="image">Image : </label>
        <input
          type="file"
          name="image"
          id="image"
          required
          onChange={onChange}
        />
        <button disabled={!form.title || !form.description || !form.image || loading}>
          {loading ? "Loading..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
