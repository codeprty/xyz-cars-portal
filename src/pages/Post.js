import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createCar } from "../services/carService";

const Post = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [registration, setRegistration] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to post a car.");
      return;
    }

    try {
      await createCar({
        make,
        model,
        registration,
        price: Number(price),
        description,
        userId: user.id,
      });
      alert("Car posted successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error posting car:", error);
      alert("Failed to post car.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Post Car</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Make:</label>
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Model:</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Registration:</label>
            <input
              type="text"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
