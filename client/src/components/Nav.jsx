import React, { useContext } from "react";
import { Link,useNavigate } from "react-router-dom";

import { authContext } from "../context/authProvider";

const Nav = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(authContext);

  const onClick = (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <div className="nav">
      <h1>Blogs </h1>
      <ul>
        {user ? (
          <>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/create_post'>Create Post</Link></li>
            <li><Link to='/profile'>Profile</Link></li>
            <li><button onClick={onClick}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/register' >Register</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Nav;
