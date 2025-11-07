import api from "./api";

export const getProducts = async () => {
  const resp = await api.get("/products");
  return resp.data;
};

export const createProduct = async (data) => {
  return api.post("/products", data);
};

export const updateProduct = async (id, data) => {
  return api.put(`/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  return api.delete(`/products/${id}`);
};
