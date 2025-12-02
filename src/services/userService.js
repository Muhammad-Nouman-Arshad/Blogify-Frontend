// src/services/userService.js

import api from "./api";

const userService = {
  // Get current user's profile
  getProfile: async () => {
    const res = await api.get("/users/profile");
    return res.data;
  },

  // Update profile
  updateProfile: async (updates) => {
    const res = await api.put("/users/profile", updates);
    return res.data;
  },

  // Admin: get all users
  getAllUsers: async () => {
    const res = await api.get("/users");
    return res.data;
  },

  // Admin: delete user
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

export default userService;
