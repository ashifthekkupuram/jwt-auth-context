import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { authContext } from "../context/authProvider";

const AuthenticatedRoute = ({ children }) => {
  const { user } = useContext(authContext);

  return user ? <Navigate to="/" /> : children;
};

export default AuthenticatedRoute;
