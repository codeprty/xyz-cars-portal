// src/services/userService.js
import api from "./api";

export const registerUser = async (userData) => {
  return api.post("/users", userData);
};

export const loginUser = async (email, password) => {
  const response = await api.get(`/users?email=${email}&password=${password}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
