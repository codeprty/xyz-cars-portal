import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProducts } from "../services/productService";
import { createOrder } from "../services/orderService";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      alert("Failed to load products.");
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const totalPrice = cart.reduce((sum, p) => sum + Number(p.price), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    const businessId = cart[0].businessId || 1;
    const orderItems = cart.map(p => ({ id: p.id, name: p.name, price: p.price }));

    try {
      const newOrder = await createOrder({ businessId, orderItems, totalPrice });
      alert("Order placed! Proceeding to payment simulation...");
      navigate(`/payment/${newOrder.id}`);
    } catch (err) {
      alert("Failed to place order.");
    }
  };

  if (!user) return <p>Please log in first.</p>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Cart</h1>

        <h3>Available Products</h3>
        <ul className="list">
          {products.map((p) => (
            <li key={p.id}>
              {p.name} — RM{p.price}
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </li>
          ))}
        </ul>

        <h3>Your Cart</h3>
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
