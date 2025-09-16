// This component is responsible for displaying a single car's basic details (make, model, and price).
// It is designed as a reusable card that links to the detailed page of the selected car.

import { Link } from "react-router-dom";

const CarCard = ({ car }) => {
  return (
    // Wrap the car information in a clickable Link that navigates to the car's detail page
    <Link to={`/cars/${car.id}`} className="car-card">
      {/* Display car make and model */}
      <strong>
        {car.make} {car.model}
      </strong>
      {/* Display car price */}
      <p>${car.price}</p>
    </Link>
  );
};

export default CarCard;
