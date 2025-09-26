// This page allows users to search for cars based on multiple filters:
// Make, Model, Registration number, and Price range. 
// It fetches cars from the backend and applies client-side filtering.

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getCars } from "../services/carService";
import CarCard from "../components/CarCard";

const Search = () => {
  // State variables for all cars, filtered cars, and search filters
  const [cars, setCars] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [registration, setRegistration] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Fetch all cars once on component mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCars(); // Get car list from backend
        setCars(data);
        setFiltered(data); // Initially show all cars
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      }
    };
    fetch();
  }, []);

  // Handle search filter submission
  const handleSearch = (e) => {
    e.preventDefault();

    // Convert price fields to numbers (or null if empty)
    const min = priceMin === "" ? null : Number(priceMin);
    const max = priceMax === "" ? null : Number(priceMax);

    // Apply filters to car list
    const result = cars.filter((car) => {
      const matchMake =
        make.trim() === "" ||
        car.make.toLowerCase().includes(make.trim().toLowerCase());
      const matchModel =
        model.trim() === "" ||
        car.model.toLowerCase().includes(model.trim().toLowerCase());
      const matchReg =
        registration.trim() === "" ||
        car.registration.toLowerCase().includes(registration.trim().toLowerCase());
      const matchPrice =
        (min === null || Number(car.price) >= min) &&
        (max === null || Number(car.price) <= max);

      return matchMake && matchModel && matchReg && matchPrice;
    });

    setFiltered(result); // Update search results
  };

  // Reset all filters and show full list
  const handleReset = () => {
    setMake("");
    setModel("");
    setRegistration("");
    setPriceMin("");
    setPriceMax("");
    setFiltered(cars);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Search Cars</h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-inline">
            {/* Search input fields */}
            <input
              type="text"
              placeholder="Make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
            <input
              type="text"
              placeholder="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <input
              type="text"
              placeholder="Registration"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
            />
            <input
              type="number"
              placeholder="Min Price"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button type="submit">Search</button>
            <button type="button" onClick={handleReset} className="btn-secondary">
              Reset
            </button>
          </div>
        </form>

        {/* Search results */}
        <h3>Results ({filtered.length})</h3>
        {filtered.length === 0 ? (
          <p>No cars found.</p>
        ) : (
          <div className="car-grid">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
