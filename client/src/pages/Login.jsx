import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

import axios from "../api/axios";
import { authContext } from "../context/authProvider";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { user, setUser } = useContext(authContext);

  const onChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(null);
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", form);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.data);
      navigate("/");
      toast.success("Logged In");
    } catch (err) {
      if (err?.response) {
        setError(err.response.data.message);
      } else {
        setError("Internal Server Error");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Login Page</h1>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <label htmlFor="email">Email : </label>
          <input
            value={form.email}
            autoComplete="off"
            type="email"
            id="email"
            onChange={onChange}
            required
          />
          <label htmlFor="password">Password : </label>
          <input
            value={form.password}
            type="password"
            id="password"
            onChange={onChange}
            required
          />
          <button
            disabled={
              !(form.email.match(EMAIL_REGEX) && form.password) || loading
            }
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Login;
