import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import { getBusinesses } from "../services/businessService";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", businessId: "" });
  const [editing, setEditing] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadProducts();
    loadBusinesses();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      alert("Failed to load products.");
    }
  };

  const loadBusinesses = async () => {
    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch {
      console.error("Failed to load businesses for dropdown.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...newProduct,
        price: Number(newProduct.price),
      });
      setNewProduct({ name: "", price: "", businessId: "" });
      await loadProducts();
    } catch {
      alert("Failed to create product.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editing.id, editing);
      setEditing(null);
      await loadProducts();
    } catch {
      alert("Failed to update product.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch {
      alert("Failed to delete product.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Products</h1>

        {isAdmin && (
          <form onSubmit={handleCreate} className="form-inline">
            <input
              type="text"
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
            <select
              value={newProduct.businessId}
              onChange={(e) => setNewProduct({ ...newProduct, businessId: e.target.value })}
              required
            >
              <option value="">Select Business</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <button type="submit">Add</button>
          </form>
        )}

        <ul className="list">
          {products.map((p) => (
            <li key={p.id} className="list-item">
              {editing && editing.id === p.id ? (
                <form onSubmit={handleUpdate} className="form-inline">
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    required
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditing(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <strong>{p.name}</strong> — RM{p.price}  
                  {isAdmin && (
                    <>
                      <button onClick={() => setEditing(p)}>Edit</button>
                      <button onClick={() => handleDelete(p.id)}>Delete</button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;
