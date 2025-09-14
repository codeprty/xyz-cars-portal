import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getCars } from "../services/carService";
import { Link } from "react-router-dom";

const Home = () => {
  const [myCars, setMyCars] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMyCars = async () => {
      if (user) {
        const allCars = await getCars();
        const userCars = allCars.filter((car) => car.userId === user.id);
        setMyCars(userCars);
      }
    };
    fetchMyCars();
  }, [user]);

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
              <Link to={`/cars/${car.id}`} key={car.id} className="car-card">
                <strong>{car.make} {car.model}</strong>
                <p>${car.price}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
