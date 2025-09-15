// src/components/CarCard.js
import React from "react";
import { Link } from "react-router-dom";

const CarCard = ({ car }) => {
  return (
    <Link to={`/cars/${car.id}`} className="car-card">
      <strong>
        {car.make} {car.model}
      </strong>
      <p>${car.price}</p>
    </Link>
  );
};

export default CarCard;
