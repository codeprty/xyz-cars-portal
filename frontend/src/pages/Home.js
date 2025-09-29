// This page displays the logged-in user's personal car listings.
// It fetches all cars from the backend and filters them based on the user's ID.

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Navigation bar component
import { getCars } from "../services/carService"; // API call to fetch cars
import CarCard from "../components/CarCard"; // Reusable card to display car details

const Home = () => {
  const [myCars, setMyCars] = useState([]); // State to store user's cars
  const user = JSON.parse(localStorage.getItem("user")); // Get current logged-in user from local storage

  // Fetch cars when the component loads
  useEffect(() => {
  if (!user) return;

  const fetchMyCars = async () => {
    try {
      const allCars = await getCars();
      const userCars = allCars.filter((car) => car.userId === user.id);
      setMyCars(userCars);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  fetchMyCars();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // If no user is logged in, show login reminder
  if (!user) {
    return (
      <div className="container">
        <p>Please login first.</p>
      </div>
    );
  }

  // If user is logged in, show their car listings
  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Hi, {user.name}!</h2>
        <h3>Your Listings:</h3>
        {myCars.length === 0 ? (
          <p>You don't have any car listings yet.</p>
        ) : (
          <div className="car-grid">
            {myCars.map((car) => (
              <CarCard key={car.id} car={car} /> // Render each car using CarCard component
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
