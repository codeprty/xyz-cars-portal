// This is the main entry point of the React application.
// It sets up routing for all pages using React Router.

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Post from "./pages/Post";
import CarDetails from "./pages/CarDetails";
import OAuthCallback from "./pages/OAuthCallback";
import './App.css';

function App() {
  return (
    <Router>
      {/* Define application routes */}
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Welcome />} />
        {/* User registration page */}
        <Route path="/register" element={<Register />} />
        {/* User login page */}
        <Route path="/login" element={<Login />} />
        {/* Home page (after login) */}
        <Route path="/home" element={<Home />} />
        {/* Car search page */}
        <Route path="/search" element={<Search />} />
        {/* Post a new car listing */}
        <Route path="/post" element={<Post />} />
        {/* Car details page (dynamic route with car ID) */}
        <Route path="/cars/:id" element={<CarDetails />} />
        {/* GitHub OAuth Login Integration ) */}
        <Route path="/oauth-callback" element={<OAuthCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
