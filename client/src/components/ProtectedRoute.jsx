import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { authContext } from "../context/authProvider";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(authContext);

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
