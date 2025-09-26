// This page allows users to log in with their email and password.
// If the login is successful, the user data is stored in localStorage and the user is redirected to the Home page.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Used for page navigation
import { loginUser } from "../services/userService"; // Service function for login

const Login = () => {
  // State to hold form input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form reload

    try {
      const users = await loginUser(email, password); // Attempt login
      if (users.length > 0) {
        // If a matching user is found
        const user = users[0];
        localStorage.setItem("user", JSON.stringify(user)); // Save user data to localStorage
        localStorage.setItem("token", "local-login");
        alert("Login successful!");
        navigate("/home"); // Redirect to home page
      } else {
        alert("Invalid email or password."); // Show error if login fails
      }
    } catch (error) {
      console.error("Login error:", error); // Log error to console
      alert("Login failed."); // Show error message
    }
  };

  // GitHub OAuth Login Integration
  const handleGithubLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/github/login`;
  };

  return (
    <div className="container">
      <h1>Login</h1>
      {/* Login form */}
      <form onSubmit={handleLogin} className="login-form">
        {/* Email field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        {/* Password field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {/* Submit button */}
        <div className="form-actions">
          <button type="submit">Login</button>
        </div>
      </form>
      {/* Login with GitHub button */}
      <div className="oauth-login form-actions">
        <button onClick={handleGithubLogin} className="github-btn">
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
