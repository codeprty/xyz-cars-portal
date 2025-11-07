import api from "./api";

export const simulatePayment = async (orderId, result) => {
  const resp = await api.post("/payment/simulate", { orderId, result });
  return resp.data;
};
