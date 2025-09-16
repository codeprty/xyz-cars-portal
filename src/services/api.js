// This file sets up a reusable Axios instance for making HTTP requests.
// It points to our backend server (json-server) running on localhost:5000.
// Other service files (e.g., carService.js) will import and use this instance.

import axios from "axios";

// Create an Axios instance with a predefined base URL.
// This avoids repeating "http://localhost:5000" in every request.
const api = axios.create({
  baseURL: "http://localhost:5000", // backend server address
});

export default api; // export so other files can use this instance
