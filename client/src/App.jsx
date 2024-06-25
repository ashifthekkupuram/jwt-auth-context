import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import {
  Home,
  Login,
  Register,
  NotFound404,
  Profile,
  ProfileForm,
  PostForm,
  PostDetail,
  User,
} from "./pages";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/login"
            element={
              <AuthenticatedRoute>
                <Login />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthenticatedRoute>
                <Register />
              </AuthenticatedRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile_form"
            element={
              <ProtectedRoute>
                <ProfileForm />
              </ProtectedRoute>
            }
          />
          ,
          <Route
            path="/create_post"
            element={
              <ProtectedRoute>
                <PostForm updating={false} />
              </ProtectedRoute>
            }
          />
          <Route path="profile/:userId" element={<User />} />
          <Route
            path="update_post/:postId"
            element={
              <ProtectedRoute>
                <PostForm updating={true} />
              </ProtectedRoute>
            }
          />
          <Route path="/:postId" element={<PostDetail />} />
          <Route path="*" element={<NotFound404 />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
