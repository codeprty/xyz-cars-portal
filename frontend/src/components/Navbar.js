// This component renders the navigation bar for the app.
// It provides links to Home, Search, Post, and a Logout action.
// Logout clears the saved user info from localStorage and redirects to Login.

import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout action:
  // - Prevents default link behavior
  // - Removes user info from localStorage
  // - Shows a logout confirmation alert
  // - Redirects user to Login page
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("You have been logged out.");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Navigation links to different pages */}
      <Link to="/home">Home</Link>
      <Link to="/search">Search</Link>
      <Link to="/post">Post</Link>
      {/* Logout is handled via onClick, not a real link */}
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </nav>
  );
};

export default Navbar;
