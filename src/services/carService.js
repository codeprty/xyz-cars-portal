// This file contains functions for interacting with the "cars" API endpoint.
// Each function uses the shared Axios instance from api.js to send requests
// to our backend (json-server).
// These functions are imported into pages (e.g., Home, CarDetails) 
// to handle CRUD (Create, Read, Update, Delete) operations for cars.

import api from "./api";

// Fetch all cars from the backend
export const getCars = async () => {
  const response = await api.get("/cars");
  return response.data;
};

// Fetch a single car by its ID
export const getCarById = async (id) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};

// Create a new car entry
export const createCar = async (carData) => {
  return api.post("/cars", carData);
};

// Update an existing car by ID
export const updateCar = async (id, carData) => {
  return api.put(`/cars/${id}`, carData);
};

// Delete a car by ID
export const deleteCar = async (id) => {
  return api.delete(`/cars/${id}`);
};
