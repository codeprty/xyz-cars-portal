import api from "./api";

// ✅ Get token from localStorage for all requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");
  return { Authorization: `Bearer ${token}` };
};

export const getOrders = async () => {
  const resp = await api.get("/orders", { headers: getAuthHeader() });
  return resp.data;
};

export const createOrder = async (data) => {
  try {
    const resp = await api.post("/orders", data, { headers: getAuthHeader() });
    return resp.data;
  } catch (err) {
    console.error("Create order error:", err.response?.data || err.message);
    throw new Error("Failed to create order");
  }
};

export const updateOrder = async (id, data) => {
  const resp = await api.put(`/orders/${id}`, data, { headers: getAuthHeader() });
  return resp.data;
};

export const deleteOrder = async (id) => {
  const resp = await api.delete(`/orders/${id}`, { headers: getAuthHeader() });
  return resp.data;
};
