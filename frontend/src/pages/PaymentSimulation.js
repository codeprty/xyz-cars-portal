// frontend/src/pages/PaymentSimulation.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { simulatePayment } from "../services/paymentService";

const PaymentSimulation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSimulate = async (result) => {
    try {
      const resp = await simulatePayment(id, result);
      alert(`Payment ${result}: ${resp.message}`);
      navigate("/orders");
    } catch (err) {
      alert("Payment simulation failed.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Payment Simulation</h1>
        <p>Order ID: {id}</p>
        <p>Select payment result to simulate:</p>
        <button onClick={() => handleSimulate("success")}>Simulate Success</button>
        <button onClick={() => handleSimulate("fail")}>Simulate Failure</button>
      </div>
    </div>
  );
};

export default PaymentSimulation;
