// src/pages/CreatePost.jsx

import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    categories: [],
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Available categories
  const availableCategories = [
    "Technology",
    "Lifestyle",
    "Business",
    "Design",
    "Sports",
    "Entertainment",
    "General",
  ];

  const toggleCategory = (cat) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const submitPost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);

    // FIX → Send JSON array properly
    fd.append("categories", JSON.stringify(form.categories));

    if (image) fd.append("coverImage", image);

    try {
      await api.post("/posts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post created!");

      // reset
      setForm({ title: "", content: "", categories: [] });
      setImage(null);

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-4">

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        ✍️ Create New Post
      </motion.h1>

      <motion.form
        onSubmit={submitPost}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-5 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-gray-200 shadow-lg"
      >
        {/* Title */}
        <div>
          <label className="text-sm text-gray-700 font-medium">Title</label>
          <input
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            placeholder="Enter post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-sm text-gray-700 font-medium">Content</label>
          <textarea
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            rows={8}
            placeholder="Write your post content..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          ></textarea>
        </div>

        {/* Categories (MULTIPLE) */}
        <div>
          <label className="text-sm text-gray-700 font-medium">
            Select Categories
          </label>

          <div className="flex flex-wrap gap-3 mt-2">
            {availableCategories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleCategory(cat);
                }}
                className={`px-4 py-2 text-sm rounded-full border transition-all ${
                  form.categories.includes(cat)
                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="text-sm text-gray-700 font-medium mb-1 block">
            Cover Image
          </label>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex flex-col items-center justify-center border-2 border-dashed
                       border-gray-300 rounded-lg p-6 cursor-pointer bg-gray-50 hover:bg-gray-100
                       transition"
            onClick={() => document.getElementById("imageUpload").click()}
          >
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {!image ? (
              <div className="text-center">
                <p className="text-gray-500 text-sm">Click to upload an image</p>
                <p className="text-gray-400 text-xs mt-1">PNG, JPG, JPEG allowed</p>
              </div>
            ) : (
              <div className="w-full">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={URL.createObjectURL(image)}
                  className="w-full h-56 object-cover rounded-lg border"
                  alt="Preview"
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Publish Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg 
                     font-medium hover:bg-purple-700 transition disabled:bg-gray-400"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </motion.button>
      </motion.form>
    </div>
  );
}
