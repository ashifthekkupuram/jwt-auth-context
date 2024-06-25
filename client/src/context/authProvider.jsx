import { createContext, useEffect, useState } from "react";

import axios from "../api/axios";

export const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.post("/auth/verify", { token });
          setUser(response.data.data);
        } catch (err) {
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    verifyToken();
  }, []);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <authContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
