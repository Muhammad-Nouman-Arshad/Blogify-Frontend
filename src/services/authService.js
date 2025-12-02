// src/services/authService.js

import api from "./api";

const authService = {
  register: async (formData) => {
    const res = await api.post("/auth/register", formData);
    return res.data;
  },

  login: async (formData) => {
    const res = await api.post("/auth/login", formData);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
