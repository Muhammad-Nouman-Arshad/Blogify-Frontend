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

  const [loading, setLoading] = useState(false);

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

    try {
      await api.post("/posts", {
        title: form.title,
        content: form.content,
        categories: form.categories, // ⭐ correctly sends array
      });

      toast.success("Post created!");

      // Reset form
      setForm({
        title: "",
        content: "",
        categories: [],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-4">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-bold text-gray-900 mb-6"
      >
        ✍️ Create New Post
      </motion.h1>

      <motion.form
        onSubmit={submitPost}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col gap-6 bg-white/80 backdrop-blur-xl 
                   p-6 rounded-2xl shadow-lg border border-gray-200"
      >
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            placeholder="Enter post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium text-gray-700">Content</label>
          <textarea
            className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300
                       focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            rows={8}
            placeholder="Write your post content..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
        </div>

        {/* Categories */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Select Categories
          </label>

          <div className="flex flex-wrap gap-3 mt-2">
            {availableCategories.map((cat) => {
              const active = form.categories.includes(cat);
              return (
                <motion.button
                  key={cat}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleCategory(cat)}
                  className={`
                    px-4 py-2 rounded-full text-sm border transition-all 
                    ${
                      active
                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-purple-600 text-white 
                     font-semibold shadow-md hover:bg-purple-700 
                     transition disabled:bg-gray-400"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </motion.button>
      </motion.form>
    </div>
  );
}
