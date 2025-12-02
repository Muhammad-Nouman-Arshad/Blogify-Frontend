// src/services/postService.js

import api from "./api";

const postService = {
  // Get all posts
  getPosts: async () => {
    const res = await api.get("/posts");
    return res.data;
  },

  // Get single post
  getPostById: async (id) => {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  },

  // Create post (form-data)
  createPost: async (formData) => {
    const res = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Update post
  updatePost: async (id, formData) => {
    const res = await api.put(`/posts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Delete post
  deletePost: async (id) => {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  // Like / Unlike post
  toggleLike: async (id) => {
    const res = await api.post(`/posts/${id}/like`);
    return res.data;
  },
};

export default postService;
