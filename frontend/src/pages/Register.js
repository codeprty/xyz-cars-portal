// This page allows new users to create an account.
// It collects basic details (name, email, password) and saves them to the backend.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService"; // API service for user registration

const Register = () => {
  // State variables to store form input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevents page reload

    try {
      // Call API to register a new user
      await registerUser({ name, email, password });
      alert("Account created successfully!");
      navigate("/login"); // Redirect user to login page
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to create account.");
    }
  };

  return (
    <div className="container">
      <h1>Create an Account</h1>
      <form onSubmit={handleRegister} className="register-form">
        {/* Name field */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

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
            placeholder="Enter a password"
            required
          />
        </div>

        {/* Submit button */}
        <div className="form-actions">
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
