import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

import axios from "../api/axios";
import Post from "../components/Post";
import PostDeleteModal from "../components/PostDeleteModal";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState({ id: null, title: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/post?page=${page}&search=${search}`);
        setPosts(response.data.posts);
        setPageCount(response.data.pagination.pageCount);
        // console.log(response.data.pagination.pageCount)
        setError(null);
        setLoading(false);
      } catch (err) {
        if (err?.response) {
          setError(err?.response.data.message);
        } else {
          setError("Internal Server Error");
        }
        setLoading(false);
      }
    };
    setLoading(true);
    setError(null);
    fetchPosts();
  }, [showModal, page, search]);

  const handleDeleteClick = (post) => {
    setSelectedPost({ id: post._id, title: post.title });
    setShowModal(true);
  };

  const closeModal = (e) => {
    setShowModal(false);
  };

  const previousHandler = () => {
    setPage((prev) => {
      if (prev === 1) return;
      return prev - 1;
    });
  };

  const nextHandler = () => {
    if (page === pageCount) return;
    setPage((prev) => prev + 1);
  };

  const onChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  return (
    <>
      <input className="search-input" value={search} onChange={onChange} placeholder="Search..." type="text" name="search" id="search" />
      {loading ? (
        <ReactLoading
          className="loading"
          type="bubbles"
          color="slategrey"
          height={"10%"}
          width={"10%"}
        />
      ) : error ? (
        <>
          <h1 className="error">{error}</h1>
        </>
      ) : (
        <>
          <div className="posts-container">
            {posts.length > 0
              ? posts.map((post) => {
                  return (
                    <Post
                      key={post._id}
                      post={post}
                      onDelete={handleDeleteClick}
                    />
                  );
                })
              : search === "" ? <h1 className="error">No posts available</h1> : <h1 className="error">No Results found for "{search}"</h1>}
          </div>
          <div className="pagination">
            <button disabled={page === 1} onClick={previousHandler}>
              Previous
            </button>
            <button disabled={page === pageCount} onClick={nextHandler}>
              Next
            </button>
          </div>
          {showModal ? (
            <PostDeleteModal
              closeModal={closeModal}
              setShowModal={setShowModal}
              postId={selectedPost.id}
              postTitle={selectedPost.title}
              onHome={true}
            />
          ) : null}
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default Home;
