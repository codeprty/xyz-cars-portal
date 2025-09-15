import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCarById, updateCar, deleteCar } from "../services/carService";
import CarForm from "../components/CarForm";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

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

  const isOwner = user && car.userId === user.id;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        ...car,
        price: Number(car.price),
      };
      await updateCar(car.id, updated);
      alert("Car updated successfully.");
      setEditMode(false);
      const fresh = await getCarById(car.id);
      setCar(fresh);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update car.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await deleteCar(car.id);
      alert("Car deleted.");
      navigate("/home");
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
