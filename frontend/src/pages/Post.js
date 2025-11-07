import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createCar } from "../services/carService";
import CarForm from "../components/CarForm";

const Post = () => {
  const [car, setCar] = useState({
    make: "",
    model: "",
    registration: "",
    price: "",
    description: "",
  });

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
        ...car,
        price: Number(car.price),
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
