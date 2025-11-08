import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { simulatePayment } from "../services/paymentService";

const PaymentSimulation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCheckout = async () => {
  try {
    const resp = await simulatePayment(id, "success");
    if (resp && resp.message) {
      alert("Payment successful!");
      navigate("/orders");
    } else {
      alert("Unexpected response from server.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Checkout failed. Please try again.");
  }
};


  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Checkout</h1>
        <p><strong>Order ID:</strong> {id}</p>
        <p>Click below to confirm your payment.</p>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default PaymentSimulation;
