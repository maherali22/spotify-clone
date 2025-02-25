import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3006",
  withCredentials: true,
});

// Add a request interceptor to attach the token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if in a browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
