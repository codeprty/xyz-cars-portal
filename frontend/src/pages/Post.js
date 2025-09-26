// This page allows a logged-in user to create (post) a new car listing.
// It uses CarForm for input and saves the new car to the backend via carService.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";      // Reusable navigation bar
import { createCar } from "../services/carService"; // API service for creating cars
import CarForm from "../components/CarForm";   // Reusable form for car details

const Post = () => {
  // State to hold new car details
  const [car, setCar] = useState({
    make: "",
    model: "",
    registration: "",
    price: "",
    description: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form reload

    // Ensure only logged-in users can post
    if (!user) {
      alert("You must be logged in to post a car.");
      return;
    }

    try {
      // Create a new car listing
      await createCar({
        ...car,
        price: Number(car.price), // Ensure price is stored as number
        userId: user.id,          // Attach car to current user
      });
      alert("Car posted successfully!");
      navigate("/home"); // Redirect to Home page
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
        {/* Reuse CarForm component for input fields */}
        <CarForm
          car={car}
          setCar={setCar}
          onSubmit={handleSubmit}
          submitLabel="Post"
        />
      </div>
    </div>
  );
};

export default Post;
