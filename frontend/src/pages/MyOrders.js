import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getOrders, updateOrder } from "../services/orderService";
import api from "../services/api"; // new import for direct post

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      alert("Failed to load orders.");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateOrder(id, { status: newStatus });
      await loadOrders();
    } catch {
      alert("Failed to update status.");
    }
  };

  const isAdmin = user?.role === "admin";
  if (!user) return <p>Please log in first.</p>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>{isAdmin ? "All Orders" : "My Orders"}</h1>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="list">
  {orders.map((o) => (
    <li key={o.id}>
      <strong>Order #{o.id}</strong> — RM{o.totalPrice} — {o.status}
      <ul>
        {o.orderItems.map((item, i) => (
          <li key={i}>{item.name} (RM{item.price})</li>
        ))}
      </ul>

      {isAdmin ? (
        <>
          <select
            value={o.status}
            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button
            onClick={async () => {
              try {
                const resp = await api.post(`/orders/${o.id}/next-status`);
                alert(resp.data.message);
                await loadOrders();
              } catch (err) {
                alert("Failed to move to next status.");
              }
            }}
          >
            Next Status
          </button>
        </>
      ) : (
        <p>
          <em>Tracking: {o.status}</em>
        </p>
      )}
    </li>
  ))}
</ul>

        )}
      </div>
    </div>
  );
};

export default MyOrders;
