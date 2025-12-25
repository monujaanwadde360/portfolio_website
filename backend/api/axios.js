import axios from "axios";

const api = axios.create({
  baseURL: "https://portfolio-website-frontend-7hx4.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
