import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getCars } from "../services/carService";
import CarCard from "../components/CarCard";

const Home = () => {
  const [myCars, setMyCars] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

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
  }, []);

  if (!user) {
    return (
      <div className="container">
        <p>Please login first.</p>
      </div>
    );
  }

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
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
