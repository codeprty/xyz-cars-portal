import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); // prevent default link behavior
    localStorage.removeItem("user");
    alert("You have been logged out.");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/home">Home</Link>
      <Link to="/search">Search</Link>
      <Link to="/post">Post</Link>
      <a href="/logout" onClick={handleLogout}>Logout</a>
    </nav>
  );
};

export default Navbar;
