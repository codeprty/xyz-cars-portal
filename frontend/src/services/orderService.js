import api from "./api";

export const getOrders = async () => {
  const resp = await api.get("/orders");
  return resp.data;
};

export const createOrder = async (data) => {
  const resp = await api.post("/orders", data);
  return resp.data;
};

export const updateOrder = async (id, data) => {
  const resp = await api.put(`/orders/${id}`, data);
  return resp.data;
};

export const deleteOrder = async (id) => {
  const resp = await api.delete(`/orders/${id}`);
  return resp.data;
};
