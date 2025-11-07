import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Post from "./pages/Post";
import CarDetails from "./pages/CarDetails";
import OAuthCallback from "./pages/OAuthCallback";
import BusinessList from "./pages/BusinessList";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import PaymentSimulation from "./pages/PaymentSimulation";

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/post" element={<Post />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/businesses" element={<BusinessList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/payment/:id" element={<PaymentSimulation />} />
      </Routes>
    </Router>
  );
}

export default App;
