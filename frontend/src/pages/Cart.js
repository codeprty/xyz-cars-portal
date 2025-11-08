import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { createOrder } from "../services/orderService";

const Cart = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));
  const user = JSON.parse(localStorage.getItem("user"));

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const totalPrice = cart.reduce((sum, p) => sum + Number(p.price), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    const businessId = cart[0].businessId || 1;
    const orderItems = cart.map(p => ({ id: p.id, name: p.name, price: p.price }));

    try {
      const newOrder = await createOrder({ businessId, orderItems, totalPrice });
      alert("Order placed! Proceeding to payment simulation...");
      window.location.href = `/payment-simulation/${newOrder.id}`;
    } catch (err) {
      alert("Failed to place order.");
    }
  };

  if (!user) return <p>Please log in first.</p>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <p>Cart is empty.</p>
        ) : (
          <>
            <ul className="list">
              {cart.map((item, i) => (
                <li key={i}>
                  {item.name} — RM{item.price}
                  <button onClick={() => removeFromCart(i)}>Remove</button>
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> RM{totalPrice}</p>
            <button onClick={handlePlaceOrder}>Place Order</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
