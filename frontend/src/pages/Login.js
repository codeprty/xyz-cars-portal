import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const users = await loginUser(email, password);
      if (users.length > 0) {
        const user = users[0];
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", "local-login");
        alert("Login successful!");
        navigate("/home");
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed.");
    }
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/github/login`;
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
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
        <div className="form-actions">
          <button type="submit">Login</button>
        </div>
      </form>
      <div className="oauth-login form-actions">
        <button onClick={handleGithubLogin} className="github-btn">
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
