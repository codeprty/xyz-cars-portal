import api from "./api";

export const getCars = async () => {
  const response = await api.get("/cars");
  return response.data;
};

export const getCarById = async (id) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};

export const createCar = async (carData) => {
  return api.post("/cars", carData);
};

export const updateCar = async (id, carData) => {
  return api.put(`/cars/${id}`, carData);
};

export const deleteCar = async (id) => {
  return api.delete(`/cars/${id}`);
};
