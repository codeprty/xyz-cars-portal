// This file contains functions for interacting with the "users" API endpoint.
// It handles authentication (login/register) and fetching user data.
// These functions are imported into pages like Login and Register
// to handle user-related operations.

import api from "./api";

// Register a new user by sending user data to the backend
export const registerUser = async (userData) => {
  return api.post("/users", userData);
};

// Log in a user by checking their email and password
// NOTE: Since this uses json-server, the password check happens by querying
// the mock database. In a real app, authentication should be more secure.
export const loginUser = async (email, password) => {
  const response = await api.get(`/users?email=${email}&password=${password}`);
  return response.data; // returns an array (empty if no match, otherwise user)
};

// Fetch all registered users (used mainly for debugging or admin features)
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
