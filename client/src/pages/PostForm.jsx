import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "../api/axios";
import {authContext} from "../context/authProvider";

const PostForm = ({ updating }) => {
  const { user } = useContext(authContext);
  const { postId } = useParams();
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
    if (updating) {
      try {
        if (form.image) {
          const formData = new FormData();
          formData.append("title", form.title);
          formData.append("description", form.description);
          formData.append("image", form.image);

          const response = await axios.put(`/post/${postId}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          });
          navigate("/");
          toast.success("Post Updated!");
        } else {
          const formData = new FormData();
          formData.append("title", form.title);
          formData.append("description", form.description);
          const response = await axios.put(`/post/${postId}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          });
          navigate("/");
          toast.success("Post Updated!");
        }
      } catch (err) {
        if (err?.response) {
          setError(err.response.data.message);
          console.log(err.response.data.error);
        } else {
          setError("Internal Server Error");
        }
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("image", form.image);
        const response = await axios.post("/post", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        navigate("/");
        toast.success("Post Created!");
      } catch (err) {
        if (err?.response) {
          setError(err.response.data.message);
          console.log(err.response.data.error);
        } else {
          setError("Internal Server Error");
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${postId}`);
        if (response.data.post.author._id !== user._id) {
          toast.error("Forbidden");
          navigate("/");
        } else {
          setForm({
            ...form,
            title: response.data.post.title,
            description: response.data.post.description,
          });
        }
      } catch (err) {
        if (err?.response) {
          toast.error(err.response.data.message);
          navigate("/");
        } else {
          toast.error("Internal Server Error");
          navigate("/");
        }
      }
    };
    if (updating) {
      fetchPost();
    }
  }, [postId, updating]);

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Post {updating ? "Updation" : "Creation"}</h1>
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
        <input type="file" name="image" id="image" onChange={onChange} />
        <button
          disabled={
            updating
              ? !form.title || !form.description || loading
              : !form.title || !form.description || !form.image || loading
          }
        >
          {loading ? "Loading..." : updating ? "Update" : "Post"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
