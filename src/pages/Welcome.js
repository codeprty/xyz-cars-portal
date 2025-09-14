import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="container">
      <h1>Welcome to XYZ Cars Portal</h1>
      <p className="subtitle">Your one-stop portal for buying and selling cars</p>

      <div className="welcome-links">
        <p>
          New here? <Link to="/register">Register</Link>
        </p>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
