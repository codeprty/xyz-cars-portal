// This page displays detailed information about a single car.
// Users can view the car's make, model, registration, price, and description.
// If the logged-in user is the owner of the car, they can also edit or delete it.
// It uses the CarForm component when in "edit mode".

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCarById, updateCar, deleteCar } from "../services/carService";
import CarForm from "../components/CarForm";

const CarDetails = () => {
  const { id } = useParams();              // Get car ID from the URL
  const navigate = useNavigate();          // Used to navigate programmatically

  const [car, setCar] = useState(null);    // Store the selected car data
  const [loading, setLoading] = useState(true); 
  const [editMode, setEditMode] = useState(false); // Switch between view/edit mode

  // Get the currently logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch car data by ID when the page loads or when ID changes
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCarById(id);
        setCar(data);
      } catch (err) {
        console.error("Failed to load car:", err);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // Show loading or error states
  if (loading) return <p>Loading...</p>;
  if (!car)
    return (
      <div>
        <Navbar />
        <div className="container">
          <p>Car not found.</p>
        </div>
      </div>
    );

  // Check if the current user owns this car (can edit/delete if true)
  const isOwner = user && car.userId === user.id;

  // Save changes when editing a car
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        ...car,
        price: Number(car.price), // ensure price is a number
      };
      await updateCar(car.id, updated);
      alert("Car updated successfully.");
      setEditMode(false);

      // Fetch latest car data after update
      const fresh = await getCarById(car.id);
      setCar(fresh);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update car.");
    }
  };

  // Delete the car if the user confirms
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await deleteCar(car.id);
      alert("Car deleted.");
      navigate("/home"); // redirect to homepage after deletion
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete car.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Car Details</h1>

        {!editMode ? (
          // View mode: show car details
          <div className="car-details">
            <p>
              <strong>Make:</strong> {car.make}
            </p>
            <p>
              <strong>Model:</strong> {car.model}
            </p>
            <p>
              <strong>Registration:</strong> {car.registration}
            </p>
            <p>
              <strong>Price:</strong> ${car.price}
            </p>
            <p>
              <strong>Description:</strong> {car.description}
            </p>

            {/* Action buttons */}
            <div className="form-actions">
              <button onClick={() => navigate(-1)}>Back</button>
              {isOwner && (
                <>
                  <button onClick={() => setEditMode(true)}>Edit</button>
                  <button onClick={handleDelete} className="btn-danger">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          // Edit mode: show form for editing the car
          <CarForm
            car={car}
            setCar={setCar}
            onSubmit={handleSave}
            onCancel={() => setEditMode(false)}
            submitLabel="Update"
          />
        )}
      </div>
    </div>
  );
};

export default CarDetails;
