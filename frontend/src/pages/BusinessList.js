import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getBusinesses, createBusiness, updateBusiness, deleteBusiness } from "../services/businessService";

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [newBusiness, setNewBusiness] = useState({
  name: "",
  businessType: "",
  location: "",
  contact: "",
  description: ""
});
  const [editing, setEditing] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.error("Failed to load businesses:", err);
      alert("Failed to load businesses.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createBusiness(newBusiness);
      setNewBusiness({ name: "", description: "" });
      await loadBusinesses();
    } catch (err) {
      alert("Failed to create business.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateBusiness(editing.id, editing);
      setEditing(null);
      await loadBusinesses();
    } catch (err) {
      alert("Failed to update business.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this business?")) return;
    try {
      await deleteBusiness(id);
      await loadBusinesses();
    } catch (err) {
      alert("Failed to delete business.");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Businesses</h1>

        {isAdmin && (
          <form onSubmit={handleCreate} className="form-inline">
  <input
    type="text"
    placeholder="Name"
    value={newBusiness.name}
    onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
    required
  />
  <input
    type="text"
    placeholder="Type"
    value={newBusiness.businessType}
    onChange={(e) => setNewBusiness({ ...newBusiness, businessType: e.target.value })}
  />
  <input
    type="text"
    placeholder="Location"
    value={newBusiness.location}
    onChange={(e) => setNewBusiness({ ...newBusiness, location: e.target.value })}
  />
  <input
    type="text"
    placeholder="Contact"
    value={newBusiness.contact}
    onChange={(e) => setNewBusiness({ ...newBusiness, contact: e.target.value })}
  />
  <input
    type="text"
    placeholder="Description"
    value={newBusiness.description}
    onChange={(e) => setNewBusiness({ ...newBusiness, description: e.target.value })}
  />
  <button type="submit">Add</button>
</form>

        )}

        <ul className="list">
  {businesses.map((b) => (
    <li key={b.id} className="list-item">
      <strong>{b.name}</strong> ({b.businessType})  
      <p>📍 {b.location} | ☎ {b.contact}</p>
      <p>{b.description}</p>

      {isAdmin && (
        <>
          <button onClick={() => setEditing(b)}>Edit</button>
          <button onClick={() => handleDelete(b.id)}>Delete</button>
        </>
      )}
    </li>
  ))}
</ul>

      </div>
    </div>
  );
};

export default BusinessList;
