// frontend/src/services/paymentService.js

import axios from "axios";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

/**
 * Simulate payment
 * Calls the correct backend route: /api/payment/simulate
 */
export const simulatePayment = async (orderId, result = "success") => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");

  try {
    const resp = await axios.post(
      `${BACKEND}/api/payment/simulate`,   // ✅ FIXED: added /api
      { orderId: Number(orderId), result }, // ensure orderId is number
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return resp.data;
  } catch (err) {
    console.error("simulatePayment error:", err.response?.data || err.message);
    throw err;
  }
};
